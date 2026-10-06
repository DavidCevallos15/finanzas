import { useState, type ReactNode, type TdHTMLAttributes } from 'react';
import { ChevronDown, History, Lock, Menu, MessageSquare, Plus, Star, UserPlus } from 'lucide-react';
import { PREVIEW } from './content';

/**
 * Réplica de la hoja real en Google Sheets (pestañas INICIO, MOVIMIENTOS, CATEGORIAS,
 * DASHBOARD e HISTORIAL) con datos de ejemplo. Siempre en tema claro, como se ve en Sheets.
 */

type TabId = 'INICIO' | 'MOVIMIENTOS' | 'CATEGORIAS' | 'DASHBOARD' | 'HISTORIAL';

const TABS: { id: TabId; color: string; locked?: boolean; ref: string; formula: string }[] = [
  { id: 'INICIO', color: '#1a73e8', ref: 'A1:H1', formula: '💰 MIS FINANZAS PERSONALES' },
  { id: 'MOVIMIENTOS', color: '#d93025', ref: 'A1', formula: 'ID' },
  { id: 'CATEGORIAS', color: '#f29900', ref: 'A1', formula: 'Categoría' },
  { id: 'DASHBOARD', color: '#188038', locked: true, ref: 'B4', formula: "=SUMIFS(MOVIMIENTOS!E:E;MOVIMIENTOS!C:C;\"Ingreso\")" },
  { id: 'HISTORIAL', color: '#9334e6', locked: true, ref: 'A2', formula: '=QUERY(MOVIMIENTOS!A:H; …)' },
];

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;
const COL_WIDTHS = [150, 150, 120, 120, 100, 210, 100, 140];

const NAVY = '#1f4e79';
const fmt = (n: number) =>
  `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ------------------------------------------------------------------ */
/* Celdas                                                              */
/* ------------------------------------------------------------------ */

function C({ className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`h-[26px] border border-[#e2e3e3] px-1.5 align-middle whitespace-nowrap ${className}`} {...props} />;
}

function Row({ n, children, tall }: { n: number; children?: ReactNode; tall?: boolean }) {
  return (
    <tr className={tall ? 'h-[34px]' : undefined}>
      <th
        scope="row"
        className="sticky left-0 z-10 w-10 border border-[#c7c7c7] bg-[#f8f9fa] text-center text-[11px] font-normal text-[#5f6368]"
      >
        {n}
      </th>
      {children}
    </tr>
  );
}

function Empty({ n, from = 0 }: { n: number; from?: number }) {
  return (
    <Row n={n}>
      {COLS.slice(from).map((c) => (
        <C key={c} />
      ))}
    </Row>
  );
}

function Dropdown({ value }: { value?: string }) {
  return (
    <span className="flex items-center justify-between gap-2">
      <span>{value}</span>
      <ChevronDown className="size-3.5 shrink-0 text-[#5f6368]" aria-hidden="true" />
    </span>
  );
}

