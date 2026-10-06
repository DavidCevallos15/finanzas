import {
  GITHUB_URL,
  PORTFOLIO_CONTACT_URL,
  PORTFOLIO_URL,
  YOUTUBE_URL,
} from "./config";

const EMAIL = "jimdav1506ceva@gmail.com";

/** Footer con el mismo lenguaje visual de la sección Contact del portafolio (etiquetas mono en cian). */
export function FinanzasFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-obsidian">
      {/* Mismo fondo que el footer del portafolio: video tenue + degradado. */}
      <video
        src="/animation-footer-background/yo_animado_programando.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-20 motion-reduce:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-obsidian via-transparent to-black/80"
      />

      <div className="relative z-10">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <a
              href={PORTFOLIO_URL}
              aria-label="DC.dev, ir al portafolio"
              className="font-mono text-xl font-bold tracking-tight"
            >
              <span className="text-accent-primary">DC</span>
              <span className="text-accent-electric">.</span>
              <span className="text-text-primary">dev</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted text-pretty">
              Desarrollo web full-stack. Esta plantilla es un proyecto aparte
              del portafolio, hecho con Google Sheets y Apps Script.
            </p>
          </div>

          <div className="space-y-3 font-mono text-sm">
            <p className="flex items-center gap-4">
              <span className="w-20 text-accent-electric">EMAIL</span>
              <a
                href={`mailto:${EMAIL}`}
                className="transition-colors hover:text-accent-primary"
              >
                {EMAIL}
              </a>
            </p>
            <p className="flex items-center gap-4">
              <span className="w-20 text-accent-electric">LOC</span>
              <span>Manabí, Ecuador [UTC-5]</span>
            </p>
          </div>

          <nav aria-label="Enlaces" className="space-y-3 font-mono text-sm">
            <p className="flex items-center gap-4">
              <span className="w-20 text-accent-electric">WEB</span>
              <a
                href={PORTFOLIO_URL}
                className="transition-colors hover:text-accent-primary"
              >
                Portafolio
              </a>
            </p>
            <p className="flex items-center gap-4">
              <span className="w-20 text-accent-electric">TRABAJO</span>
              <a
                href={PORTFOLIO_CONTACT_URL}
                className="transition-colors hover:text-accent-primary"
              >
                Contacto
              </a>
            </p>
            <p className="flex items-center gap-4">
              <span className="w-20 text-accent-electric">VIDEO</span>
              <a
                href={YOUTUBE_URL}
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent-primary"
              >
                YouTube
              </a>
            </p>
            <p className="flex items-center gap-4">
              <span className="w-20 text-accent-electric">CODE</span>
              <a
                href={GITHUB_URL}
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent-primary"
              >
                GitHub
              </a>
            </p>
          </nav>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Jimmy David Cevallos Zambrano</p>
            <p className="max-w-md leading-relaxed sm:text-right">
              Herramienta informativa; no es asesoría financiera. No está
              afiliada a Jóvenes en Acción ni al MIES.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
