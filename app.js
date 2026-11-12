const T = {
  fr: {
    bar: "Livraison La Poste partout à Maurice · Retrait à Pamplemousses · Paiement Juice",
    kicker: "Press-on nails · Île Maurice", title: "Des ongles de salon, posés en 1 minute",
    shopNow: "Voir la collection",
    step1: "Choisissez vos ongles", step2: "Commandez sur WhatsApp", step3: "Payez par Juice, on poste",
    navShop: "Collection", navHow: "Comment commander", navAbout: "Nos ongles", navContact: "Contact",
    shop: "La collection", shopKicker: "Faits main, avec amour",
    ticker: ["Faits main", "Réutilisables", "Posés en 1 minute", "Livraison partout à Maurice", "Retrait à Pamplemousses", "Paiement Juice"], add: "Ajouter", soldOut: "Rupture de stock",
    whyTitle: "Réutilisables, sans dégâts", whyText: "Nos press-on se posent en 1 minute, tiennent plusieurs jours et se retirent sans abîmer vos ongles.",
    cart: "Votre panier", empty: "Votre panier est vide.", total: "Total",
    name: "Nom et prénom", address: "Adresse de livraison", phone: "Téléphone",
    order: "Commander sur WhatsApp", payNote: "Nous confirmons sur WhatsApp, puis vous payez par Juice.",
    delivery: "Livraison par La Poste partout à Maurice, ou retrait gratuit à Pamplemousses. Paiement par Juice après confirmation sur WhatsApp.",
    deliveryTbc: "à confirmer", shipTitle: "Livraison", shipPost: "Envoi La Poste", shipPickup: "Retrait à Pamplemousses", free: "Gratuit", msgPickup: "Retrait à Pamplemousses (gratuit)",
    msgHello: "Bonjour Pinktips ! Je voudrais commander :", msgDelivery: "Livraison", msgTotal: "Total",
    msgName: "Nom", msgAddress: "Adresse", msgPhone: "Téléphone",
    loadError: "Les produits n'ont pas pu être chargés. Rechargez la page dans un instant.",
    addedTitle: "Ajouté au panier ✓", keepShopping: "Continuer mes achats", goCheckout: "Commander",
  },
  en: {
    bar: "La Poste delivery all over Mauritius · Pick-up in Pamplemousses · Pay with Juice",
    kicker: "Press-on nails · Mauritius", title: "Salon nails, on in 1 minute",
    shopNow: "Shop the collection",
    step1: "Pick your nails", step2: "Order on WhatsApp", step3: "Pay with Juice, we post",
    navShop: "Shop", navHow: "How to order", navAbout: "Our nails", navContact: "Contact",
    shop: "The collection", shopKicker: "Handmade with love",
    ticker: ["Handmade", "Reusable", "On in 1 minute", "Delivery all over Mauritius", "Pick-up in Pamplemousses", "Pay with Juice"], add: "Add", soldOut: "Sold out",
    whyTitle: "Reusable, no damage", whyText: "Our press-ons go on in 1 minute, last for days and come off without hurting your natural nails.",
    cart: "Your cart", empty: "Your cart is empty.", total: "Total",
    name: "Full name", address: "Delivery address", phone: "Phone",
    order: "Order on WhatsApp", payNote: "We confirm on WhatsApp, then you pay with Juice.",
    delivery: "Delivery by La Poste all over Mauritius, or free pick-up in Pamplemousses. Pay with Juice after we confirm on WhatsApp.",
    deliveryTbc: "to be confirmed", shipTitle: "Delivery", shipPost: "La Poste delivery", shipPickup: "Pick-up in Pamplemousses", free: "Free", msgPickup: "Pick-up in Pamplemousses (free)",
    msgHello: "Hello Pinktips! I would like to order:", msgDelivery: "Delivery", msgTotal: "Total",
    msgName: "Name", msgAddress: "Address", msgPhone: "Phone",
    loadError: "The products could not be loaded. Please reload the page in a moment.",
    addedTitle: "Added to cart ✓", keepShopping: "Keep shopping", goCheckout: "Checkout",
  },
  cr: {
    bar: "Nou livre partou Moris par La Poste · Pran li Pamplemousses · Pey par Juice",
    kicker: "Press-on nails · Moris", title: "Zong kouma dan salon, an 1 minit",
    shopNow: "Get koleksion la",
    step1: "Swazir ou zong", step2: "Komann lor WhatsApp", step3: "Pey par Juice, nou poste",
    navShop: "Koleksion", navHow: "Kouma komann", navAbout: "Nou zong", navContact: "Kontak",
    shop: "Koleksion la", shopKicker: "Fer lamem, ar lamour",
    ticker: ["Fer lamem", "Reitilizab", "Met an 1 minit", "Livrezon partou Moris", "Pran li Pamplemousses", "Pey par Juice"], add: "Azoute", soldOut: "Rupture de stock",
    whyTitle: "Reitilizab, pa abim zong", whyText: "Nou press-on met an 1 minit, tini plizier zour ek tir san abim ou vre zong.",
    cart: "Ou panie", empty: "Ou panie vid.", total: "Total",
    name: "Nom ek prenom", address: "Adres pou livre", phone: "Telefonn",
    order: "Komann lor WhatsApp", payNote: "Nou konfirm lor WhatsApp, apre ou pey par Juice.",
    delivery: "Nou livre par La Poste partou Moris, ouswa pran li gratis Pamplemousses. Pey par Juice apre konfirmasion lor WhatsApp.",
    deliveryTbc: "pou konfirme", shipTitle: "Livrezon", shipPost: "Avoy par La Poste", shipPickup: "Pran li Pamplemousses", free: "Gratis", msgPickup: "Pran li Pamplemousses (gratis)",
    msgHello: "Bonzour Pinktips! Mo anvi komann:", msgDelivery: "Livrezon", msgTotal: "Total",
    msgName: "Nom", msgAddress: "Adres", msgPhone: "Telefonn",
    loadError: "Pa finn kapav sarz bann prodwi. Reesey dan enn ti moman.",
    addedTitle: "Azoute dan panie ✓", keepShopping: "Kontinie aste", goCheckout: "Komande",
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
  $("#total").textContent = rs(sub + (items.length ? fee() : 0));
  $("#order").disabled = !items.length;
  return { items, sub };
}

function applyLang() {
  document.documentElement.lang = lang === "cr" ? "mfe" : lang;
  document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = t(el.dataset.t)));
  document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  $("#shipPostPrice").textContent = CONFIG.delivery == null ? t("deliveryTbc") : rs(CONFIG.delivery);
  // ticker: the list twice, so the scroll loops without a gap
  $("#ticker").innerHTML = [...t("ticker"), ...t("ticker")].map((w) => `<span>${w}</span>`).join("");
  renderGrid(); renderCart(); reveal();
}

