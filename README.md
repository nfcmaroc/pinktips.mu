# Pinktips.mu

Shop site for Pink Tips, press-on nails in Mauritius. Live at **https://pinktips.mu**
(GitHub Pages, deploys on every push to `main`; `www` and the old github.io address redirect there).

| File | What it is |
|---|---|
| `index.html`, `style.css`, `app.js` | The shop page: products, cart, WhatsApp order, FR / EN |
| `build.py` | Run `python build.py` after editing `style.css`: it copies the CSS into `index.html` (faster first paint) |
| `fonts/`, `img/` | Self-hosted fonts, hero image, banner and product photos (each product photo has `-400.webp` and `-800.webp` copies) |
| `config.js` | **The file you edit**: WhatsApp number, sheet link, delivery price, social links, admin script link, pixel IDs |
| `admin/` | Hidden stock page (`/admin/`), password-protected. `Code.gs` is a copy of the Google script behind it |
| `logo/` | Badge, wordmark, monogram, share picture; `logo/src/` rebuilds them |
| `SHEET-SETUP.md` | How the Google Sheet was set up |

## Products and stock
Products live in the Google Sheet "Pinktips - Stock" (columns `Nom, Variante, Prix, Photo, Stock, Rupture`),
published as CSV. Edit them in the sheet or, easier, on **https://pinktips.mu/admin/**.
Stock 0 or Rupture ticked shows "Rupture de stock". The public site updates within about 5 minutes.

## Admin script
Standalone Apps Script project "Pinktips admin" in the owner's Google account. The password is in
Project Settings > Script properties > `ADMIN_PASSWORD` (never in this repo). Changing `admin/Code.gs`
needs a new deployment version in the Apps Script editor, not just a push.

## See it on your computer
```
python -m http.server 5055
```
then open http://localhost:5055

## Photo and video credits
Product photos are the Temu listing photos of the sets she sells, loaded from Temu (replace with her
own when possible). The banner photo is from Unsplash (Unsplash License) and the hero video from Pexels
(Pexels License, video 35050092). Both allow free commercial use without credit.