function Checkbox({ red, checked }: { red?: boolean; checked?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mx-auto grid size-4 place-items-center rounded-[3px] border-2 ${
        red ? 'border-[#e53935]' : 'border-[#b8860b]'
      } ${checked ? 'bg-[#b8860b] text-white' : ''}`}
    >
      {checked && <span className="text-[10px] leading-none">✓</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hojas                                                               */
/* ------------------------------------------------------------------ */

function SheetInicio() {
  const fields: [string, ReactNode, string?][] = [
    ['Fecha', <span className="block text-right">04/10/2026</span>],
    ['Tipo', <Dropdown value="Gasto" />],
    ['Categoría', <Dropdown value="Antojos" />],
    ['Descripción', 'Snack en la U'],
    ['Monto', <span className="block text-right">3,00</span>],
    ['Método de pago', <Dropdown value="Efectivo" />],
    ['Observación', ''],
  ];
  const actions: [string, string, boolean?][] = [
    ['💾', 'Guardar (crear / actualizar)'],
    ['🗑️', 'Eliminar (marcar 2 veces)', true],
    ['🧹', 'Limpiar / nuevo'],
    ['🔄', 'Recalcular todo'],
    ['📈', 'Ir al Dashboard'],
  ];
  const steps = [
    'CREAR: deja el ID vacío, llena los campos y marca Guardar.',
    'EDITAR: escribe/pega un ID en el campo ID (o en MOVIMIENTOS selecciona la fila → menú Editar). Cambia y marca Guardar.',
    'ELIMINAR: con un movimiento cargado marca Eliminar dos veces, o en MOVIMIENTOS selecciona filas → menú Eliminar.',
    'MOVIMIENTOS también se edita directo: el ID y la fecha de modificación se generan solos.',
    'CATEGORIAS: renombrar actualiza los movimientos; el presupuesto se refleja en DASHBOARD; para borrar usa el menú.',
    'DASHBOARD e HISTORIAL son calculados: no se editan a mano.',
    'RESET: menú 💰 → Borrar todos los movimientos (conserva categorías) o Reset de fábrica (todo).',
  ];

  return (
    <>
      <Row n={1} tall>
        <C colSpan={8} className="text-[19px] font-bold text-white" style={{ background: NAVY, outline: '2px solid #1a73e8', outlineOffset: -2 }}>
          💰 &nbsp;MIS FINANZAS PERSONALES
        </C>
      </Row>
      <Row n={2}>
        <C colSpan={8} className="bg-[#eaf1fb]">
          Crea, edita y elimina movimientos desde aquí. DASHBOARD e HISTORIAL se recalculan solos.
        </C>
      </Row>
      <Empty n={3} />
      <Row n={4}>
        <C colSpan={4} className="bg-[#7c3aed]" />
        <C />
        <C colSpan={2} className="font-bold text-white" style={{ background: NAVY }}>
          ⚙️ ACCIONES
        </C>
        <C />
      </Row>
      {[5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
        const field = n === 5 ? (['ID', ''] as const) : fields[n - 6];
        const action = actions[n - 5];
        return (
          <Row key={n} n={n}>
            <C className="bg-[#f3f3f3] font-bold">{field[0]}</C>
            <C colSpan={3}>{field[1]}</C>
            <C />
            {action ? (
              <>
                <C className={`font-bold ${action[2] ? 'bg-[#fde2e2]' : 'bg-[#dbe9f6]'}`}>
                  {action[0]} {action[1]}
                </C>
                <C className="bg-[#fff2cc]">
                  <Checkbox red={action[2]} />
                </C>
              </>
            ) : n === 11 ? (
              <C colSpan={2} className="italic text-[#5f6368]">
                Reset y borrado masivo: menú 💰 Mis Finanzas
              </C>
            ) : (
              <>
                <C />
                <C />
              </>
            )}
            <C />
          </Row>
        );
      })}
      <Empty n={13} />
      <Row n={14}>
        <C className="bg-[#f3f3f3] font-bold">Estado:</C>
        <C colSpan={3} className="bg-[#f3f3f3]">
          🆕 Nuevo movimiento: marca Guardar
        </C>
        <C colSpan={2} className="bg-[#f3f3f3] text-right font-bold">
          Actualizado:
        </C>
        <C colSpan={2} className="bg-[#f3f3f3] text-right">
          04/10/2026 23:24:21
        </C>
      </Row>
      <Empty n={15} />
      <Row n={16}>
        <C colSpan={8} className="font-bold text-white" style={{ background: NAVY }}>
          📌 CÓMO SE USA
        </C>
      </Row>
      {steps.map((s, i) => (
        <Row key={s} n={17 + i}>
          <C className="text-center font-bold">{i + 1}</C>
          <C colSpan={7}>{s}</C>
        </Row>
      ))}
    </>
  );
}

const MOVES = [
  { id: 1, date: '01/10/2026', type: 'Ingreso', cat: 'Bono / Beca', amount: 400, desc: 'Pago Jóvenes en Acción', method: 'Transferencia' },
  { id: 2, date: '01/10/2026', type: 'Gasto', cat: 'Ahorro Laptop', amount: 100, desc: 'Apartado para laptop', method: 'Transferencia' },
  { id: 3, date: '02/10/2026', type: 'Gasto', cat: 'Transporte', amount: 12, desc: 'Pasajes de bus', method: 'Efectivo' },
  { id: 4, date: '02/10/2026', type: 'Gasto', cat: 'Alimentación', amount: 25, desc: 'Almuerzos semana', method: 'Efectivo' },
  { id: 5, date: '03/10/2026', type: 'Gasto', cat: 'Telefonía', amount: 5, desc: 'Recarga celular', method: 'Tarjeta' },
  { id: 6, date: '03/10/2026', type: 'Gasto', cat: 'Antojos', amount: 3, desc: 'Snack', method: 'Efectivo' },
  { id: 7, date: '04/10/2026', type: 'Gasto', cat: 'Antojos', amount: 18.5, desc: 'Delivery', method: 'Tarjeta' },
  { id: 8, date: '04/10/2026', type: 'Gasto', cat: 'Antojos', amount: 20, desc: 'Cine', method: 'Tarjeta' },
];

function HeaderRow({ labels, color = NAVY }: { labels: string[]; color?: string }) {
  return (
    <Row n={1}>
      {COLS.map((c, i) => (
        <C key={c} className="font-bold text-white" style={{ background: labels[i] ? color : undefined }}>
          {labels[i]}
        </C>
      ))}
    </Row>
  );
}

function SheetMovimientos() {
  return (
    <>
      <HeaderRow labels={['ID', 'Fecha', 'Tipo', 'Categoría', 'Monto', 'Descripción', 'Método', 'Modificado']} />
      {MOVES.map((m, i) => (
        <Row key={m.id} n={i + 2}>
          <C className="text-right">{m.id}</C>
          <C className="text-right">{m.date}</C>
          <C>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                m.type === 'Ingreso' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#c5221f]'
              }`}
            >
              {m.type}
            </span>
          </C>
          <C>{m.cat}</C>
          <C className={`text-right tabular-nums ${m.type === 'Ingreso' ? 'text-[#137333]' : 'text-[#c5221f]'}`}>{fmt(m.amount)}</C>
          <C>{m.desc}</C>
          <C>{m.method}</C>
          <C className="text-right text-[#5f6368]">{m.date} 23:1{i}</C>
        </Row>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <Empty key={i} n={MOVES.length + 2 + i} />
      ))}
    </>
  );
}

