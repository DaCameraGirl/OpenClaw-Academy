import { useState } from 'react'
import { UNIT_TEST_RULES } from '../data/guidelines.js'

export default function UnitTestRules() {
  const [open, setOpen] = useState(new Set(['decision', 'overfitting', 'selfcheck']))

  const toggle = (id) => setOpen(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">✅ Unit Test Rules</h1>
        <p className="text-sm text-slate-500 mt-1">When to use unit tests vs rubrics — and how to avoid overfitting.</p>
      </div>

      {/* Core principle banner */}
      <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-4">
        <div className="text-sm font-semibold text-cyan-300 mb-1">The core rule</div>
        <p className="text-sm text-slate-300">
          Use a <strong className="text-cyan-300">unit test</strong> only when there is exactly one correct answer fixed by the prompt + input data.
          Use a <strong className="text-emerald-300">rubric</strong> when any flexibility exists in how the correct answer can be expressed.
          <strong className="text-red-300"> A bad unit test is worse than no unit test.</strong>
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <div className="rounded-xl border border-cyan-900/30 bg-cyan-950/30 px-3 py-2 text-center">
            <div className="font-bold text-cyan-400">Zero freedom</div>
            <div className="text-slate-500">→ Unit test</div>
          </div>
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/30 px-3 py-2 text-center">
            <div className="font-bold text-emerald-400">Any flexibility</div>
            <div className="text-slate-500">→ Rubric</div>
          </div>
          <div className="rounded-xl border border-amber-900/30 bg-amber-950/30 px-3 py-2 text-center">
            <div className="font-bold text-amber-400">Mixed</div>
            <div className="text-slate-500">→ Both</div>
          </div>
        </div>
      </div>

      {UNIT_TEST_RULES.map(section => (
        <div key={section.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-600 transition">
          <button
            onClick={() => toggle(section.id)}
            className="w-full flex items-center gap-3 px-5 py-4 text-left"
          >
            <span className="text-xl">{section.icon}</span>
            <span className="flex-1 text-sm font-semibold text-slate-200">{section.title}</span>
            <span className={`text-slate-500 text-xs transition-transform duration-200 ${open.has(section.id) ? 'rotate-90' : ''}`}>▶</span>
          </button>

          {open.has(section.id) && (
            <div className="px-5 pb-5 border-t border-slate-800/60 pt-4 space-y-4">
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

              {/* Decision table */}
              {section.table && section.id === 'decision' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 pr-4 text-slate-500 font-semibold">Situation</th>
                        <th className="text-left py-2 text-slate-500 font-semibold">Approach</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.map((row, i) => (
                        <tr key={i} className="border-b border-slate-800/60 last:border-0">
                          <td className="py-2 pr-4 text-slate-400 align-top">{row.situation}</td>
                          <td className="py-2 text-cyan-300 align-top font-medium">{row.approach}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Overfitting examples table */}
              {section.table && section.id === 'overfitting' && (
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Overfitting examples</div>
                  {section.table.map((row, i) => (
                    <div key={i} className={`rounded-xl border px-3 py-2.5 ${
                      row.verdict.startsWith('✅') ? 'border-emerald-900/30 bg-emerald-950/15' : 'border-red-900/30 bg-red-950/15'
                    }`}>
                      <div className="text-[11px] text-slate-500 mb-1">Prompt: <span className="text-slate-400 italic">"{row.prompt}"</span></div>
                      <div className="text-xs font-mono text-slate-400 mb-1">{row.assertion}</div>
                      <div className={`text-xs font-semibold ${row.verdict.startsWith('✅') ? 'text-emerald-400' : 'text-red-400'}`}>{row.verdict}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mistakes table */}
              {section.mistakes && (
                <div className="space-y-3">
                  {section.mistakes.map((m, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      <div className="text-xs font-semibold text-slate-400 mb-2">{m.mistake}</div>
                      <div className="space-y-1">
                        <div className="flex gap-2 items-start">
                          <span className="text-red-400 text-[11px] font-bold shrink-0">✕</span>
                          <code className="text-[11px] text-red-300/80 font-mono">{m.wrong}</code>
                        </div>
                        <div className="flex gap-2 items-start">
                          <span className="text-emerald-400 text-[11px] font-bold shrink-0">✓</span>
                          <code className="text-[11px] text-emerald-300/80 font-mono">{m.right}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
