# Builds 1-badge.svg from hand.py. Run: python build_badge.py  (then the inkscape export)
import subprocess, sys, os
subprocess.run([sys.executable, "hand.py"], check=True)
hand = open("hand.svg").read()
open("1-badge.svg", "w").write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
<circle cx="500" cy="500" r="500" fill="#1d1718"/>
<circle cx="500" cy="500" r="470" fill="none" stroke="#e8b4c0" stroke-width="4"/>
<g transform="translate(345,52) scale(0.72)">{hand}</g>
<text x="500" y="625" text-anchor="middle" font-family="Kunstler Script" font-size="250" fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round">Pink Tips</text>
<text x="500" y="740" text-anchor="middle" font-family="Bodoni MT" font-weight="bold" font-size="46" letter-spacing="10" fill="#e8b4c0">PRESS-ON NAILS</text>
<text x="500" y="810" text-anchor="middle" font-family="Bodoni MT" font-weight="bold" font-size="32" letter-spacing="8" fill="#f7efe9">MAURITIUS</text>
</svg>''')
