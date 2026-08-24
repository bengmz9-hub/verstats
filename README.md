# Landing Verstats — Estructura y Pipeline

Landing del pack "Presencia digital para el comercio de barrio" (proyecto FUTURO, Hospitalet — marca Verstats).
Diseño: fondo petróleo `#08141C` + acento ámbar `#E8A33D`, tipografías locales Satoshi + General Sans (woff2), suite Impeccable 4.0 y bilingüe ES / CA.

## Estructura Actual

```
04-landing/
├── index.html                 # Plantilla base (Pubilla Cases y Can Serra)
├── index-collblanc.html       # Variante Collblanc y La Torrassa
├── index-bellvitge.html       # Variante Bellvitge y Gornal
├── index-florida.html         # Variante La Florida y Les Planes
├── aviso-legal.html           # Página legal (RGPD / LSSI)
├── privacidad.html            # Política de privacidad
├── cookies.html               # Política de cookies
├── build.js                   # Pipeline de minificación de assets (npm run build)
├── package.json               # Configuración de scripts y dependencias
├── assets/
│   ├── styles.css / .min.css  # Estilos globales y versión minificada
│   ├── script.js / .min.js    # Lógica i18n, interactividad, ROI y modal
│   ├── legal.css              # Estilos para páginas legales
│   ├── fonts/                 # Tipografías locales WOFF2 (Satoshi, General Sans)
│   └── img/                   # WebP optimizados y logos transparentes
└── scripts/
    └── generar_landing_barrio.py # Motor multibarrio CLI (Schema.org + textos)
```

## Comandos Operativos

- **Compilar assets minificados:**
  ```bash
  npm run build
  ```
- **Generar landing de barrio específica:**
  ```bash
  python scripts/generar_landing_barrio.py collblanc
  python scripts/generar_landing_barrio.py bellvitge
  python scripts/generar_landing_barrio.py florida
  ```

## Pendientes de Lanzamiento

- Reemplazar placeholder `WHATSAPP_PHONE` en `assets/script.js` con el número real.
- Asignar dominio definitivo y activar `index, follow` en robots/meta.
- Desplegar en CDN con soporte de cabeceras HTTP de seguridad.
