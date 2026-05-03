import { useMemo, useState } from 'react'
import { ATOMIC_SECTIONS } from '../data/atomicRules.js'
import { NARRATIVE_PARTS } from '../data/narrativeParts.js'

/* ── helpers ─────────────────────────────────────────── */
function parseRuleNum(value) {
  return String(value).split('.').map((n) => Number.parseInt(n, 10))
}
function compareRuleNums(a, b) {
  const pa = parseRuleNum(a)
  const pb = parseRuleNum(b)
  const max = Math.max(pa.length, pb.length)
  for (let i = 0; i < max; i += 1) {
    const va = pa[i] ?? -1
    const vb = pb[i] ?? -1
    if (va !== vb) return va - vb
  }
  return 0
}

/* ── bold markdown renderer ──────────────────────────── */
function RichText({ text, className }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="text-cyan-300 font-semibold">{part}</strong>
          : part
      )}
    </span>
  )
}

/* ── atomic view sub-components ─────────────────────── */
function RuleRow({ rule }) {
  return (
    <div className="flex gap-3 py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-[11px] text-slate-500 font-mono mt-0.5 min-w-[56px] shrink-0">{rule.num}</span>
      <RichText text={rule.text} className="text-sm text-slate-300 leading-relaxed" />
    </div>
  )
}

/* ── narrative view sub-components ──────────────────── */
function NarrativeTable({ rows }) {
  return (
    <div className="overflow-x-auto mt-2 mb-1">
      <table className="w-full text-xs border-collapse">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-slate-950/40' : 'bg-transparent'}>
              <td className="py-1.5 px-3 text-cyan-300 font-medium border border-slate-800 align-top whitespace-nowrap">{row.col1}</td>
              <td className="py-1.5 px-3 text-slate-300 border border-slate-800">{row.col2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NarrativeSection({ section }) {
  return (
    <div className="mt-4 first:mt-0">
      <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">{section.heading}</div>
      {section.table ? (
        <NarrativeTable rows={section.table} />
      ) : (
        <ul className="space-y-1.5 ml-1">
          {section.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300 leading-relaxed">
              <span className="text-slate-600 mt-1 shrink-0">›</span>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NarrativeCard({ part, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <span className="text-lg shrink-0">{part.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-200">{part.title}</div>
          <div className="text-xs text-slate-500 mt-0.5">{part.sections.length} section{part.sections.length !== 1 ? 's' : ''}</div>
        </div>
        <span className={`text-slate-500 text-xs transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-800/60 pt-4 space-y-4 divide-y divide-slate-800/40">
          {part.sections.map((s, i) => (
            <NarrativeSection key={i} section={s} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── atomic view ─────────────────────────────────────── */
function AtomicView() {
  const [search, setSearch] = useState('')
  const [expandAll, setExpandAll] = useState(false)
  const [strictOrder, setStrictOrder] = useState(true)
  const [openMap, setOpenMap] = useState({})

  const sections = useMemo(() => {
    const mapped = ATOMIC_SECTIONS.map((s, idx) => ({
      id: `s-${idx}`,
      title: s.title,
      rules: [...s.rules].sort((a, b) => compareRuleNums(a.num, b.num)),
    }))
    if (!strictOrder) return mapped
    return mapped.sort((a, b) => compareRuleNums(a.rules[0]?.num ?? '9999', b.rules[0]?.num ?? '9999'))
  }, [strictOrder])

  const filtered = useMemo(() => {
    if (!search.trim()) return sections
    const q = search.toLowerCase()
    return sections
      .map((s) => ({
        ...s,
        rules: s.rules.filter((r) => r.num.includes(q) || r.text.toLowerCase().includes(q)),
      }))
      .filter((s) => s.rules.length > 0 || s.title.toLowerCase().includes(q))
  }, [search, sections])

  const totalRules = useMemo(() => sections.reduce((sum, s) => sum + s.rules.length, 0), [sections])

  return (
    <>
      <p className="text-sm text-slate-500">
        Section 2 atomic breakdown — {totalRules} individual rules across 113 sections.
      </p>
      <div className="flex gap-3 items-center mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rules, rule numbers, topics..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-600"
        />
        <button
          onClick={() => setExpandAll((v) => !v)}
          className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition shrink-0"
        >
          {expandAll ? 'Collapse all' : 'Expand all'}
        </button>
        <button
          onClick={() => setStrictOrder((v) => !v)}
          className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition shrink-0"
        >
          {strictOrder ? 'Strict numeric: ON' : 'Strict numeric: OFF'}
        </button>
      </div>
      <div className="space-y-3 mt-4">
        {filtered.map((section) => {
          const isOpen = expandAll || search.trim().length > 0 || openMap[section.id]
          return (
            <div key={section.id} className="rounded-2xl border border-slate-800 bg-slate-900/60">
              <button
                onClick={() => setOpenMap((prev) => ({ ...prev, [section.id]: !prev[section.id] }))}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-200">{section.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{section.rules[0]?.num} – {section.rules[section.rules.length - 1]?.num}</div>
                </div>
                <span className={`text-slate-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-800/60 pt-4">
                  {section.rules.map((rule) => (
                    <RuleRow key={`${section.id}-${rule.num}`} rule={rule} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── narrative view ──────────────────────────────────── */
function NarrativeView() {
  const [search, setSearch] = useState('')
  const [expandAll, setExpandAll] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) return NARRATIVE_PARTS
    const q = search.toLowerCase()
    return NARRATIVE_PARTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sections.some(
          (s) =>
            s.heading.toLowerCase().includes(q) ||
            (s.items || []).some((item) => item.toLowerCase().includes(q)) ||
            (s.table || []).some((row) => row.col1.toLowerCase().includes(q) || row.col2.toLowerCase().includes(q))
        )
    )
  }, [search])

  return (
    <>
      <p className="text-sm text-slate-500">
        Section 1 full reference — Parts 1–21 with complete descriptions, tables, and examples.
      </p>
      <div className="flex gap-3 items-center mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search parts, topics, rules..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-600"
        />
        <button
          onClick={() => setExpandAll((v) => !v)}
          className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition shrink-0"
        >
          {expandAll ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <div className="space-y-3 mt-4">
        {filtered.map((part) => (
          <NarrativeCard key={part.id} part={part} defaultOpen={expandAll || search.trim().length > 0} />
        ))}
      </div>
    </>
  )
}

/* ── main component ──────────────────────────────────── */
export default function Guidelines() {
  const [view, setView] = useState('narrative')

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Full Guidelines</h1>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('narrative')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            view === 'narrative'
              ? 'bg-cyan-600 text-slate-950'
              : 'border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
          }`}
        >
          📋 Quick Reference (Parts 1–21)
        </button>
        <button
          onClick={() => setView('atomic')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            view === 'atomic'
              ? 'bg-cyan-600 text-slate-950'
              : 'border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
          }`}
        >
          ⚛️ Atomic Rules (1–113)
        </button>
      </div>

      {view === 'narrative' ? <NarrativeView /> : <AtomicView />}
    </div>
  )
}
