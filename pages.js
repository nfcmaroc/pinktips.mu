// Analytics for the generated landing and product pages (the shop page has its own in app.js).
// Same rule as the shop: trackers start after the first touch or 4 s after load, so they never slow the page down.
(function () {
  if (typeof CONFIG === "undefined" || (!CONFIG.analytics && !CONFIG.metaPixel)) return; // CONFIG is a const in config.js, not a window property
  let on = false;
  function start() {
    if (on) return; on = true;
    if (CONFIG.analytics) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag("js", new Date()); gtag("config", CONFIG.analytics);
      const s = document.createElement("script"); s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.analytics;
      document.head.appendChild(s);
    }
    if (CONFIG.metaPixel) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq("init", CONFIG.metaPixel); fbq("track", "PageView");
    }
  }
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach((e) => addEventListener(e, start, { once: true, passive: true }));
  addEventListener("load", () => setTimeout(start, 4000));
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    start();
    if (window.gtag) gtag("event", "whatsapp_click", { link_text: (a.textContent || "").trim().slice(0, 40), page: location.pathname });
    if (window.fbq) fbq("track", "Contact");
  });
})();
