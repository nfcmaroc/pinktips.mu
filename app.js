const T = {
  fr: {
    bar: "Livraison partout à Maurice par La Poste · Paiement Juice",
    kicker: "Press-on nails · Île Maurice", title: "Des ongles de salon, posés en 1 minute",
    shopNow: "Voir la collection",
    step1: "Choisissez vos ongles", step2: "Commandez sur WhatsApp", step3: "Payez par Juice, on poste",
    shop: "La collection", add: "Ajouter", soldOut: "Rupture de stock",
    whyTitle: "Réutilisables, sans dégâts", whyText: "Nos press-on se posent en 1 minute, tiennent plusieurs jours et se retirent sans abîmer vos ongles.",
    cart: "Votre panier", empty: "Votre panier est vide.", total: "Total",
    name: "Nom et prénom", address: "Adresse de livraison", phone: "Téléphone",
    order: "Commander sur WhatsApp", payNote: "Nous confirmons sur WhatsApp, puis vous payez par Juice.",
    delivery: "Livraison par La Poste partout à Maurice. Paiement par Juice après confirmation sur WhatsApp.",
    deliveryShort: "+ livraison La Poste", deliveryTbc: "à confirmer",
    msgHello: "Bonjour Pinktips ! Je voudrais commander :", msgDelivery: "Livraison", msgTotal: "Total",
    msgName: "Nom", msgAddress: "Adresse", msgPhone: "Téléphone",
    loadError: "Les produits n'ont pas pu être chargés. Rechargez la page dans un instant.",
  },
  en: {
    bar: "Delivery all over Mauritius by La Poste · Pay with Juice",
    kicker: "Press-on nails · Mauritius", title: "Salon nails, on in 1 minute",
    shopNow: "Shop the collection",
    step1: "Pick your nails", step2: "Order on WhatsApp", step3: "Pay with Juice, we post",
    shop: "The collection", add: "Add", soldOut: "Sold out",
    whyTitle: "Reusable, no damage", whyText: "Our press-ons go on in 1 minute, last for days and come off without hurting your natural nails.",
    cart: "Your cart", empty: "Your cart is empty.", total: "Total",
    name: "Full name", address: "Delivery address", phone: "Phone",
    order: "Order on WhatsApp", payNote: "We confirm on WhatsApp, then you pay with Juice.",
    delivery: "Delivery by La Poste all over Mauritius. Pay with Juice after we confirm on WhatsApp.",
    deliveryShort: "+ La Poste delivery", deliveryTbc: "to be confirmed",
    msgHello: "Hello Pinktips! I would like to order:", msgDelivery: "Delivery", msgTotal: "Total",
    msgName: "Name", msgAddress: "Address", msgPhone: "Phone",
    loadError: "The products could not be loaded. Please reload the page in a moment.",
  },
  cr: {
    bar: "Nou livre partou Moris par La Poste · Pey par Juice",
    kicker: "Press-on nails · Moris", title: "Zong kouma dan salon, an 1 minit",
    shopNow: "Get koleksion la",
    step1: "Swazir ou zong", step2: "Komann lor WhatsApp", step3: "Pey par Juice, nou poste",
    shop: "Koleksion la", add: "Azoute", soldOut: "Rupture de stock",
    whyTitle: "Reitilizab, pa abim zong", whyText: "Nou press-on met an 1 minit, tini plizier zour ek tir san abim ou vre zong.",
    cart: "Ou panie", empty: "Ou panie vid.", total: "Total",
    name: "Nom ek prenom", address: "Adres pou livre", phone: "Telefonn",
    order: "Komann lor WhatsApp", payNote: "Nou konfirm lor WhatsApp, apre ou pey par Juice.",
    delivery: "Nou livre par La Poste partou Moris. Pey par Juice apre konfirmasion lor WhatsApp.",
    deliveryShort: "+ livrezon La Poste", deliveryTbc: "pou konfirme",
    msgHello: "Bonzour Pinktips! Mo anvi komann:", msgDelivery: "Livrezon", msgTotal: "Total",
    msgName: "Nom", msgAddress: "Adres", msgPhone: "Telefonn",
    loadError: "Pa finn kapav sarz bann prodwi. Reesey dan enn ti moman.",
  },
};

let lang = localStorage.lang || "fr";
let products = [];
let cart = JSON.parse(localStorage.cart || "{}"); // { productId: qty }
const $ = (s) => document.querySelector(s);
const rs = (n) => "Rs " + n.toLocaleString("fr-FR");
const t = (k) => T[lang][k];

// --- tracking (only runs when an ID is set in config.js) ---
function track(event, data = {}) {
  if (window.fbq) fbq(["PageView", "ViewContent", "AddToCart", "InitiateCheckout"].includes(event) ? "track" : "trackCustom", event, data);
  if (window.ttq) ttq.track(event, data);
}
function loadPixels() {
  if (CONFIG.metaPixel) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq("init", CONFIG.metaPixel); fbq("track", "PageView");
  }
  if (CONFIG.tiktokPixel) {
    !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=n;var o=d.createElement("script");o.async=!0;o.src=n+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)}}(window,document,"ttq");
    ttq.load(CONFIG.tiktokPixel); ttq.page();
  }
}

