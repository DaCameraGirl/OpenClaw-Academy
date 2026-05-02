import { useMemo, useState } from 'react'
import { ATOMIC_SECTIONS } from '../data/atomicRules.js'

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

function RuleRow({ rule }) {
  return (
    <div className="flex gap-3 py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-[11px] text-slate-500 font-mono mt-0.5 min-w-[56px] shrink-0">{rule.num}</span>
      <span className="text-sm text-slate-300 leading-relaxed">{rule.text}</span>
    </div>
  )
}

export default function Guidelines() {
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
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Full Guidelines</h1>
        <p className="text-sm text-slate-500 mt-1">
          Atomic rules source: Section 2. Loaded rules: {totalRules}. Roots: 1 through 113.
        </p>
      </div>

      <div className="flex gap-3 items-center">
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

      <div className="space-y-3">
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
                  <div className="text-xs text-slate-500 mt-0.5">{section.rules[0]?.num} - {section.rules[section.rules.length - 1]?.num}</div>
                </div>
                <span className={`text-slate-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-800/60 pt-4">
                  {section.rules.map((rule) => (
                    <RuleRow key={`${section.id}-${rule.num}-${rule.text}`} rule={rule} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
