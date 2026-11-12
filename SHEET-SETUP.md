# Setting up the stock sheet (about 10 minutes, once)

Sheet: https://docs.google.com/spreadsheets/d/11_20pqwnLG5mVZGKGYvPq8C6FIa9RMfnBkROtVedLKY/edit

It already has the 8 test products. Do these steps on a computer, in order.

## 1. Turn the Rupture column into tick boxes
1. Click cell **F2**, scroll down, then hold **Shift** and click cell **F200**.
   (This selects every Rupture cell but leaves the title "Rupture" alone.)
2. Menu **Insert > Checkbox**.
   TRUE becomes a ticked box, FALSE an empty box.

## 2. Lock the columns she should not touch
1. Select columns **A to D** (click A, then Shift + click D).
2. Menu **Data > Protect sheets and ranges**.
3. Click **Set permissions**, choose **Only you**, then **Done**.

Now only you can change name, variant, price and photo. She can still change Stock (E) and Rupture (F).

## 3. Make it readable by the website
1. Menu **File > Share > Publish to web**.
2. The first box says **Entire document**: change it to the tab name shown at the bottom of the sheet (for example **Pinktips - Stock** or **Sheet1**).
3. In the second box choose **Comma-separated values (.csv)**.
4. Click **Publish**, then **OK**.
5. Copy the link it shows (it starts with `https://docs.google.com/spreadsheets/d/e/` and ends with `output=csv`).
6. Send me that link, or paste it yourself in `config.js` on the `sheet:` line, between the quotes.

This only makes the product list public (names, prices, stock), which the website shows anyway.
After a change in the sheet, the site can take up to 5 minutes to show it. That is Google's delay, not a bug.

## 4. Give your sister access
1. Click the green **Share** button at the top right.
2. Type her shop email, choose **Editor**, click **Send**.

## Adding a product later
Add a new row at the bottom: Name, Variant, Price (number only, e.g. 650), photo link, stock, tick box.
One row per colour or shape. Never leave an empty row between products.
