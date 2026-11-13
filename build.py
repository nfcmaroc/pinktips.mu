# Run after editing style.css or the French texts in app.js:  python build.py
#  1) inlines style.css (minified) into index.html, so the page paints without waiting for a CSS request
#  2) writes the French texts (the T.fr block of app.js) into every data-t element of index.html,
#     so the page is readable without JavaScript (search engines, link previews, checkers)
import html as H
import json
import re

# ---- 1) CSS ----
css = open("style.css", encoding="utf-8").read()
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
css = re.sub(r"\s+", " ", css)
css = re.sub(r"\s*([{};,>])\s*", r"\1", css)
css = css.replace(";}", "}").strip()
page = open("index.html", encoding="utf-8").read()
new = "<!--css--><style>" + css + "</style><!--/css-->"
page, n = re.subn(r"<!--css-->.*?<!--/css-->", lambda m: new, page, flags=re.S)
assert n == 1, "css markers not found"

# ---- 2) French texts ----
js = open("app.js", encoding="utf-8").read()
fr = js[js.index("  fr: {"):js.index("  en: {")]
T = {k: json.loads(v) for k, v in re.findall(r'(\w+): ("(?:[^"\\]|\\.)*")', fr)}

def fill(m):
    key = m.group(3)
    if key not in T:
        return m.group(0)
    return m.group(1) + H.escape(T[key], quote=False) + m.group(5)

page, filled = re.subn(r'(<(\w+)\b[^>]*\bdata-t="(\w+)"[^>]*>)([^<]*)(</\2>)', fill, page)
open("index.html", "w", encoding="utf-8").write(page)
print("inlined", len(css), "bytes of CSS; filled", filled, "text elements")
