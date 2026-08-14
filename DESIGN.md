# Design System & Specification: Verstats Landing

**Registro:** Marketing / Landing de Comercio Local (L'Hospitalet de Llobregat)  
**Versión:** 1.0.0 (Impeccable 4.0 Verified)  
**Superficie:** `06-hospitalet/04-landing/index.html`

---

## 🎨 1. Tokens de Diseño (CSS Custom Properties)

### 1.1 Paleta de Color (Petróleo & Ámbar)
La identidad visual combina la seriedad y elegancia del petróleo nocturno con el calor y cercanía del ámbar comercial y el verde WhatsApp oficial.

```css
:root {
  /* Superficies y Fondo */
  --paper: #0e1f2a;       /* Fondo principal (Petróleo profundo) */
  --card: #17303d;        /* Contenedores y tarjetas elevadas */
  --dark: #08141c;        /* Fondo contrastado para CTA final */
  --line: #28424f;        /* Bordes sutiles y divisores */

  /* Textos y Contraste */
  --ink: #e6eef2;         /* Texto principal de alto contraste (15.2:1 AAA) */
  --muted: #93a7b2;       /* Texto secundario y leyendas (6.3:1 AA) */

  /* Acentos de Marca */
  --accent: #e8a33d;      /* Ámbar petróleo (Destacados y focos) */
  --accent-deep: #c98a2a; /* Ámbar oscuro para textos sobre claro */
  --accent-soft: #243b44; /* Fondo de badges y tags de acento */

  /* Estados y Canales */
  --green: #4ade80;       /* Checks y estados abiertos */
  --wa: #25d366;          /* Verde WhatsApp oficial (CTAs principales) */
  --wa-deep: #075e54;     /* Verde WhatsApp oscuro (Cabecera de chat) */
  --wa-chat-bg: #e5ddd5;  /* Fondo oficial de chat WhatsApp */
  --wa-out: #d9fdd3;      /* Burbuja saliente de usuario */
  --wa-sys: #dcf8c6;      /* Burbuja de sistema/confirmación */
}
```

### 1.2 Geometría y Sombras
* **Bordes redondeados:** `--radius: 16px` (tarjetas), `12px` (botones), `999px` (pills y badges).
* **Sombras:** `--shadow: 0 1px 2px rgba(0,0,0,.25), 0 4px 10px rgba(0,0,0,.28)`.

---

## ✍️ 2. Tipografía & Ritmo Editorial

### 2.1 Fuentes
* **Display / Headings:** `Satoshi` (Fontshare, pesos 700 y 800) — Elegancia geométrica legible.
* **Body / Textos:** `General Sans` (Fontshare, pesos 400, 500 y 600) — Neutralidad y claridad técnica.

### 2.2 Escala Modular y Balance
* **Hero Display:** `font-size: clamp(2.1rem, 4.6vw, 3.4rem); letter-spacing: -0.03em; line-height: 1.08;`
* **Section Titles (`H2`):** `font-size: clamp(1.7rem, 3.2vw, 2.4rem); letter-spacing: -0.02em; line-height: 1.15;`
* **Card Headings (`H3`):** `font-size: 1.15rem - 1.5rem; letter-spacing: -0.01em;`
* **Reglas de balanceo:**
  * `h1, h2, h3 { text-wrap: balance; }` (previene saltos asimétricos de línea).
  * `p, .lead, details p { text-wrap: pretty; max-width: 68ch; }` (longitud de línea óptima para lectura sin fatiga).

---

## ⚡ 3. Estados Interactivos (The 8 States)

1. **Default:** Estilos base con bordes limpios `--line`.
2. **Hover:** Elevación suave `transform: translateY(-1px)` y cambio de contraste en fondo.
3. **Active:** Respuesta táctil elástica `transform: scale(0.97)`.
4. **Focus-Visible:** Anillo de foco accesible `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }`.
5. **Open / Expanded:** Transición suave en acordeones `<details>` con rotación de icono `+` a `×` (45deg).

---

## 🧩 4. Componentes Clave

1. **Navegación Sticky:**
   * Fondo translúcido con desenfoque (`backdrop-filter: blur(8px)`).
   * Logo Verstats con isotipo enmarcado + CTA directo a WhatsApp.
2. **Mockup Teléfono WhatsApp (Hero):**
   * Animación de entrada escalonada (`@keyframes waMsgIn`) en burbujas.
   * Simulación realista de reserva automática de citas.
3. **Selector Interactivo de Nicho (Tabs):**
   * Pestañas accesibles (`role="tablist"`): *Peluquería & Estética*, *Bar & Restaurante*, *Tienda & Comercio*.
   * Actualiza el mockup de Google Maps dinámicamente en tiempo real.
4. **Parrilla de Precios Orientada al Barrio:**
   * 1. Tarifa para *Asociados de PubillaComerç* (245 € + 50 €/mes).
   * 2. Pack Principal *Presencia Digital* (350 € + 50 €/mes, badge destacado).
   * 3. Extra a la carta *Web o landing* (600 €).

---

## 🛡️ 5. Estándares de Hardening y Accesibilidad

* **WCAG 2.1 AA:** Contraste mínimo $\ge 4.5:1$ en todos los textos de la página.
* **Resiliencia $320\text{px}$:** Adaptación fluida sin scroll horizontal ni rotura en pantallas de smartphones antiguos.
* **Reducción de Movimiento:** Respeto estricto a `@media (prefers-reduced-motion: reduce)`.
