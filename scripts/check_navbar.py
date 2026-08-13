from PIL import Image
import numpy as np

im = Image.open(r'C:\Users\rgs84\AppData\Local\hermes\profiles\charla\cache\screenshots\browser_screenshot_2be058777cbc4873902c39365f348029.png').convert('RGB')
W, H = im.size
print('Screenshot:', W, 'x', H)

# La navbar: primera franja. Busco el chip blanco (fondo del logo)
nav = np.array(im)[:int(H*0.03)]
white = np.logical_and.reduce((nav[:,:,0]>240, nav[:,:,1]>240, nav[:,:,2]>240))
ys, xs = np.where(white)
if len(xs):
    print('Chip blanco detectado: x', xs.min(), '-', xs.max(), '| y', ys.min(), '-', ys.max())
    chip = nav[ys.min():ys.max()+1, xs.min():xs.max()+1]
    teal = np.logical_and.reduce((np.abs(chip[:,:,0].astype(int)-52)<45, np.abs(chip[:,:,1].astype(int)-80)<45, np.abs(chip[:,:,2].astype(int)-91)<45))
    amber = np.logical_and.reduce((np.abs(chip[:,:,0].astype(int)-233)<45, np.abs(chip[:,:,1].astype(int)-159)<45, np.abs(chip[:,:,2].astype(int)-60)<45))
    print('Dentro del chip -> teal:', teal.sum(), '| ambar:', amber.sum())
    if teal.sum() > 100 and amber.sum() > 100:
        print('=> LOGO VISIBLE Y CON COLOR SOBRE CHIP BLANCO: OK')
    else:
        print('=> chip blanco pero poco logo dentro (revisar)')
else:
    print('=> NO hay chip blanco en la navbar (el logo no se ve)')
