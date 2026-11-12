# Builds badge variants. python build_badge.py -> 1-badge-fan.svg, 1-badge-sparkle.svg
NAIL = "M0,{t} C{a},{b} {c},{d} {c},{e} L{c},{f} Q{c},{g} 0,{g} Q{m},{g} {m},{f} L{m},{e} C{m},{d} {n},{b} 0,{t} Z"
def nail(w, h, fill, hi=True):
    # almond press-on: pointed-round top, straight sides, rounded cuticle
    r = w / 2
    d = NAIL.format(t=-h, a=r*0.95, b=-h*0.97, c=r, d=-h*0.62, e=-h*0.45, f=-r*0.6, g=0, m=-r, n=-r*0.95)
    out = f'<path d="{d}" fill="{fill}"/>'
    if hi:
        out += f'<path d="M{-r*0.35},{-h*0.72} Q{-r*0.5},{-h*0.45} {-r*0.4},{-h*0.22}" stroke="#fff" stroke-width="{w*0.09}" fill="none" stroke-linecap="round" opacity=".75"/>'
    return out
def sparkle(x, y, s, fill="#f7efe9"):
    return f'<path transform="translate({x},{y}) scale({s})" d="M0,-10 Q1,-1 10,0 Q1,1 0,10 Q-1,1 -10,0 Q-1,-1 0,-10 Z" fill="{fill}"/>'
fan_cols = ["#f3d3d9", "#eaa9b9", "#d46a86", "#eaa9b9", "#f3d3d9"]
fan = "".join(f'<g transform="translate(500,400) rotate({a}) translate(0,-30)">{nail(64,150,c)}</g>' for a, c in zip([-40,-20,0,20,40], fan_cols))
fan += sparkle(640, 215, 2.2) + sparkle(360, 250, 1.4)
single = f'<g transform="translate(500,410) rotate(12)">{nail(120,270,"#d46a86")}</g>' + sparkle(600, 190, 3) + sparkle(395, 215, 1.8) + sparkle(615, 330, 1.3)
for name, icon in [("fan", fan), ("sparkle", single)]:
    open(f"1-badge-{name}.svg", "w").write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
<circle cx="500" cy="500" r="500" fill="#1d1718"/>
<circle cx="500" cy="500" r="470" fill="none" stroke="#e8b4c0" stroke-width="4"/>
{icon}
<text x="500" y="625" text-anchor="middle" font-family="Kunstler Script" font-size="250" fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round">Pink Tips</text>
<text x="500" y="740" text-anchor="middle" font-family="Bodoni MT" font-weight="bold" font-size="46" letter-spacing="10" fill="#e8b4c0">PRESS-ON NAILS</text>
<text x="500" y="810" text-anchor="middle" font-family="Bodoni MT" font-weight="bold" font-size="32" letter-spacing="8" fill="#f7efe9">MAURITIUS</text>
</svg>''')
