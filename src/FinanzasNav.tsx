import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_URL } from './config';

const LINKS = [
  { href: '#hoja', label: 'La hoja' },
  { href: '#incluye', label: 'Qué incluye' },
  { href: '#como', label: 'Cómo se usa' },
  { href: '#faq', label: 'Preguntas' },
] as const;

/**
 * Misma navbar que `components/layout/Navbar.tsx` (logo "DC.dev", fija, transparente arriba y
 * con blur al hacer scroll), pero con los enlaces de esta página y sin cargar gsap.
 * El logo lleva al portafolio.
 */
export function FinanzasNav() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      aria-label="Principal"
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'blur-backdrop border-b border-border bg-void/80 py-4' : 'bg-transparent py-6'
      }`}
      initial={reduce ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6">
        <a
          href={PORTFOLIO_URL}
          aria-label="DC.dev, ir al portafolio"
          className="select-none font-mono text-xl font-bold tracking-tight"
        >
          <span className="text-accent-primary">DC</span>
          <span className="text-accent-electric">.</span>
          <span className="text-text-primary">dev</span>
        </a>

        <div className="hidden gap-8 font-sans text-sm md:flex">
          {LINKS.map((l) => (
            <motion.a
              key={l.href}
              href={l.href}
              className="text-text-muted transition-colors hover:text-text-primary"
              whileHover={reduce ? undefined : { y: -2 }}
            >
              {l.label}
            </motion.a>
          ))}
        </div>

        <a
          href={PORTFOLIO_URL}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/60 hover:text-accent-primary"
        >
          Ver portafolio
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </motion.nav>
  );
}