function SheetCategorias() {
  const cats = [{ name: 'Bono / Beca', type: 'Ingreso', budget: 0 }, ...PREVIEW.rows.map((r) => ({ name: r.name, type: 'Gasto', budget: r.budget }))];
  const total = PREVIEW.rows.reduce((s, r) => s + r.budget, 0);
  return (
    <>
      <HeaderRow labels={['Categoría', 'Tipo', 'Presupuesto', 'Activa']} color="#b06000" />
      {cats.map((c, i) => (
        <Row key={c.name} n={i + 2}>
          <C>{c.name}</C>
          <C>
            <Dropdown value={c.type} />
          </C>
          <C className="text-right tabular-nums">{c.type === 'Gasto' ? fmt(c.budget) : '—'}</C>
          <C className="text-center">✅</C>
          <C />
          <C />
          <C />
          <C />
        </Row>
      ))}
      <Row n={cats.length + 2}>
        <C className="bg-[#fef7e0] font-bold">Total presupuestado</C>
        <C className="bg-[#fef7e0]" />
        <C className="bg-[#fef7e0] text-right font-bold tabular-nums">{fmt(total)}</C>
        <C className="bg-[#fef7e0]" />
        <C />
        <C colSpan={3} className="italic text-[#5f6368]">
          Sin asignar: {fmt(PREVIEW.income - total)} de {fmt(PREVIEW.income)}
        </C>
      </Row>
      {Array.from({ length: 12 }, (_, i) => (
        <Empty key={i} n={cats.length + 3 + i} />
      ))}
    </>
  );
}

function stateOf(spent: number, budget: number) {
  const pct = budget > 0 ? spent / budget : 0;
  if (pct > 1) return { label: '🔴 Excedido', bg: '#fce8e6', bar: '#d93025', pct };
  if (pct >= 0.8) return { label: '🟡 Cerca del límite', bg: '#fef7e0', bar: '#f9ab00', pct };
  return { label: '🟢 OK', bg: '#e6f4ea', bar: '#34a853', pct };
}

