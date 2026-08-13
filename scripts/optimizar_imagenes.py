# -*- coding: utf-8 -*-
"""Optimiza imagenes de la landing: PNG 4.6MB -> WebP ~150KB + genera og-image.png 1200x630."""
import os
from PIL import Image, ImageDraw, ImageFont

LANDING = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # scripts/ -> landing/
IMG = os.path.join(LANDING, "assets", "img")
os.chdir(IMG)

# --- 1. WebP de los posts FLUX (1088x1344 4:5) ---
results = []
for name in ["post1-color", "post2-bob", "post3-local"]:
    src = f"{name}.png"
    dst = f"{name}.webp"
    img = Image.open(src).convert("RGB")
    img.save(dst, "WEBP", quality=78, method=6)
    src_kb = os.path.getsize(src) / 1024
    dst_kb = os.path.getsize(dst) / 1024
    results.append(f"{src}: {src_kb:.0f} KB -> {dst_kb:.0f} KB (x{src_kb/dst_kb:.0f})")

# --- 2. og-image.png 1200x630 (paleta petroleo + ambar) ---
W, H = 1200, 630
img = Image.new("RGB", (W, H), "#0e1f2a")
d = ImageDraw.Draw(img)

# Puntos decorativos ambar tenues
for i in range(26):
    x = 60 + (i * 137) % (W - 200)
    y = 40 + (i * 211) % (H - 120)
    r = 3 + (i % 3) * 2
    d.ellipse([x, y, x + r * 2, y + r * 2], fill="#e8a33d", outline=None)

# Banda inferior mas oscura
d.rectangle([0, H - 120, W, H], fill="#08141c")

def font(path, size):
    return ImageFont.truetype(path, size)

# Titulo
try:
    f_title = font(r"C:\Windows\Fonts\arialbd.ttf", 92)
    f_sub = font(r"C:\Windows\Fonts\arial.ttf", 34)
    f_foot = font(r"C:\Windows\Fonts\arial.ttf", 26)
except Exception:
    f_title = f_sub = f_foot = ImageFont.load_default()

d.text((70, 150), "Comerç24h", font=f_title, fill="#e8a33d")
d.text((74, 285), "Presencia digital para el comercio de barrio", font=f_sub, fill="#e6eef2")
d.text((74, 360), "Ficha de Google optimizada · Reseñas respondidas · Contenido cada semana", font=f_sub, fill="#93a7b2")
d.text((74, H - 90), "Pubilla Cases · Can Serra — L'Hospitalet de Llobregat", font=f_foot, fill="#e8a33d")

img.save("og-image.png", "PNG", optimize=True)
og_kb = os.path.getsize("og-image.png") / 1024
results.append(f"og-image.png: {og_kb:.0f} KB (1200x630)")

print("\n".join(results))
