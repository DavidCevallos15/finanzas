import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Mail, ShieldCheck } from 'lucide-react';
import {
  COPY_URL,
  GITHUB_URL,
  LEAD_ENDPOINT,
  PORTFOLIO_CONTACT_URL,
  PORTFOLIO_URL,
  VIDEO_URL,
  YOUTUBE_URL,
} from './config';
import { FinanzasFooter } from './FinanzasFooter';
import { FinanzasNav } from './FinanzasNav';
import { SheetPreview } from './SheetPreview';
import { FAQ, FEATURES, PREVIEW, PROJECTS, SAMPLE_COSTS, STEPS, type BudgetRow } from './content';

const UNLOCK_KEY = 'dc-finanzas-unlocked';

const btnBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors duration-200';
const btnPrimary = `${btnBase} bg-gold text-on-gold hover:brightness-110`;
const btnGhost = `${btnBase} border border-line text-fg hover:border-gold/60 hover:text-gold`;

const money = (n: number) => `$${n.toFixed(2).replace('.', ',')}`;

/* ------------------------------------------------------------------ */
/* Utilidades de UI                                                    */
/* ------------------------------------------------------------------ */

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ id, eyebrow, title, lead }: { id?: string; eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-base leading-relaxed text-muted text-pretty">{lead}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Vista previa del dashboard (datos de ejemplo)                       */
/* ------------------------------------------------------------------ */

function budgetState(row: BudgetRow) {
  const pct = row.budget > 0 ? row.spent / row.budget : 0;
  if (pct > 1) return { label: 'Excedido', dot: 'bg-bad', text: 'text-bad', bar: 'bg-bad', pct };
  if (pct >= 0.8) return { label: 'Cerca del límite', dot: 'bg-warn', text: 'text-warn', bar: 'bg-warn', pct };
  return { label: 'OK', dot: 'bg-ok', text: 'text-ok', bar: 'bg-ok', pct };
}

function DashboardPreview() {
  const { income, expenses, rows } = PREVIEW;
  const balance = income - expenses;
  const usedPct = Math.round((expenses / income) * 100);

  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_24px_80px_-24px_rgba(var(--accent-gemini-rgb),0.25)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Dashboard financiero</p>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-ok">
            <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
            BIEN · {usedPct}% usado
          </span>
        </div>

        <dl className="grid grid-cols-3 gap-px bg-line">
          {[
            { label: 'Ingresos', value: money(income), tone: 'text-ok' },
            { label: 'Gastos', value: money(expenses), tone: 'text-bad' },
            { label: 'Saldo', value: money(balance), tone: 'text-fg' },
          ].map((s) => (
            <div key={s.label} className="bg-panel px-4 py-4">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">{s.label}</dt>
              <dd className={`mt-1 text-xl font-bold tabular-nums sm:text-2xl ${s.tone}`}>{s.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="divide-y divide-line/70">
          {rows.map((row) => {
            const st = budgetState(row);
            return (
              <li key={row.name} className="px-5 py-3">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{row.name}</span>
                  <span className="font-mono text-xs tabular-nums text-muted">
                    {money(row.spent)} / {money(row.budget)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <div className={`h-full rounded-full ${st.bar}`} style={{ width: `${Math.min(st.pct, 1) * 100}%` }} />
                  </div>
                  <span className={`flex w-32 items-center justify-end gap-1.5 font-mono text-[11px] ${st.text}`}>
                    <span className={`size-1.5 rounded-full ${st.dot}`} aria-hidden="true" />
                    {st.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="mt-3 text-center font-mono text-[11px] text-muted">
        Vista previa con datos de ejemplo
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Descarga (con captura de correo opcional)                           */
/* ------------------------------------------------------------------ */

function GetTemplate() {
  const needsEmail = LEAD_ENDPOINT !== '';
  const [unlocked, setUnlocked] = useState(!needsEmail);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  useEffect(() => {
    if (!needsEmail) return;
    try {
      if (localStorage.getItem(UNLOCK_KEY) === '1') setUnlocked(true);
    } catch {
      /* almacenamiento bloqueado: se pedirá el correo de nuevo */
    }
  }, [needsEmail]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    // Campo trampa para bots: si viene lleno, se ignora sin avisar.
    const trap = new FormData(e.currentTarget).get('company');
    if (typeof trap === 'string' && trap !== '') return;

    setStatus('sending');
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'finanzas-template', consent: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try {
        localStorage.setItem(UNLOCK_KEY, '1');
      } catch {
        /* sin almacenamiento: igual se desbloquea en esta visita */
      }
      setUnlocked(true);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  const videoHref = VIDEO_URL || YOUTUBE_URL;

  return (
    <div className="rounded-2xl border border-line bg-panel p-6 sm:p-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Gratis</p>
          <h2 id="obtener-titulo" className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Llévatela y empieza hoy
          </h2>
          <p className="mt-4 leading-relaxed text-muted text-pretty">
            {needsEmail && !unlocked
              ? 'Déjame tu correo y se desbloquea el botón. Solo lo uso para enviarte la plantilla y avisarte cuando publique algo nuevo.'
              : 'Haz tu copia en Google Sheets y sigue los tres pasos de arriba. Si te atoras, el video lo explica de principio a fin.'}
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-muted">
            {['Se guarda en tu cuenta de Google', 'Sin tarjeta ni pagos ocultos', 'Código visible en Apps Script'].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-ok" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {!unlocked ? (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="fin-email" className="mb-2 block text-sm font-medium">
                  Tu correo
                </label>
                <input
                  id="fin-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-line bg-ink px-4 text-base text-fg placeholder:text-muted/60 focus:border-gold"
                />
              </div>
              {/* Honeypot */}
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
              <label className="flex items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-[#e2b65c]"
                />
                <span>Acepto que me envíen la plantilla y novedades por correo. Puedo darme de baja cuando quiera.</span>
              </label>
              <button type="submit" disabled={status === 'sending' || !consent} className={`${btnPrimary} w-full disabled:opacity-60`}>
                <Mail className="size-4" aria-hidden="true" />
                {status === 'sending' ? 'Enviando…' : 'Desbloquear plantilla'}
              </button>
              <p role="status" aria-live="polite" className="min-h-5 text-sm text-bad">
                {status === 'error' ? 'No pude registrar tu correo. Revisa tu conexión e inténtalo de nuevo.' : ''}
              </p>
            </form>
          ) : (
            <div className="space-y-3">
              {COPY_URL ? (
                <a href={COPY_URL} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} w-full min-h-14 text-base`}>
                  <Copy className="size-5" aria-hidden="true" />
                  Hacer una copia en Google Sheets
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`${btnBase} min-h-14 w-full cursor-not-allowed border border-dashed border-line bg-ink text-base text-muted`}
                >
                  Próximamente
                </button>
              )}
              <a href={videoHref} target="_blank" rel="noopener noreferrer" className={`${btnGhost} w-full`}>
                {VIDEO_URL ? 'Ver el video paso a paso' : 'Ver el canal en YouTube'}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function FinanzasPage() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-on-gold"
      >
        Saltar al contenido
      </a>

      <FinanzasNav />

      <main id="contenido">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_80%_0%,rgba(var(--accent-gemini-rgb),0.13),transparent),radial-gradient(45%_45%_at_0%_30%,rgba(0,180,216,0.08),transparent)]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 pt-32 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-36">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
                Plantilla gratis · Google Sheets
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Que tus <span className="text-gold">$400</span> no desaparezcan en dos semanas.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
                Registra ingresos y gastos, reparte tu presupuesto por categoría y mira con colores si vas bien. Pensada para
                quien recibe pagos puntuales, como un bono o una beca: Jóvenes en Acción es el ejemplo del video.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#obtener" className={btnPrimary}>
                  Obtener la plantilla
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a href={PORTFOLIO_URL} className={btnGhost}>
                  Ver mi portafolio
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted">
                <ShieldCheck className="size-4 text-ok" aria-hidden="true" />
                Corre en tu cuenta de Google. Yo no veo tus datos.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <DashboardPreview />
            </Reveal>
          </div>
        </section>

        {/* Problema */}
        <section className="border-y border-line/70 bg-void" aria-labelledby="problema">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <Reveal className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
              <h2 id="problema" className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                La plata no se va por un gasto grande.
              </h2>
              <div>
                <p className="text-lg leading-relaxed text-muted text-pretty">
                  Se va en los chiquitos que nadie anota. Uno por uno parecen nada; al final del mes son el hueco.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Ejemplos de gastos pequeños">
                  {SAMPLE_COSTS.map((c) => (
                    <li key={c} className="rounded-full border border-line bg-panel px-3.5 py-1.5 font-mono text-xs text-fg">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Vista real de la hoja */}
        <section id="hoja" className="mx-auto max-w-6xl px-5 pt-20" aria-labelledby="hoja-titulo">
          <Reveal>
            <SectionHead
              id="hoja-titulo"
              eyebrow="Vista real"
              title="Así se ve por dentro"
              lead="Es la misma hoja que vas a copiar. Pasa por las pestañas para ver el formulario, la tabla de movimientos, el presupuesto y el dashboard."
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <SheetPreview />
          </Reveal>
        </section>

        {/* Qué incluye */}
        <section id="incluye" className="mx-auto max-w-6xl px-5 py-20" aria-labelledby="incluye-titulo">
          <Reveal>
            <SectionHead
              id="incluye-titulo"
              eyebrow="Qué incluye"
              title="Cinco hojas y un menú, una sola fuente de datos"
              lead="Tú solo escribes en MOVIMIENTOS y CATEGORIAS. El dashboard y el historial se recalculan solos."
            />
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <li key={f.tab}>
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <article className="h-full rounded-xl border border-line bg-panel/70 p-6 transition-colors hover:border-gold/40">
                    <div className="flex items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-lg border border-line bg-ink text-gold">
                        <f.icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[11px] tracking-widest text-muted">{f.tab}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{f.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Cómo se usa */}
        <section id="como" className="border-y border-line/70 bg-void" aria-labelledby="como-titulo">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <Reveal>
              <SectionHead id="como-titulo" eyebrow="Cómo se usa" title="Tres pasos y estás registrando" />
            </Reveal>
            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <div className="h-full rounded-xl border border-line bg-panel/70 p-6">
                      <span className="font-mono text-sm text-gold">0{i + 1}</span>
                      <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{s.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal>
              <p className="mt-6 flex items-start gap-3 rounded-xl border border-cyber/30 bg-cyber/5 p-4 text-sm leading-relaxed text-muted">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-cyber" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-fg">¿Te sale un aviso de “app no verificada”?</strong> Es normal en scripts
                  personales. Puedes revisar el código en Extensiones &gt; Apps Script antes de aceptar.
                </span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* Descarga */}
        <section id="obtener" className="mx-auto max-w-6xl px-5 py-20" aria-labelledby="obtener-titulo">
          <Reveal>
            <GetTemplate />
          </Reveal>
        </section>

        {/* Autor */}
        <section className="border-y border-line/70 bg-void" aria-labelledby="autor">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Quién la hizo</p>
              <h2 id="autor" className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Soy David Cevallos
              </h2>
              <p className="mt-4 leading-relaxed text-muted text-pretty">
                Full-Stack Developer & TI Engineer (Cand.). Armé esta plantilla para ordenar mis propias finanzas y la comparto
                porque no es el único al que se le desordena la plata. Si necesitas algo parecido para tu negocio, lo hablamos.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={PORTFOLIO_URL} className={btnPrimary}>
                  Ver portafolio completo
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
                <a href={PORTFOLIO_CONTACT_URL} className={btnGhost}>
                  Trabajemos juntos
                </a>
              </div>
              <p className="mt-5 flex gap-5 text-sm text-muted">
                <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold">YouTube</a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold">GitHub</a>
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Proyectos recientes</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {PROJECTS.map((p) => (
                  <li key={p.name}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col justify-between rounded-xl border border-line bg-panel/70 p-5 transition-colors hover:border-gold/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-gold">{p.kind}</span>
                        <ArrowUpRight
                          className="size-4 text-muted transition-colors group-hover:text-gold"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-5">
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="mt-1 font-mono text-xs text-muted">{p.stack}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-20" aria-labelledby="faq-titulo">
          <Reveal>
            <SectionHead id="faq-titulo" eyebrow="Preguntas" title="Antes de que preguntes" />
          </Reveal>
          <div className="mt-10 divide-y divide-line/70 border-y border-line/70">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-left font-medium">
                  {item.q}
                  <ChevronDown
                    className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-muted text-pretty">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <FinanzasFooter />
    </>
  );
}