function SheetDashboard() {
  const { income, expenses, rows } = PREVIEW;
  const kpis = [
    { label: 'INGRESOS', value: fmt(income), color: '#137333' },
    { label: 'GASTOS', value: fmt(expenses), color: '#c5221f' },
    { label: 'SALDO', value: fmt(income - expenses), color: '#202124' },
  ];
  return (
    <>
      <Row n={1} tall>
        <C colSpan={8} className="text-[17px] font-bold text-white" style={{ background: '#188038' }}>
          📊 DASHBOARD FINANCIERO · Octubre 2026
        </C>
      </Row>
      <Empty n={2} />
      <Row n={3}>
        {kpis.map((k) => (
          <C key={k.label} colSpan={k.label === 'SALDO' ? 2 : 1} className="bg-[#f3f3f3] text-[11px] font-bold text-[#5f6368]">
            {k.label}
          </C>
        ))}
        <C colSpan={4} className="bg-[#f3f3f3] text-[11px] font-bold text-[#5f6368]">
          ESTADO DEL MES
        </C>
      </Row>
      <Row n={4} tall>
        {kpis.map((k) => (
          <C
            key={k.label}
            colSpan={k.label === 'SALDO' ? 2 : 1}
            className="text-[17px] font-bold tabular-nums"
            style={{ color: k.color, outline: k.label === 'INGRESOS' ? '2px solid #1a73e8' : undefined, outlineOffset: -2 }}
          >
            {k.value}
          </C>
        ))}
        <C colSpan={4} className="bg-[#e6f4ea] font-bold text-[#137333]">
          🟢 BIEN · {Math.round((expenses / income) * 100)}% del ingreso usado
        </C>
      </Row>
      <Empty n={5} />
      <Row n={6}>
        {['Categoría', 'Presupuesto', 'Gastado', 'Disponible', '% usado', 'Progreso', '', 'Estado'].map((h, i) => (
          <C key={i} className="font-bold text-white" style={{ background: NAVY }}>
            {h}
          </C>
        ))}
      </Row>
      {rows.map((r, i) => {
        const st = stateOf(r.spent, r.budget);
        return (
          <Row key={r.name} n={7 + i}>
            <C>{r.name}</C>
            <C className="text-right tabular-nums">{fmt(r.budget)}</C>
            <C className="text-right tabular-nums">{fmt(r.spent)}</C>
            <C className={`text-right tabular-nums ${r.budget - r.spent < 0 ? 'text-[#c5221f]' : ''}`}>{fmt(r.budget - r.spent)}</C>
            <C className="text-right tabular-nums">{Math.round(st.pct * 100)}%</C>
            <C colSpan={2}>
              <span className="block h-2.5 w-full bg-[#e8eaed]">
                <span className="block h-full" style={{ width: `${Math.min(st.pct, 1) * 100}%`, background: st.bar }} />
              </span>
            </C>
            <C style={{ background: st.bg }}>{st.label}</C>
          </Row>
        );
      })}
      {Array.from({ length: 9 }, (_, i) => (
        <Empty key={i} n={7 + rows.length + i} />
      ))}
    </>
  );
}

function SheetHistorial() {
  const months = [
    { m: 'Agosto 2026', inc: 400, exp: 352.8 },
    { m: 'Septiembre 2026', inc: 400, exp: 412.3 },
    { m: 'Octubre 2026', inc: PREVIEW.income, exp: PREVIEW.expenses },
  ];
  const status = (pct: number) =>
    pct > 1
      ? { label: '🔴 MAL', bg: '#fce8e6' }
      : pct >= 0.85
        ? { label: '🟠 RIESGO', bg: '#feefe3' }
        : pct >= 0.7
          ? { label: '🟡 ALERTA', bg: '#fef7e0' }
          : { label: '🟢 BIEN', bg: '#e6f4ea' };
  return (
    <>
      <HeaderRow labels={['Mes', 'Ingresos', 'Gastos', 'Saldo', '% usado', 'Estado', '', '']} color="#7627bb" />
      {months.map((r, i) => {
        const pct = r.exp / r.inc;
        const st = status(pct);
        return (
          <Row key={r.m} n={i + 2}>
            <C>{r.m}</C>
            <C className="text-right tabular-nums text-[#137333]">{fmt(r.inc)}</C>
            <C className="text-right tabular-nums text-[#c5221f]">{fmt(r.exp)}</C>
            <C className={`text-right font-bold tabular-nums ${r.inc - r.exp < 0 ? 'text-[#c5221f]' : ''}`}>{fmt(r.inc - r.exp)}</C>
            <C className="text-right tabular-nums">{Math.round(pct * 100)}%</C>
            <C style={{ background: st.bg }}>{st.label}</C>
            <C />
            <C />
          </Row>
        );
      })}
      <Empty n={5} />
      <Row n={6}>
        <C colSpan={8} className="italic text-[#5f6368]">
          Calculado desde MOVIMIENTOS. Si corriges un gasto viejo, este historial se corrige solo.
        </C>
      </Row>
      {Array.from({ length: 14 }, (_, i) => (
        <Empty key={i} n={7 + i} />
      ))}
    </>
  );
}

const SHEETS: Record<TabId, () => ReactNode> = {
  INICIO: SheetInicio,
  MOVIMIENTOS: SheetMovimientos,
  CATEGORIAS: SheetCategorias,
  DASHBOARD: SheetDashboard,
  HISTORIAL: SheetHistorial,
};

/* ------------------------------------------------------------------ */
/* Ventana de Google Sheets                                            */
/* ------------------------------------------------------------------ */

