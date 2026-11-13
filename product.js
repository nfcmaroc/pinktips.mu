// Product pages are built from the sheet at build time (build_pages.py). This script
//  1) shows the French or English texts (the page holds both; the choice is shared with the shop), and
//  2) keeps the price and availability current if the sheet changed before the next rebuild.
(function () {
  const slug = (s) => s.toLowerCase().replace(/œ/g, "oe").replace(/&/g, "et").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const here = location.pathname.split("/").filter(Boolean).pop();

  function show(l) {
    try { localStorage.lang = l; } catch (e) { /* private mode */ }
    document.documentElement.lang = l;
    document.querySelectorAll("[data-l]").forEach((e) => { e.hidden = e.dataset.l !== l || (e.hasAttribute("data-order") && e.dataset.soldout === "1"); });
    document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("on", b.dataset.lang === l));
  }
  let lang = "fr";
  try { lang = localStorage.lang === "en" ? "en" : "fr"; } catch (e) { /* default French */ }
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => show(b.dataset.lang)));
  document.querySelectorAll("[data-order][hidden]").forEach((b) => { if (b.dataset.l === "fr") b.dataset.soldout = "1"; });
  show(lang);

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
    return rows;
  }

  addEventListener("load", () => setTimeout(async () => {
    try {
      const res = await fetch(CONFIG.sheet + "&t=" + Date.now());
      if (!res.ok) return;
      const r = parseCSV(await res.text()).slice(1).find((x) => x[0] && slug(x[0] + " " + x[1]) === here);
      if (!r) return;
      const price = parseInt(String(r[2]).replace(/\D/g, "")) || 0;
      const out = !(parseInt(r[4]) > 0) || /^(true|vrai|oui|x|1)$/i.test((r[5] || "").trim());
      const p = document.querySelector("[data-price]"); if (p) p.textContent = "Rs " + price;
      const a = document.querySelector("[data-avail]"); if (a) a.classList.toggle("out", out);
      document.querySelectorAll("[data-order]").forEach((b) => { b.dataset.soldout = out ? "1" : "0"; });
      show(document.documentElement.lang === "en" ? "en" : "fr");
    } catch (e) { /* the page already shows the build-time values */ }
  }, 800));
})();
