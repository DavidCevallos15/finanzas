/**
 * Único archivo que tienes que tocar para publicar la página.
 */

/** Tu portafolio. Todos los botones "Ver portafolio" apuntan aquí. */
export const PORTFOLIO_URL = 'https://davidcevallos.vercel.app';
export const PORTFOLIO_CONTACT_URL = `${PORTFOLIO_URL}/#contact`;
export const YOUTUBE_URL = 'https://www.youtube.com/@JimmyCevaZam';
export const GITHUB_URL = 'https://github.com/DavidCevallos15';

/**
 * ID de la hoja PLANTILLA (la parte larga entre /d/ y /edit en su URL).
 * Usa una copia limpia (menú Mis Finanzas > Reset de fábrica) compartida como
 * "Cualquier persona con el enlace: Lector". Nunca pongas aquí tu hoja con datos reales.
 * Vacío = el botón se muestra como "Próximamente".
 */
export const TEMPLATE_SHEET_ID: string = '1TXeM2qQm-gHGw3qohVjHVzzD3Vo5kfybaXBCNliwPTw';

/** Enlace de tu video de YouTube con la explicación. Vacío = se muestra el canal. */
export const VIDEO_URL: string = '';

/**
 * Captura de correo antes de mostrar el botón de descarga.
 * Endpoint que reciba un POST JSON { email, source, consent } (Formspree, Supabase, etc.).
 * Vacío = el botón aparece directo, sin pedir correo.
 */
export const LEAD_ENDPOINT: string = '';

export const COPY_URL: string = TEMPLATE_SHEET_ID
  ? `https://docs.google.com/spreadsheets/d/${TEMPLATE_SHEET_ID}/copy`
  : '';
