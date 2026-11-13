// Everything you may need to change lives in this one file.
const CONFIG = {
  // Her WhatsApp number: country code 230 + number, digits only (no +, no spaces).
  whatsapp: "23058147634",

  // Where the products come from: the Google Sheet "Pinktips - Stock", published as CSV.
  sheet: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLQnA_5duc7-_dGZZolGJQxSU5iLbPzANWM4U1TrIar4Y_dYpGrtFqPxquzzRHjkPJc-4onin2RlgO/pub?output=csv",

  // Delivery price in rupees. null = "confirmed on WhatsApp".
  delivery: 100,

  instagram: "https://www.instagram.com/pinktips5/",
  tiktok: "https://www.tiktok.com/@pink_tips_mrw",

  // Google script behind the hidden page /admin/ (Deploy > Web app URL). No password here.
  adminApi: "https://script.google.com/macros/s/AKfycby4qYV-z_9E_zuGhOYw7QwCiBktzGXmmO_jtH1eJCgP6GGbIt9Kbel6x9-CegPtKplU/exec",

  // Tracking pixel IDs. Empty = pixel switched off.
  // Google Analytics 4 Measurement ID (analytics.google.com > Admin > Data streams). Empty = off.
  analytics: "G-3HSSHNN15C",

  metaPixel: "",
  tiktokPixel: "",
};