// soft fade-in as sections scroll into view
const seen = "IntersectionObserver" in window && new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), seen.unobserve(e.target))), { rootMargin: "0px 0px -8% 0px" });
function reveal() {
  if (!seen) return;
  document.querySelectorAll(".card:not(.reveal), .banner:not(.reveal), .steps > div:not(.reveal)").forEach((el) => { el.classList.add("reveal"); seen.observe(el); });
}

// "added to cart" popup: keep shopping or go to checkout
let addedTimer;
function showAdded(p) {
  $("#addedImg").src = img(p.photo, 120);
  $("#addedName").textContent = p.name + (p.variant ? " · " + p.variant : "");
  $("#added").hidden = false;
  requestAnimationFrame(() => $("#added").classList.add("show"));
  $("#count").parentElement.classList.remove("bump"); void $("#count").offsetWidth; $("#count").parentElement.classList.add("bump");
  clearTimeout(addedTimer); addedTimer = setTimeout(hideAdded, 6000);
}
function hideAdded() {
  clearTimeout(addedTimer);
  $("#added").classList.remove("show");
  setTimeout(() => ($("#added").hidden = true), 300);
}

// delivery choice: La Poste (paid) or free pick-up; pick-up needs no address
const pickup = () => $("input[name=ship]:checked").value === "pickup";
const fee = () => (pickup() ? 0 : CONFIG.delivery || 0);
document.addEventListener("change", (e) => {
  if (e.target.name !== "ship") return;
  $("#addressField").hidden = pickup();
  $("#checkout").address.required = !pickup();
  renderCart();
});

