import { useState } from 'react'
import { RUBRIC_RULES } from '../data/guidelines.js'

function WeightPill({ w }) {
  const isNeg = w.startsWith('-')
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
      isNeg ? 'bg-red-950/60 text-red-400 border border-red-900/40' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40'
    }`}>{w}</span>
  )
}

export default function RubricRules() {
  const [open, setOpen] = useState(new Set(['positive-phrasing', 'weights']))

  const toggle = (id) => {
    setOpen(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const colorMap = {
    red: 'border-red-900/40 hover:border-red-700',
    violet: 'border-violet-900/40 hover:border-violet-700',
    blue: 'border-blue-900/40 hover:border-blue-700',
    green: 'border-green-900/40 hover:border-green-700',
    amber: 'border-amber-900/40 hover:border-amber-700',
    cyan: 'border-cyan-900/40 hover:border-cyan-700',
    emerald: 'border-emerald-900/40 hover:border-emerald-700',
    pink: 'border-pink-900/40 hover:border-pink-700',
    teal: 'border-teal-900/40 hover:border-teal-700',
    rose: 'border-rose-900/40 hover:border-rose-700',
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">⚖️ Rubric Rules</h1>
        <p className="text-sm text-slate-500 mt-1">Every property a valid OpenClaw rubric criterion must satisfy.</p>
      </div>

      {/* Quick summary bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[
          ['Atomic', 'One thing only'],
          ['Self-contained', 'No prompt reference needed'],
          ['Objective', 'Measurable, not opinion'],
          ['Positive phrasing', 'No "does not" language'],
          ['Fixed weights only', '-5 -3 -1 +1 +3 +5'],
          ['≥1 negative required', 'Else whole task fails'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
            <div className="text-xs font-semibold text-cyan-400">{k}</div>
            <div className="text-xs text-slate-500 mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      {RUBRIC_RULES.map(section => (
        <div
          key={section.id}
          className={`rounded-2xl border bg-slate-900/60 transition-all ${colorMap[section.color] || 'border-slate-800'}`}
        >
          <button
            onClick={() => toggle(section.id)}
            className="w-full flex items-center gap-3 px-5 py-4 text-left"
          >
            <span className="text-xl">{section.icon}</span>
            <span className="flex-1 text-sm font-semibold text-slate-200">{section.title}</span>
            <span className={`text-slate-500 text-xs transition-transform duration-200 ${open.has(section.id) ? 'rotate-90' : ''}`}>▶</span>
          </button>

          {open.has(section.id) && (
            <div className="px-5 pb-5 border-t border-slate-800/60 pt-4 space-y-5">
              {/* Rules */}
              {section.rules && (
                <div className="space-y-2">
                  {section.rules.map((r, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-[11px] font-mono text-slate-600 mt-0.5 shrink-0 min-w-[40px]">{r.num}</span>
                      <span className="text-slate-300 leading-relaxed">{r.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Good/Bad examples */}
              {section.examples && (
                <div className="space-y-3">
                  <div className="text-[11px] uppercase tracking-widest text-slate-600">Examples</div>
                  {section.examples.map((ex, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex gap-2 items-start rounded-xl border border-red-900/30 bg-red-950/20 px-3 py-2">
                        <span className="text-red-400 text-xs font-bold shrink-0 mt-0.5">✕ BAD</span>
                        <span className="text-xs text-slate-400">{ex.bad}</span>
                      </div>
                      <div className="flex gap-2 items-start rounded-xl border border-emerald-900/30 bg-emerald-950/20 px-3 py-2">
                        <span className="text-emerald-400 text-xs font-bold shrink-0 mt-0.5">✓ GOOD</span>
                        <span className="text-xs text-slate-300">{ex.good}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Categories */}
              {section.categories && (
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Category order</div>
                  <div className="space-y-1">
                    {section.categories.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                        <span className="text-xs font-bold text-slate-600 w-4">{i + 1}</span>
                        <span className="text-xs font-semibold text-slate-300">{c.name}</span>
                        <span className="text-xs text-slate-500">— {c.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weight table */}
              {section.weights && (
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Weight reference</div>
                  <div className="space-y-1.5">
                    {section.weights.map((w, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                        <WeightPill w={w.w} />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-300">{w.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{w.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error patterns */}
              {section.errors && (
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Invalid rubric patterns</div>
                  <div className="space-y-2">
                    {section.errors.map((e, i) => (
                      <div key={i} className="rounded-xl border border-rose-900/30 bg-rose-950/20 px-3 py-2.5">
                        <div className="text-xs font-bold text-rose-400 mb-1">{e.type}</div>
                        <div className="text-xs text-slate-400 mb-1">{e.def}</div>
                        <div className="text-xs text-slate-500 italic">"{e.example}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing criteria errors */}
              {section.missingErrors && (
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Missing criteria errors</div>
                  <div className="space-y-2">
                    {section.missingErrors.map((e, i) => (
                      <div key={i} className={`rounded-xl border px-3 py-2.5 ${
                        e.severity === 'Major' ? 'border-red-900/40 bg-red-950/20' : 'border-amber-900/40 bg-amber-950/20'
                      }`}>
                        <span className={`text-xs font-bold ${e.severity === 'Major' ? 'text-red-400' : 'text-amber-400'}`}>
                          {e.severity}:
                        </span>
                        <span className="text-xs text-slate-300 ml-2">{e.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
