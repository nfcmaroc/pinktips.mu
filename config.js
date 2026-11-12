// Everything you may need to change lives in this one file.
const CONFIG = {
  // Your sister's WhatsApp Business number: country code 230 + number, digits only.
  whatsapp: "23050000000",

  // Where the products come from. Leave "products.csv" for test products.
  // Later: paste the Google Sheet "Publish to web > CSV" link here.
  sheet: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLQnA_5duc7-_dGZZolGJQxSU5iLbPzANWM4U1TrIar4Y_dYpGrtFqPxquzzRHjkPJc-4onin2RlgO/pub?output=csv",

  // Delivery price in rupees. null = "confirmed on WhatsApp".
  delivery: null,

  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",

  // Tracking pixel IDs. Empty = pixel switched off.
  metaPixel: "",
  tiktokPixel: "",
};
