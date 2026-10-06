# finanzas

Landing de la plantilla gratis de finanzas personales en Google Sheets, por [David Cevallos](https://davidcevallos.vercel.app).

Vite + React + TypeScript + Tailwind CSS v4.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # genera dist/
npm run preview
```

En Vercel se detecta como proyecto Vite: Build Command `npm run build`, Output Directory `dist`.

## Antes de publicar: `src/config.ts`

- `TEMPLATE_SHEET_ID`: ID de una copia LIMPIA de la hoja (menú Mis Finanzas > Reset de fábrica),
  compartida como "Cualquier persona con el enlace: Lector". Nunca la hoja con datos reales.
- `VIDEO_URL`: enlace del video. Vacío = muestra el canal.
- `LEAD_ENDPOINT`: POST JSON `{ email, source, consent }` (Formspree, Supabase...). Vacío = el botón sale directo.

## Estructura

- `src/index.css`: tokens de marca "Mercurio Digital" copiados del portafolio (claro/oscuro, fuentes).
- `src/finanzas.css`: alias cortos (`gold`, `ink`, `panel`...) y colores del semáforo.
- `src/SheetPreview.tsx`: réplica interactiva de la hoja en Google Sheets con datos de ejemplo.
- `public/`: favicons y el video de fondo del footer.

## Publicidad

El Offerwall de AdSense pide dominio propio aprobado (`*.vercel.app` normalmente se rechaza).
Pega el script en el bloque comentado de `index.html`.