// --- sheet reading: tiny CSV parser that handles "quoted, cells" ---
function parseCSV(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

async function loadProducts() {
  const url = CONFIG.sheet + (CONFIG.sheet.includes("?") ? "&" : "?") + "t=" + Date.now(); // never show an old stock
  const res = await fetch(url);
  if (!res.ok) throw new Error("sheet " + res.status);
  const rows = parseCSV(await res.text()).slice(1);
  products = rows.map(([name, variant, price, photo, stock, rupture], i) => ({
    id: (name + "|" + variant).trim(),
    name: name.trim(), variant: (variant || "").trim(),
    price: parseInt(String(price).replace(/\D/g, "")) || 0,
    photo: (photo || "").trim(),
    stock: parseInt(stock) || 0,
    soldOut: !(parseInt(stock) > 0) || /^(true|vrai|oui|x|1)$/i.test((rupture || "").trim()),
  })).filter((p) => p.name);
  // drop anything in the cart that vanished or sold out since last visit
  for (const id in cart) {
    const p = products.find((x) => x.id === id && !x.soldOut);
    if (!p) delete cart[id]; else cart[id] = Math.min(cart[id], p.stock);
  }
  save();
}

function img(url, w) {
  return url.includes("images.unsplash.com") ? `${url}${url.includes("?") ? "&" : "?"}auto=format&fit=crop&w=${w}&h=${Math.round(w * 1.25)}&q=70` : url;
}
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function renderGrid() {
  $("#grid").innerHTML = products.map((p, i) => `
    <article class="card${p.soldOut ? " out" : ""}">
      <div class="pic"><img src="${esc(img(p.photo, 600))}" alt="${esc(p.name)}" loading="lazy">
        ${p.soldOut ? `<span class="ribbon">${t("soldOut")}</span>` : ""}</div>
      <h3>${esc(p.name)}</h3>
      ${p.variant ? `<p class="variant">${esc(p.variant)}</p>` : ""}
      <p class="price">${rs(p.price)}</p>
      <button class="btn small" data-add="${i}" ${p.soldOut ? "disabled" : ""}>${p.soldOut ? t("soldOut") : t("add")}</button>
    </article>`).join("");
}

function renderCart() {
  const items = Object.entries(cart).map(([id, q]) => ({ p: products.find((x) => x.id === id), q })).filter((x) => x.p);
  const sub = items.reduce((s, x) => s + x.p.price * x.q, 0);
  $("#count").textContent = items.reduce((s, x) => s + x.q, 0);
  $("#lines").innerHTML = items.length ? items.map(({ p, q }) => `
    <li><img src="${esc(img(p.photo, 120))}" alt="">
      <div><b>${esc(p.name)}</b>${p.variant ? `<small>${esc(p.variant)}</small>` : ""}<span>${rs(p.price)}</span></div>
      <div class="qty"><button data-dec="${esc(p.id)}">−</button><span>${q}</span><button data-inc="${esc(p.id)}" ${q >= p.stock ? "disabled" : ""}>+</button></div></li>`).join("")
    : `<li class="empty">${t("empty")}</li>`;
  $("#total").textContent = rs(sub + (items.length ? CONFIG.delivery || 0 : 0));
  $("#order").disabled = !items.length;
  return { items, sub };
}

function applyLang() {
  document.documentElement.lang = lang === "cr" ? "mfe" : lang;
  document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = t(el.dataset.t)));
  document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  const d = $("[data-t=deliveryShort]");
  d.textContent += " : " + (CONFIG.delivery == null ? t("deliveryTbc") : rs(CONFIG.delivery));
  renderGrid(); renderCart();
}

function save() { localStorage.cart = JSON.stringify(cart); }
function setOpen(open) { $("#cart").hidden = $("#shade").hidden = !open; document.body.classList.toggle("lock", open); }

function whatsappMessage(form) {
  const { items, sub } = renderCart();
  const lines = items.map(({ p, q }) => `• ${q} × ${p.name}${p.variant ? " (" + p.variant + ")" : ""} – ${rs(p.price)} = ${rs(p.price * q)}`);
  const deliv = CONFIG.delivery == null ? t("deliveryTbc") : rs(CONFIG.delivery);
  return [t("msgHello"), "", ...lines, "", `${t("msgDelivery")} : ${deliv}`, `*${t("msgTotal")} : ${rs(sub + (CONFIG.delivery || 0))}*`, "",
    `${t("msgName")} : ${form.name.value.trim()}`, `${t("msgAddress")} : ${form.address.value.trim()}`, `${t("msgPhone")} : ${form.phone.value.trim()}`].join("\n");
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.lang) { lang = localStorage.lang = b.dataset.lang; applyLang(); }
  if (b.dataset.add) { const p = products[b.dataset.add]; cart[p.id] = Math.min((cart[p.id] || 0) + 1, p.stock); save(); renderCart(); setOpen(true); track("AddToCart", { content_name: p.name, value: p.price, currency: "MUR" }); }
  if (b.dataset.inc) { const p = products.find((x) => x.id === b.dataset.inc); cart[p.id] = Math.min(cart[p.id] + 1, p.stock); save(); renderCart(); }
  if (b.dataset.dec) { if (--cart[b.dataset.dec] <= 0) delete cart[b.dataset.dec]; save(); renderCart(); }
  if (b.id === "openCart") { setOpen(true); track("InitiateCheckout"); }
  if (b.id === "closeCart") setOpen(false);
});
$("#shade").onclick = () => setOpen(false);
document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));

$("#checkout").addEventListener("submit", (e) => {
  e.preventDefault();
  const { sub } = renderCart();
  track("whatsapp_click", { value: sub, currency: "MUR" });
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(whatsappMessage(e.target))}`, "_blank");
});

$("#lnkIg").href = CONFIG.instagram; $("#lnkTt").href = CONFIG.tiktok; $("#lnkWa").href = "https://wa.me/" + CONFIG.whatsapp;
loadPixels();
applyLang();
loadProducts().then(applyLang).catch(() => ($("#grid").innerHTML = `<p class="load-error">${t("loadError")}</p>`));
