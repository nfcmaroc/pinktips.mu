# Builds the keyword landing pages (French + English), the toes pages and one page per product.
# Reads the published Google Sheet and config.js. Run:  python build_pages.py   (then python build.py)
# Re-run it whenever products, names or prices change in the sheet, then push.
import csv
import html as H
import io
import json
import os
import re
import shutil
import unicodedata
import urllib.parse
import urllib.request

SITE = "https://pinktips.mu"
cfg = open("config.js", encoding="utf-8").read()
SHEET = re.search(r'sheet: "([^"]+)"', cfg).group(1)
WA = re.search(r'whatsapp: "(\d+)"', cfg).group(1)
DELIVERY = int(re.search(r"delivery: (\d+)", cfg).group(1))
IG = re.search(r'instagram: "([^"]+)"', cfg).group(1)
TT = re.search(r'tiktok: "([^"]+)"', cfg).group(1)


def slug(s):
    s = s.lower().replace("œ", "oe").replace("&", "et")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def esc(s):
    return H.escape(str(s), quote=True)


# ---------------- data ----------------
raw = urllib.request.urlopen(urllib.request.Request(SHEET, headers={"User-Agent": "Mozilla/5.0"}), timeout=60).read().decode("utf-8")
products = []
for r in list(csv.reader(io.StringIO(raw)))[1:]:
    if not r or not r[0].strip():
        continue
    name, var, price, photo, stock, rup = (r + [""] * 6)[:6]
    m = re.search(r"/img/products/([^/]+)\.jpg$", photo)
    products.append({
        "name": name.strip(), "variant": var.strip(), "price": int(re.sub(r"\D", "", price) or 0),
        "slug": slug(name + " " + var), "photo": photo.strip(), "base": m.group(1) if m else None,
        "out": not (stock.strip().isdigit() and int(stock) > 0) or rup.strip().lower() in ("true", "vrai", "oui", "x", "1"),
        "feet": "pieds" in (name + " " + var).lower(),
    })
assert products, "no products read from the sheet"
prices = [p["price"] for p in products]
PMIN, PMAX = min(prices), max(prices)


def pic(p, sizes, first=False):
    if p["base"]:
        b = "/img/products/" + p["base"]
        a = f'src="{b}-400.webp" srcset="{b}-400.webp 400w, {b}-800.webp 800w" sizes="{sizes}"'
    else:
        a = f'src="{esc(p["photo"])}"'
    return a + (' fetchpriority="high"' if first else ' loading="lazy"') + ' decoding="async" width="800" height="800"'


# ---------------- css ----------------
def minify(c):
    c = re.sub(r"/\*.*?\*/", "", c, flags=re.S)
    c = re.sub(r"\s+", " ", c)
    c = re.sub(r"\s*([{};,>])\s*", r"\1", c)
    return c.replace(";}", "}").strip()


CSS = minify(open("style.css", encoding="utf-8").read() + "\n" + open("pages.css", encoding="utf-8").read()).replace("url(fonts/", "url(/fonts/")

# ---------------- shared pieces ----------------
LAND = {  # key -> (fr url, en url)
    "main": ("/faux-ongles-maurice/", "/en/press-on-nails-mauritius/"),
    "toes": ("/faux-ongles-pieds-maurice/", "/en/press-on-toenails-mauritius/"),
}


