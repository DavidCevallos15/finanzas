import { ClipboardList, Gauge, History, RotateCcw, Table, Tag, type LucideIcon } from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  tab: string;
  title: string;
  text: string;
}

export const FEATURES: Feature[] = [
  {
    icon: ClipboardList,
    tab: 'INICIO',
    title: 'Registra en diez segundos',
    text: 'Un formulario para crear, editar y eliminar movimientos. Si eliges Gasto, solo te salen categorías de gasto.',
  },
  {
    icon: Table,
    tab: 'MOVIMIENTOS',
    title: 'Todo tu historial en una tabla',
    text: 'Cada registro tiene un ID único. Filtra, busca y corrige directo en la tabla; nada se duplica.',
  },
  {
    icon: Tag,
    tab: 'CATEGORIAS',
    title: 'Presupuesto antes de gastar',
    text: 'Pon un tope mensual a cada categoría. Si renombras una, se actualizan todos sus movimientos.',
  },
  {
    icon: Gauge,
    tab: 'DASHBOARD',
    title: 'Un semáforo, sin hacer cuentas',
    text: 'Ingresos, gastos y saldo del mes, más el estado: bien, alerta, riesgo o mal. Cada categoría marca si te pasaste.',
  },
  {
    icon: History,
    tab: 'HISTORIAL',
    title: 'Mes a mes, en automático',
    text: 'Se calcula desde tus movimientos. Si corriges un gasto viejo, el historial se corrige también.',
  },
  {
    icon: RotateCcw,
    tab: 'MENÚ',
    title: 'Reinicia cuando quieras',
    text: 'Borra solo los movimientos o deja todo como recién instalado. Siempre pide confirmación antes.',
  },
];

export const STEPS = [
  {
    title: 'Haz tu copia',
    text: 'Pulsa el botón y Google te pide confirmar. La copia queda en tu cuenta, no en la mía.',
  },
  {
    title: 'Instálala una vez',
    text: 'En el menú “💰 Mis Finanzas” elige “Instalar / reparar sistema” y acepta los permisos.',
  },
  {
    title: 'Reparte y registra',
    text: 'Pon tu presupuesto en CATEGORIAS y registra tu primer ingreso desde INICIO.',
  },
] as const;

export const SAMPLE_COSTS = ['$1,50 bus', '$3 snack', '$5 delivery', '$2 recarga'] as const;

export interface BudgetRow {
  name: string;
  budget: number;
  spent: number;
}

/** Mismos datos de ejemplo del video: $400 de ingreso repartidos en categorías. */
export const PREVIEW = {
  income: 400,
  expenses: 183.5,
  rows: [
    { name: 'Transporte', budget: 60, spent: 12 },
    { name: 'Alimentación', budget: 100, spent: 25 },
    { name: 'Telefonía', budget: 15, spent: 5 },
    { name: 'Antojos', budget: 40, spent: 41.5 },
    { name: 'Ahorro Laptop', budget: 100, spent: 100 },
  ] satisfies BudgetRow[],
};

export const FAQ = [
  {
    q: '¿Es gratis?',
    a: 'Sí. Haces tu copia y es tuya. Si te sirve, un comentario o un suscriptor en el canal me ayuda mucho.',
  },
  {
    q: '¿Necesito saber programar?',
    a: 'No. Solo sigues los tres pasos. El código está a la vista en Extensiones > Apps Script por si quieres revisarlo o modificarlo.',
  },
  {
    q: '¿Mis datos son privados?',
    a: 'Sí. La plantilla se copia a tu cuenta de Google y corre ahí. No envía tus movimientos a ningún servidor mío y yo no puedo verlos.',
  },
  {
    q: 'Al instalarla, Google dice “app no verificada”. ¿Es seguro?',
    a: 'Es normal en scripts personales: Google avisa porque el script no pasó por su revisión de apps públicas. Puedes leer el código antes de aceptar. Para continuar elige “Configuración avanzada” y luego ir al proyecto.',
  },
  {
    q: '¿Funciona desde el celular?',
    a: 'Instálala desde una computadora, porque el paso usa un menú. Después puedes consultar el dashboard desde el celular; para registrar movimientos lo más cómodo es el navegador.',
  },
  {
    q: '¿Tiene relación con Jóvenes en Acción o el MIES?',
    a: 'No. Es una herramienta independiente. El programa se menciona solo como ejemplo de ingresos puntuales que conviene repartir bien.',
  },
] as const;

export interface Project {
  name: string;
  kind: string;
  stack: string;
  href: string;
}

/** Tomados de la sección "Proyectos Destacados" de davidcevallos.vercel.app. */
export const PROJECTS: Project[] = [
  { name: 'Inforario UTM', kind: 'Integración IA', stack: 'Vite · TypeScript · Tailwind', href: 'https://inforario-ia-null.vercel.app/' },
  { name: 'Of Essence', kind: 'E-Commerce', stack: 'Next.js · Tailwind · Framer Motion', href: 'https://of-essence.vercel.app/' },
  { name: 'Teatro Bernarda', kind: 'Plataforma web', stack: 'React · Node.js · Vercel', href: 'https://teatrobernarda.vercel.app/' },
  { name: 'Servicios de Enfermería', kind: 'Diseño web', stack: 'React · Tailwind · Vercel', href: 'https://enfermero-jimmy-cevallos.vercel.app/' },
];