function save() { localStorage.cart = JSON.stringify(cart); }
function setOpen(open) { $("#cart").hidden = $("#shade").hidden = !open; document.body.classList.toggle("lock", open); }

function whatsappMessage(form) {
  const { items, sub } = renderCart();
  const lines = items.map(({ p, q }) => `• ${q} × ${p.name}${p.variant ? " (" + p.variant + ")" : ""} – ${rs(p.price)} = ${rs(p.price * q)}`);
  const deliv = pickup() ? t("msgPickup") : `${t("shipPost")} ${CONFIG.delivery == null ? t("deliveryTbc") : rs(CONFIG.delivery)}`;
  return [t("msgHello"), "", ...lines, "", `${t("msgDelivery")} : ${deliv}`, `*${t("msgTotal")} : ${rs(sub + fee())}*`, "",
    `${t("msgName")} : ${form.name.value.trim()}`, ...(pickup() ? [] : [`${t("msgAddress")} : ${form.address.value.trim()}`]), `${t("msgPhone")} : ${form.phone.value.trim()}`].join("\n");
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.lang) { lang = localStorage.lang = b.dataset.lang; applyLang(); }
  if (b.dataset.add) { const p = products[b.dataset.add]; cart[p.id] = Math.min((cart[p.id] || 0) + 1, p.stock); save(); renderCart(); showAdded(p); track("AddToCart", { content_name: p.name, value: p.price, currency: "MUR" }); }
  if (b.dataset.inc) { const p = products.find((x) => x.id === b.dataset.inc); cart[p.id] = Math.min(cart[p.id] + 1, p.stock); save(); renderCart(); }
  if (b.dataset.dec) { if (--cart[b.dataset.dec] <= 0) delete cart[b.dataset.dec]; save(); renderCart(); }
  if (b.id === "openCart") { setOpen(true); track("InitiateCheckout"); }
  if (b.id === "closeCart" || b.id === "keepShopping2") setOpen(false);
  if (b.id === "keepShopping") hideAdded();
  if (b.id === "goCheckout") { hideAdded(); setOpen(true); track("InitiateCheckout"); }
});
$("#shade").onclick = () => setOpen(false);
document.addEventListener("keydown", (e) => e.key === "Escape" && (setOpen(false), hideAdded()));

$("#checkout").addEventListener("submit", (e) => {
  e.preventDefault();
  const { sub } = renderCart();
  track("whatsapp_click", { value: sub, currency: "MUR" });
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(whatsappMessage(e.target))}`, "_blank");
});

$("#lnkIg").href = $("#hdrIg").href = CONFIG.instagram; $("#lnkTt").href = $("#hdrTt").href = CONFIG.tiktok; $("#lnkWa").href = "https://wa.me/" + CONFIG.whatsapp;
// computers get a sharper hero video (phones keep the light 0.8 MB one)
if (matchMedia("(min-width: 900px)").matches) {
  const v = $(".hero video");
  v.poster = v.poster.replace("w=900", "w=1600");
  v.querySelector("source").src = "https://videos.pexels.com/video-files/35050092/14847507_1080_1920_50fps.mp4";
  v.load();
}
loadPixels();
applyLang();
loadProducts().then(applyLang).catch(() => ($("#grid").innerHTML = `<p class="load-error">${t("loadError")}</p>`));

// smaller header once the visitor scrolls down
addEventListener("scroll", () => $(".top").classList.toggle("small", scrollY > 60), { passive: true });
