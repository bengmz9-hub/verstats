# Landing Comerç24h — estructura

Landing del pack "Presencia digital + más clientes" (proyecto FUTURO, Hospitalet).
Diseño: petróleo nocturno #0e1f2a + ámbar #e8a33d, Satoshi + General Sans (Fontshare), gate impeccable 4.0 a 0 hallazgos.

## Estructura (regla: NADA suelto en la raíz)

```
landing/
├── index.html                 # la web (CSS+JS inline, no hay separados)
├── README.md                  # este mapa
├── assets/
│   └── img/
│       ├── post1-color.webp   # posts IG usados por la web (WebP, ~60-80 KB)
│       ├── post2-bob.webp
│       ├── post3-local.webp
│       ├── og-image.png       # imagen Open Graph 1200x630 (compartir WhatsApp)
│       └── originales/        # PNG FLUX 1088x1344 (fuente de alta resolución, ~1,6 MB c/u)
├── backups/                   # snapshots de versiones anteriores (NO editar)
│   ├── index-backup-correcciones.html
│   └── index-backup-mejoras-tecnicas.html
└── scripts/
    └── optimizar_imagenes.py  # PNG -> WebP + genera og-image (Pillow, rutas relativas)
```

## Reglas

- Cualquier imagen nueva va a `assets/img/`; originales pesados a `assets/img/originales/`.
- Referencias en index.html SIEMPRE como `assets/img/<archivo>` (rutas relativas a la raíz de landing/).
- Los backups son históricos: sus rutas internas son de su época, no se tocan.
- Scripts en `scripts/`, nunca en la raíz.
- Regenerar imágenes: `python scripts/optimizar_imagenes.py` (escribe en assets/img/).

## Pendientes

- Número real de WhatsApp en los 5 wa.me (placeholder 34XXXXXXXXX).
- og:image debe ser URL absoluta del dominio final al publicar.
- Decidir si se publica (aún no hay luz verde).
