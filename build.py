# Inlines style.css (minified) into index.html so the page paints without waiting for a CSS request.
# Run after editing style.css:  python build.py
import re
css = open("style.css", encoding="utf-8").read()
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
css = re.sub(r"\s+", " ", css)
css = re.sub(r"\s*([{};,>])\s*", r"\1", css)       # keep ": " inside values safe by only trimming around structure
css = css.replace(";}", "}").strip()
html = open("index.html", encoding="utf-8").read()
new = "<!--css--><style>" + css + "</style><!--/css-->"
html, n = re.subn(r"<!--css-->.*?<!--/css-->", lambda m: new, html, flags=re.S)
assert n == 1, "markers not found"
open("index.html", "w", encoding="utf-8").write(html)
print("inlined", len(css), "bytes of CSS")
