# Pinktips.mu

The shop website. Five files do everything:

| File | What it is |
|---|---|
| `index.html` | The page itself |
| `style.css` | Colours and layout |
| `app.js` | Cart, language switch, WhatsApp message |
| `config.js` | **The only file you edit**: WhatsApp number, Google Sheet link, delivery price, social links, pixel IDs |

## See it on your computer

```
python -m http.server 5055
```

then open http://localhost:5055

## Products

Columns, same order in the Google Sheet: `Nom, Variante, Prix, Photo, Stock, Rupture`.
One row per colour or shape. Stock 0 or Rupture ticked shows "Rupture de stock" and greys the button.

## Photo and video credits

Product photos are the Temu listing photos of the sets she sells (replace with her own when possible). The banner photo is from Unsplash (Unsplash License) and the hero video from Pexels
(Pexels License, video 35050092). Both allow free commercial use without credit.
They are loaded straight from their sites; replace them with her own photos when ready.
