// Analytics for the generated landing and product pages (the shop page has its own in app.js).
// Same rule as the shop: Google Analytics starts after the first touch or 4 s after load, so it never slows the page down.
(function () {
  if (typeof CONFIG === "undefined" || !CONFIG.analytics) return; // CONFIG is a const in config.js, not a window property
  let on = false;
  function start() {
    if (on) return; on = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", CONFIG.analytics);
    const s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.analytics;
    document.head.appendChild(s);
  }
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach((e) => addEventListener(e, start, { once: true, passive: true }));
  addEventListener("load", () => setTimeout(start, 4000));
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    start();
    gtag("event", "whatsapp_click", { link_text: (a.textContent || "").trim().slice(0, 40), page: location.pathname });
  });
})();
