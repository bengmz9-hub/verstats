from PIL import Image
import numpy as np

# Screenshot del SVG renderizado directo (2000x2000): logo teal/ambar sobre blanco
im = Image.open(r'C:\Users\rgs84\AppData\Local\hermes\profiles\charla\cache\screenshots\browser_screenshot_0677ecaf6ec14b46bc9c98947e31e7f0.png').convert('RGB')
arr = np.array(im)

# bbox del contenido (todo lo que no sea blanco puro)
no_white = np.logical_not(np.logical_and.reduce((arr[:,:,0]>245, arr[:,:,1]>245, arr[:,:,2]>245)))
ys, xs = np.where(no_white)
print('Contenido bbox:', xs.min(), xs.max(), ys.min(), ys.max())
crop = im.crop((int(xs.min()), int(ys.min()), int(xs.max())+1, int(ys.max())+1))

# blanco -> transparente (con tolerancia)
crop_rgba = crop.convert('RGBA')
data = np.array(crop_rgba)
white = np.logical_and.reduce((data[:,:,0]>238, data[:,:,1]>238, data[:,:,2]>238))
data[white, 3] = 0
# anti-alias: pixels casi blancos -> alpha proporcional
near = np.logical_and(np.logical_not(white),
                      np.logical_and.reduce((data[:,:,0]>200, data[:,:,1]>200, data[:,:,2]>200)))
data[near, 3] = 60

out = Image.fromarray(data)
W2, H2 = out.size
pad = 8
canvas = Image.new('RGBA', (W2+2*pad, H2+2*pad), (0,0,0,0))
canvas.paste(out, (pad, pad))
scale = 200 / canvas.size[1]
canvas = canvas.resize((int(canvas.size[0]*scale), 200), Image.LANCZOS)
canvas.save(r'C:\Users\rgs84\Desktop\proyecto FUTURO\hospitalet\landing\assets\img\logo-verstats.png')
print('PNG transparente OK:', canvas.size, '| modo:', canvas.mode)

a = np.array(canvas)[:,:,3]
print('Pixeles transparentes: %.1f%%' % ((a==0).sum()*100/a.size))