export function SheetPreview() {
  const [tab, setTab] = useState<TabId>('INICIO');
  const active = TABS.find((t) => t.id === tab)!;
  const Sheet = SHEETS[tab];

  return (
    <figure className="w-full">
      <div
        className="overflow-hidden rounded-xl border border-line bg-white text-[13px] text-[#202124] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.5)]"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* Barra de título y menú */}
        <div className="flex items-center gap-3 bg-[#f9fbfd] px-3 pt-2.5 pb-1.5 sm:px-4">
          <SheetsLogo />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="truncate text-[17px] leading-tight">FINANZAS PERSONALES</span>
              <Star className="hidden size-4 shrink-0 text-[#444746] sm:block" aria-hidden="true" />
            </div>
            <div className="mt-0.5 hidden gap-3.5 text-[13px] text-[#444746] sm:flex">
              {['Archivo', 'Editar', 'Ver', 'Insertar', 'Formato', 'Datos', 'Herramientas', 'Extensiones'].map((m) => (
                <span key={m}>{m}</span>
              ))}
              <span className="font-medium">💰 Mis Finanzas</span>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-[#444746] md:flex">
            <History className="size-5" aria-hidden="true" />
            <MessageSquare className="size-5" aria-hidden="true" />
            <span className="flex items-center gap-1.5 rounded-full bg-[#c2e7ff] px-4 py-2 text-[13px] font-medium text-[#001d35]">
              <UserPlus className="size-4" aria-hidden="true" />
              Compartir
            </span>
          </div>
        </div>

        {/* Barra de fórmulas */}
        <div className="flex items-center border-y border-[#e1e3e1] bg-white text-[13px]">
          <span className="flex w-24 shrink-0 items-center justify-between border-r border-[#e1e3e1] px-3 py-1.5">
            {active.ref}
            <ChevronDown className="size-3.5 text-[#5f6368]" aria-hidden="true" />
          </span>
          <span className="px-3 font-serif italic text-[#5f6368]">fx</span>
          <span className="truncate pr-3">{active.formula}</span>
        </div>

        {/* Cuadrícula */}
        <div className="h-[460px] overflow-auto" tabIndex={0} aria-label={`Hoja ${tab}`} role="region">
          <table className="border-collapse" style={{ tableLayout: 'fixed', width: 40 + COL_WIDTHS.reduce((a, b) => a + b, 0) }}>
            <colgroup>
              <col style={{ width: 40 }} />
              {COL_WIDTHS.map((w, i) => (
                <col key={i} style={{ width: w }} />
              ))}
            </colgroup>
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="sticky left-0 h-6 border border-[#c7c7c7] bg-[#f8f9fa]" aria-hidden="true" />
                {COLS.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className={`h-6 border border-[#c7c7c7] text-[11px] font-normal text-[#5f6368] ${
                      tab === 'INICIO' ? 'bg-[#d3e3fd] font-medium text-[#0b57d0]' : 'bg-[#f8f9fa]'
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Sheet />
            </tbody>
          </table>
        </div>

        {/* Pestañas */}
        <div className="flex items-stretch border-t border-[#e1e3e1] bg-[#f9fbfd]">
          <div className="hidden items-center gap-4 px-4 text-[#444746] sm:flex">
            <Plus className="size-4" aria-hidden="true" />
            <Menu className="size-4" aria-hidden="true" />
          </div>
          <div role="tablist" aria-label="Hojas de la plantilla" className="flex overflow-x-auto">
            {TABS.map((t) => {
              const selected = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(t.id)}
                  className={`relative flex min-h-11 shrink-0 items-center gap-1.5 px-4 text-[13px] font-medium tracking-wide transition-colors ${
                    selected ? 'bg-[#e1e9f7] text-[#0b57d0]' : 'text-[#444746] hover:bg-[#eef0f3]'
                  }`}
                >
                  {t.locked && <Lock className="size-3.5" aria-hidden="true" />}
                  {t.id}
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: t.color }} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center font-mono text-[11px] text-muted">
        Así se ve la hoja en Google Sheets (datos de ejemplo). Cambia de hoja con las pestañas.
      </figcaption>
    </figure>
  );
}

function SheetsLogo() {
  return (
    <svg viewBox="0 0 24 32" className="h-8 w-6 shrink-0" aria-hidden="true">
      <path d="M15 0H2.5A2.5 2.5 0 0 0 0 2.5v27A2.5 2.5 0 0 0 2.5 32h19a2.5 2.5 0 0 0 2.5-2.5V9z" fill="#0f9d58" />
      <path d="M15 0v6.5A2.5 2.5 0 0 0 17.5 9H24z" fill="#87ceac" />
      <path d="M5 13v12h14V13zm2 2h4v2H7zm6 0h4v2h-4zm-6 4h4v2H7zm6 0h4v2h-4zm-6 4h4v0H7z" fill="#f1f1f1" />
    </svg>
  );
}
