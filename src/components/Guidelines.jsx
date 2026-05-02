import { useState, useMemo } from 'react'
import { SECTIONS } from '../data/guidelines.js'

function parseRuleNum(value) {
  const match = String(value).match(/\d+(?:\.\d+)*/)
  if (!match) return [9999]
  return match[0].split('.').map(n => Number.parseInt(n, 10))
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
  return String(a).localeCompare(String(b))
}

function minRuleNum(section) {
  const nums = section.groups.flatMap(g => g.rules.map(r => r.num))
  return nums.sort(compareRuleNums)[0] ?? '9999'
}

function RuleItem({ rule }) {
  return (
    <div className="flex gap-3 py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-[11px] text-slate-600 font-mono mt-0.5 min-w-[36px] shrink-0">{rule.num}</span>
      <span className="text-sm text-slate-300 leading-relaxed">{rule.text}</span>
    </div>
  )
}

function SectionCard({ section, forceOpen }) {
  const [open, setOpen] = useState(false)
  const isOpen = forceOpen || open

  const colorMap = {
    cyan: 'border-cyan-900/40 hover:border-cyan-700/60',
    violet: 'border-violet-900/40 hover:border-violet-700/60',
    blue: 'border-blue-900/40 hover:border-blue-700/60',
    green: 'border-green-900/40 hover:border-green-700/60',
    amber: 'border-amber-900/40 hover:border-amber-700/60',
    purple: 'border-purple-900/40 hover:border-purple-700/60',
    pink: 'border-pink-900/40 hover:border-pink-700/60',
    teal: 'border-teal-900/40 hover:border-teal-700/60',
    sky: 'border-sky-900/40 hover:border-sky-700/60',
    red: 'border-red-900/40 hover:border-red-700/60',
    orange: 'border-orange-900/40 hover:border-orange-700/60',
    emerald: 'border-emerald-900/40 hover:border-emerald-700/60',
    slate: 'border-slate-700/40 hover:border-slate-500/60',
    yellow: 'border-yellow-900/40 hover:border-yellow-700/60',
  }

  return (
    <div className={`rounded-2xl border bg-slate-900/60 transition-all ${colorMap[section.color] || 'border-slate-800 hover:border-slate-600'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <span className="text-xl">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-200">{section.title}</div>
        </div>
        <span className="text-[10px] text-slate-600 bg-slate-800/60 px-2 py-1 rounded-full shrink-0">{section.tag}</span>
        <span className={`text-slate-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-5 border-t border-slate-800/60 pt-4">
          {section.groups.map((group, gi) => (
            <div key={gi}>
              {group.title && (
                <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">{group.title}</div>
              )}
              <div>
                {group.rules.map((rule, ri) => (
                  <RuleItem key={ri} rule={rule} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Guidelines() {
  const [search, setSearch] = useState('')
  const [expandAll, setExpandAll] = useState(false)
  const [strictOrder, setStrictOrder] = useState(true)

  const normalizedSections = useMemo(() => {
    const mapped = SECTIONS.map(section => ({
      ...section,
      groups: section.groups.map(group => ({
        ...group,
        rules: [...group.rules].sort((a, b) => compareRuleNums(a.num, b.num)),
      })),
    }))

    if (!strictOrder) return mapped
    return [...mapped].sort((a, b) => compareRuleNums(minRuleNum(a), minRuleNum(b)))
  }, [strictOrder])

  const filtered = useMemo(() => {
    if (!search.trim()) return normalizedSections
    const q = search.toLowerCase()
    return normalizedSections.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.groups.some(g =>
        g.rules.some(r => r.text.toLowerCase().includes(q) || r.num.includes(q))
      )
    )
  }, [normalizedSections, search])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">📘 Full Guidelines</h1>
        <p className="text-sm text-slate-500 mt-1">All 21 parts — searchable and expandable. Click any section to read every rule.</p>
      </div>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search rules, rule numbers, topics..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-600"
        />
        <button
          onClick={() => setExpandAll(e => !e)}
          className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition shrink-0"
        >
          {expandAll ? 'Collapse all' : 'Expand all'}
        </button>
        <button
          onClick={() => setStrictOrder(v => !v)}
          className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition shrink-0"
        >
          {strictOrder ? 'Strict numeric: ON' : 'Strict numeric: OFF'}
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="text-slate-500 text-sm py-8 text-center">No sections match "{search}"</div>
      )}

      <div className="space-y-3">
        {filtered.map(section => (
          <SectionCard key={section.id} section={section} forceOpen={expandAll || search.length > 0} />
        ))}
      </div>
    </div>
  )
}
