# Draws an original line-art hand with almond nails. Writes hand.svg (group only) and test.svg.
import sys
BG, LINE, NAIL = "#1d1718", "#ffffff", "#e58aa2"
SW = 10
def finger(bx, by, ang, L, w=50, tail=40, tail2=None):
    # capsule from base upward, plus almond nail on the tip
    r = w / 2
    body = f'<path d="M{-r},{tail} L{-r},{-L+r} A{r},{r} 0 0 1 {r},{-L+r} L{r},{tail if tail2 is None else tail2}" fill="{BG}" stroke="{LINE}" stroke-width="{SW}" stroke-linecap="round"/>'
    nw, nl = w * 0.66, w * 1.2
    top = -L - nl * 0.3
    nail = (f'<path d="M0,{top} C{nw*0.62},{top+nl*0.12} {nw/2},{top+nl*0.7} {nw/2*0.9},{top+nl} '
            f'Q0,{top+nl*1.1} {-nw/2*0.9},{top+nl} C{-nw/2},{top+nl*0.7} {-nw*0.62},{top+nl*0.12} 0,{top} Z" fill="{NAIL}"/>'
            f'<path d="M{-nw*0.18},{top+nl*0.3} Q{-nw*0.22},{top+nl*0.55} {-nw*0.12},{top+nl*0.75}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>')
    return f'<g transform="translate({bx},{by}) rotate({ang})">{body}{nail}</g>'
parts = []
# fingers close together so they overlap (back to front)
parts.append(finger(262, 300, 16, 140, 44))
parts.append(finger(230, 282, 7, 185, 48))
parts.append(finger(195, 276, -1, 205, 50))
parts.append(finger(158, 284, -9, 180, 49))
palm_fill = f'<path d="M134,290 C128,340 140,390 158,440 L288,440 C296,390 300,340 288,300 Z" fill="{BG}"/>'
palm_line = (f'<path d="M286,300 C300,350 296,410 286,540" fill="none" stroke="{LINE}" stroke-width="{SW}" stroke-linecap="round"/>'
             f'<path d="M150,415 C160,460 166,500 168,540" fill="none" stroke="{LINE}" stroke-width="{SW}" stroke-linecap="round"/>')
thumb = finger(152, 400, -38, 120, 46, 40, -25)
tn = ""
g = f'<g transform="rotate(-8 210 300)">' + "".join(parts) + palm_fill + palm_line + thumb + "</g>"
open("hand.svg", "w").write(g)
open("test.svg", "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 540"><rect width="400" height="540" fill="{BG}"/>{g}</svg>')