def head(lang, title, desc, canon, alternates=(), ld=(), og_type="website", og_image=None):
    alts = "".join(f'<link rel="alternate" hreflang="{hl}" href="{SITE}{u}">' for hl, u in alternates)
    ldj = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in ld)
    img = og_image or SITE + "/logo/share.jpg"
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{SITE}{canon}">
{alts}<meta name="theme-color" content="#f6d5dc">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="Pink Tips">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{SITE}{canon}">
<meta property="og:image" content="{img}">
<meta property="og:locale" content="{'fr_MU' if lang == 'fr' else 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/logo/1-badge.svg">
<link rel="apple-touch-icon" href="/logo/icon-180.png">
<style>{CSS}</style>
{ldj}</head>
<body class="pg">
"""


def header(lang):
    if lang == "fr":
        nav = [("/#shop", "Boutique"), (LAND["main"][0], "Faux ongles Maurice"), (LAND["toes"][0], "Pieds"), (LAND["main"][1], "English")]
    else:
        nav = [("/#shop", "Shop"), (LAND["main"][1], "Press-on nails Mauritius"), (LAND["toes"][1], "Toenails"), (LAND["main"][0], "Français")]
    links = "".join(f'<a href="{u}">{t}</a>' for u, t in nav)
    return f'<header class="phead"><a href="/" aria-label="Pink Tips"><img src="/logo/1-badge.svg" alt="Pink Tips" width="56" height="56"></a><nav aria-label="Menu">{links}</nav></header>\n'


def footer(lang):
    links = [("/", "Boutique"), (LAND["main"][0], "Faux ongles press-on Maurice"), (LAND["toes"][0], "Faux ongles pieds Maurice"),
             (LAND["main"][1], "Press-on nails Mauritius"), (LAND["toes"][1], "Press-on toenails Mauritius"), ("/retours/", "Retours / Returns")]
    nav = "".join(f'<a href="{u}">{t}</a>' for u, t in links)
    soc = f'<a href="{IG}" rel="noopener">Instagram</a><a href="{TT}" rel="noopener">TikTok</a><a href="https://wa.me/{WA}" rel="noopener">WhatsApp</a>'
    return f'<footer class="pfoot"><img src="/logo/1-badge.svg" alt="" width="72" height="72" loading="lazy"><nav aria-label="Pink Tips">{nav}</nav><nav aria-label="Social">{soc}</nav><p>Pink Tips · pinktips.mu · Île Maurice / Mauritius</p></footer>\n</body>\n</html>\n'


def crumbs(lang, items):
    home = "Accueil" if lang == "fr" else "Home"
    parts = [f'<a href="/">{home}</a>'] + [f'<a href="{u}">{esc(t)}</a>' if u else f"<span>{esc(t)}</span>" for u, t in items]
    return '<p class="crumbs">' + " › ".join(parts) + "</p>"


def breadcrumb_ld(lang, items, url):
    home = "Accueil" if lang == "fr" else "Home"
    els = [{"@type": "ListItem", "position": 1, "name": home, "item": SITE + "/"}]
    for i, (u, t) in enumerate(items, 2):
        els.append({"@type": "ListItem", "position": i, "name": t, "item": SITE + (u or url)})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": els}


def grid(items, lang):
    out = []
    for p in items:
        label = esc(p["name"] + (f" ({p['variant']})" if p["variant"] else ""))
        out.append(f'<li class="pcard"><a href="/p/{p["slug"]}/"><img {pic(p, "(min-width: 760px) 25vw, 50vw")} alt="{label}"><b>{esc(p["name"])}</b><small>{esc(p["variant"])}</small><em>Rs {p["price"]}</em></a></li>')
    return '<ul class="pgrid">' + "".join(out) + "</ul>"


def write(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    open(path, "w", encoding="utf-8", newline="\n").write(content)


def wa_btn(lang, text=None):
    msg = "Bonjour Pinktips ! Je voudrais commander." if lang == "fr" else "Hello Pinktips! I would like to order."
    label = "Commander sur WhatsApp" if lang == "fr" else "Order on WhatsApp"
    return f'<a class="btn" href="https://wa.me/{WA}?text={urllib.parse.quote(text or msg)}" rel="noopener">{label}</a>'


# ---------------- landing pages ----------------
def landing(lang, key):
    feet = key == "toes"
    items = [p for p in products if p["feet"]] if feet else products
    if feet and not items:
        return None
    fr = lang == "fr"
    url = LAND[key][0 if fr else 1]
    alt = [("fr", LAND[key][0]), ("en", LAND[key][1]), ("x-default", LAND[key][0])]
    n = len(items)
    if fr and not feet:
        title = "Faux ongles press-on faits main à l'île Maurice | Pink Tips"
        desc = f"Faux ongles press-on faits main à l'île Maurice : {len(products)} sets réutilisables à partir de Rs {PMIN}, posés en 1 minute. Commande sur WhatsApp, livraison La Poste ou retrait à Pamplemousses."
        h1 = "Faux ongles press-on à l'île Maurice"
        lead = "Pink Tips crée des faux ongles press-on faits main à l'île Maurice : des sets réutilisables, faciles à poser en 1 minute et à retirer sans abîmer vos ongles naturels. Choisissez votre set, commandez sur WhatsApp et payez par Juice."
    elif fr and feet:
        title = "Faux ongles pour les pieds à l'île Maurice | Pink Tips"
        desc = f"Faux ongles press-on pour les pieds à l'île Maurice : {n} sets faits main à partir de Rs {min(p['price'] for p in items)}. Réutilisables, commande sur WhatsApp, livraison La Poste ou retrait à Pamplemousses."
        h1 = "Faux ongles press-on pour les pieds à l'île Maurice"
        lead = "Retrouvez chez Pink Tips des faux ongles press-on pour les pieds, faits main à l'île Maurice : des sets réutilisables à poser en 1 minute, sans salon ni rendez-vous. Commandez sur WhatsApp et payez par Juice."
    elif not feet:
        title = "Press-on nails in Mauritius | Handmade reusable sets | Pink Tips"
        desc = f"Handmade press-on nails in Mauritius: {len(products)} reusable sets from Rs {PMIN}, on in 1 minute. Order on WhatsApp, La Poste delivery or free pick-up in Pamplemousses."
        h1 = "Press-on nails in Mauritius"
        lead = "Pink Tips makes handmade press-on nails in Mauritius: reusable sets that go on in 1 minute and come off without damaging your natural nails. Pick your set, order on WhatsApp and pay by Juice."
    else:
        title = "Press-on toenails in Mauritius | Handmade sets | Pink Tips"
        desc = f"Press-on toenails in Mauritius: {n} handmade reusable sets from Rs {min(p['price'] for p in items)}. Order on WhatsApp, La Poste delivery or free pick-up in Pamplemousses."
        h1 = "Press-on toenails in Mauritius"
        lead = "Pink Tips has press-on nails for toes, handmade in Mauritius: reusable sets that go on in 1 minute, no salon and no appointment. Order on WhatsApp and pay by Juice."

    if fr:
        why_h = "Pourquoi choisir les press-on nails Pink Tips ?"
        why = [f"Faits main à l'île Maurice, en plusieurs formes (amande, carré, ovale)", "Réutilisables et faciles à retirer sans abîmer vos ongles", "Posés en 1 minute, sans salon ni rendez-vous",
               f"Livraison La Poste partout à Maurice (Rs {DELIVERY}) ou retrait gratuit à Pamplemousses", "Paiement par Juice après confirmation sur WhatsApp"]
        grid_h = "Nos faux ongles press-on pour les pieds" if feet else "Nos faux ongles press-on"
        how_h = "Comment commander vos faux ongles ?"
        how = ["Choisissez votre set dans la collection", "Commandez sur WhatsApp : nous confirmons votre commande", f"Payez par Juice : nous postons votre commande par La Poste (Rs {DELIVERY}) ou vous la retirez gratuitement à Pamplemousses"]
        faq_h = "Questions fréquentes"
        faq = [
            ("Où acheter des faux ongles press-on à l'île Maurice ?", "Chez Pink Tips : commandez sur pinktips.mu ou sur WhatsApp, avec livraison La Poste partout à Maurice ou retrait gratuit à Pamplemousses."),
            ("Combien coûtent les faux ongles press-on Pink Tips ?", f"Nos sets coûtent de Rs {PMIN} à Rs {PMAX}, plus la livraison La Poste (Rs {DELIVERY}) ou gratuit en retrait à Pamplemousses."),
            ("Comment payer ma commande ?", "Par Juice, après confirmation de votre commande sur WhatsApp."),
            ("Les faux ongles press-on sont-ils réutilisables ?", "Oui, nos sets press-on sont réutilisables et se retirent sans abîmer vos ongles."),
            ("Puis-je retourner ma commande ?", "Les retours sont acceptés uniquement pour les produits défectueux, dans les 7 jours suivant la livraison. Voir la page Retours."),
        ]
        cta_shop, other_h = "Voir toute la collection", "Voir aussi"
        other = (f'<a href="{LAND["toes"][0]}">Faux ongles pour les pieds</a>' if not feet else f'<a href="{LAND["main"][0]}">Faux ongles pour les mains</a>')
        bc = [(None, "Faux ongles pour les pieds" if feet else "Faux ongles press-on Maurice")]
        ret = "Retours et échanges"
    else:
        why_h = "Why choose Pink Tips press-on nails?"
        why = ["Handmade in Mauritius, in several shapes (almond, square, oval)", "Reusable and easy to remove without damaging your nails", "On in 1 minute, no salon and no appointment",
               f"La Poste delivery all over Mauritius (Rs {DELIVERY}) or free pick-up in Pamplemousses", "Pay by Juice after we confirm your order on WhatsApp"]
        grid_h = "Our press-on toenails" if feet else "Our press-on nails"
        how_h = "How to order your press-on nails"
        how = ["Pick your set in the collection", "Order on WhatsApp: we confirm your order", f"Pay by Juice: we post your order by La Poste (Rs {DELIVERY}) or you pick it up for free in Pamplemousses"]
        faq_h = "Frequently asked questions"
        faq = [
            ("Where can I buy press-on nails in Mauritius?", "At Pink Tips: order on pinktips.mu or on WhatsApp, with La Poste delivery all over Mauritius or free pick-up in Pamplemousses."),
            ("How much do Pink Tips press-on nails cost?", f"Our sets cost from Rs {PMIN} to Rs {PMAX}, plus La Poste delivery (Rs {DELIVERY}) or free pick-up in Pamplemousses."),
            ("How do I pay?", "By Juice, after we confirm your order on WhatsApp."),
            ("Are press-on nails reusable?", "Yes, our press-on sets are reusable and come off without damaging your nails."),
            ("Can I return my order?", "Returns are accepted for defective products only, within 7 days of delivery. See the Returns page."),
        ]
        cta_shop, other_h = "See the whole collection", "See also"
        other = (f'<a href="{LAND["toes"][1]}">Press-on toenails</a>' if not feet else f'<a href="{LAND["main"][1]}">Press-on nails for hands</a>')
        bc = [(None, "Press-on toenails Mauritius" if feet else "Press-on nails Mauritius")]
        ret = "Returns and exchanges"

    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}
    body = (head(lang, title, desc, url, alt, [breadcrumb_ld(lang, bc, url), faq_ld]) + header(lang) + '<main class="wrap">\n'
            + crumbs(lang, bc) + f"<h1>{esc(h1)}</h1>\n<p class=\"lead\">{esc(lead)}</p>\n"
            + f'<div class="btnrow">{wa_btn(lang)}<a class="ghost-btn" href="/#shop">{cta_shop}</a></div>\n'
            + f"<h2>{esc(why_h)}</h2>\n<ul class=\"tick\">" + "".join(f"<li>{esc(x)}</li>" for x in why) + "</ul>\n"
            + f"<h2>{esc(grid_h)}</h2>\n" + grid(items, lang)
            + f"<h2>{esc(how_h)}</h2>\n<ol class=\"steps3\">" + "".join(f"<li>{esc(x)}</li>" for x in how) + "</ol>\n"
            + f"<h2>{esc(faq_h)}</h2>\n" + "".join(f"<h3>{esc(q)}</h3><p>{esc(a)}</p>\n" for q, a in faq)
            + f'<p>{other_h} : {other} · <a href="/retours/">{ret}</a></p>\n</main>\n' + footer(lang))
    write(url.strip("/") + "/index.html", body)
    return url


# ---------------- product pages (bilingual: both texts in the page, product.js shows one) ----------------
def bi(fr, en, tag="span"):
    return f'<{tag} data-l="fr">{fr}</{tag}><{tag} data-l="en" hidden>{en}</{tag}>'


def product_header():
    nav = [("/#shop", "Boutique", "Shop"), (LAND["main"][0], "Faux ongles Maurice", "Press-on nails Mauritius"), (LAND["toes"][0], "Pieds", "Toenails")]
    links = "".join(f'<a href="{u}">{bi(f, e)}</a>' for u, f, e in nav)
    lang = '<span class="plang"><button type="button" data-lang="fr">FR</button><button type="button" data-lang="en">EN</button></span>'
    return f'<header class="phead"><a href="/" aria-label="Pink Tips"><img src="/logo/1-badge.svg" alt="Pink Tips" width="56" height="56"></a><nav aria-label="Menu">{links}{lang}</nav></header>\n'


def product_page(p, i):
    core = p["name"] + (f" ({p['variant']})" if p["variant"] else "")
    kind_fr = "pour les pieds " if p["feet"] else ""
    kind_en = "for toes " if p["feet"] else ""
    var = f" ({p['variant']})" if p["variant"] else ""
    desc_fr = f"Set de faux ongles press-on {kind_fr}« {p['name']} »{var}, fait main à l'île Maurice. Réutilisable, posé en 1 minute."
    desc_en = f"Handmade press-on nail set {kind_en}\"{p['name']}\"{var}, made in Mauritius. Reusable, on in 1 minute."
    meta = (desc_fr + f" Rs {p['price']}.")[:158]
    title = f"{core} | Faux ongles press-on Maurice"
    url = f"/p/{p['slug']}/"
    img_abs = f"{SITE}/img/products/{p['base']}.jpg" if p["base"] else p["photo"]
    land_fr = LAND["toes"][0] if p["feet"] else LAND["main"][0]
    ld = [{
        "@context": "https://schema.org", "@type": "Product", "name": core, "image": [img_abs], "description": desc_fr, "sku": p["slug"],
        "brand": {"@type": "Brand", "name": "Pink Tips"},
        "offers": {"@type": "Offer", "url": SITE + url, "priceCurrency": "MUR", "price": str(p["price"]),
                   "availability": "https://schema.org/OutOfStock" if p["out"] else "https://schema.org/InStock",
                   "itemCondition": "https://schema.org/NewCondition", "seller": {"@type": "Organization", "name": "Pink Tips"}},
    }, breadcrumb_ld("fr", [(land_fr, "Faux ongles pour les pieds" if p["feet"] else "Faux ongles press-on Maurice"), (None, core)], url)]
    others = [products[(i + k) % len(products)] for k in (1, 2, 3, 4)]
    msg_fr = f"Bonjour Pinktips ! Je voudrais commander : 1 × {p['name']}{var} – Rs {p['price']}"
    msg_en = f"Hello Pinktips! I would like to order: 1 × {p['name']}{var} – Rs {p['price']}"
    hid = " hidden" if p["out"] else ""
    order = (f'<a class="btn" data-order data-l="fr"{hid} href="https://wa.me/{WA}?text={urllib.parse.quote(msg_fr)}" rel="noopener">Commander sur WhatsApp</a>'
             f'<a class="btn" data-order data-l="en" hidden href="https://wa.me/{WA}?text={urllib.parse.quote(msg_en)}" rel="noopener">Order on WhatsApp</a>')
    avail = (f'<span class="avail{" out" if p["out"] else ""}" data-avail>'
             '<span data-l="fr"><span class="i">En stock</span><span class="o">Rupture de stock</span></span>'
             '<span data-l="en" hidden><span class="i">In stock</span><span class="o">Sold out</span></span></span>')
    facts = ""
    if p["variant"]:
        facts += f'<li>{bi("<b>Forme / type :</b> " + esc(p["variant"]), "<b>Shape / type:</b> " + esc(p["variant"]), "span")}</li>'
    facts += ("<li>" + bi(f"<b>Livraison :</b> La Poste partout à Maurice (Rs {DELIVERY}) ou retrait gratuit à Pamplemousses",
                          f"<b>Delivery:</b> La Poste all over Mauritius (Rs {DELIVERY}) or free pick-up in Pamplemousses") + "</li>"
              "<li>" + bi("<b>Paiement :</b> Juice, après confirmation sur WhatsApp", "<b>Payment:</b> Juice, after we confirm on WhatsApp") + "</li>"
              "<li>" + bi('<b>Retours :</b> uniquement pour les produits défectueux, sous 7 jours (<a href="/retours/">détails</a>)',
                          '<b>Returns:</b> defective products only, within 7 days (<a href="/retours/">details</a>)') + "</li>")
    crumb = ('<p class="crumbs"><a href="/">' + bi("Accueil", "Home") + f'</a> › <a href="{land_fr}">'
             + bi("Faux ongles pour les pieds" if p["feet"] else "Faux ongles press-on Maurice", "Press-on toenails" if p["feet"] else "Press-on nails Mauritius")
             + f"</a> › <span>{esc(core)}</span></p>")
    body = (head("fr", title, meta, url, (), ld, "product", img_abs) + product_header() + '<main class="wrap">\n' + crumb
            + '<div class="prod">\n<div><img ' + pic(p, "(min-width: 760px) 480px, 100vw", first=True) + f' alt="{esc(core)}"></div>\n<div>\n'
            + f"<h1>{esc(core)} · {bi('faux ongles press-on', 'press-on nails')}</h1>\n"
            + f'<p class="price-big" data-price>Rs {p["price"]}</p>\n<p>{avail}</p>\n'
            + "<p>" + bi(esc(desc_fr), esc(desc_en)) + "</p>\n"
            + f'<div class="btnrow">{order}<a class="ghost-btn" href="/#shop">{bi("Voir la collection", "See the collection")}</a></div>\n'
            + f'<ul class="facts">{facts}</ul>\n</div>\n</div>\n'
            + "<h2>" + bi("Vous aimerez aussi", "You may also like") + "</h2>\n" + grid(others, "fr")
            + f'<p>{bi("Voir aussi", "See also")} : <a href="{LAND["main"][0]}">faux ongles press-on à l\'île Maurice</a> · <a href="{LAND["main"][1]}">press-on nails in Mauritius</a></p>\n</main>\n'
            + '<script src="/config.js" defer></script><script src="/product.js" defer></script>\n' + footer("fr"))
    write(url.strip("/") + "/index.html", body)
    return url


# ---------------- run ----------------
if os.path.isdir("p"):
    shutil.rmtree("p")
urls = {}
for key in ("main", "toes"):
    for lang in ("fr", "en"):
        u = landing(lang, key)
        if u:
            urls[(key, lang)] = u
purls = [product_page(p, i) for i, p in enumerate(products)]

sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      f"  <url><loc>{SITE}/</loc><changefreq>weekly</changefreq></url>", f"  <url><loc>{SITE}/retours/</loc></url>"]
for key in ("main", "toes"):
    if (key, "fr") in urls and (key, "en") in urls:
        fr_u, en_u = SITE + urls[(key, "fr")], SITE + urls[(key, "en")]
        for u in (fr_u, en_u):
            sm.append(f'  <url><loc>{u}</loc><xhtml:link rel="alternate" hreflang="fr" href="{fr_u}"/><xhtml:link rel="alternate" hreflang="en" href="{en_u}"/><xhtml:link rel="alternate" hreflang="x-default" href="{fr_u}"/></url>')
for u in purls:
    sm.append(f"  <url><loc>{SITE}{u}</loc></url>")
sm.append("</urlset>")
write("sitemap.xml", "\n".join(sm) + "\n")
print(len(products), "products,", len(urls), "landing pages,", len(purls), "product pages; titles:")
for k, u in urls.items():
    t = re.search(r"<title>(.*?)</title>", open(u.strip("/") + "/index.html", encoding="utf-8").read()).group(1)
    print(" ", len(t), t)
