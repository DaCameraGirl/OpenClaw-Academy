import { useState } from 'react'
import { SAFETY } from '../data/guidelines.js'

export default function SafetyAnnotation() {
  const [domain, setDomain] = useState(null)
  const [failures, setFailures] = useState(new Set())
  const [tier, setTier] = useState(null)
  const [step, setStep] = useState('')
  const [desc, setDesc] = useState('')
  const [exported, setExported] = useState(null)
  const [activeTab, setActiveTab] = useState('annotator')

  const toggleFailure = (code) => setFailures(prev => {
    const next = new Set(prev)
    next.has(code) ? next.delete(code) : next.add(code)
    return next
  })

  const handleExport = () => {
    setExported(JSON.stringify({
      domain: domain ? `D${domain} — ${SAFETY.domains[domain - 1].title}` : null,
      failure_category: [...failures].join(', ') || null,
      failure_step: step ? parseInt(step) : null,
      failure_description: desc || null,
      action_tier: tier || null,
    }, null, 2))
  }

  const reset = () => {
    setDomain(null); setFailures(new Set()); setTier(null)
    setStep(''); setDesc(''); setExported(null)
  }

  const TABS = [
    { id: 'annotator', label: '📝 Annotator' },
    { id: 'domains', label: '🗂️ 7 Domains' },
    { id: 'failures', label: '⚠️ F1–F8 Categories' },
    { id: 'tiers', label: '🎚️ Action Tiers' },
    { id: 'flow', label: '🔄 Annotation Flow' },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">🛡️ Safety Annotation</h1>
        <p className="text-sm text-slate-500 mt-1">7 domains, F1–F8 failure categories, T0–T3 action tiers, and interactive annotator.</p>
      </div>

      {/* Bidirectional banner */}
      <div className="rounded-2xl border border-amber-900/40 bg-amber-950/15 p-4">
        <div className="text-sm font-semibold text-amber-300 mb-2">⚠️ Safety failure is bidirectional</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {SAFETY.bidirectional.map((b, i) => (
            <div key={i} className="text-xs text-slate-300 flex gap-2">
              <span className="text-amber-500 shrink-0">›</span>{b}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-slate-800 pb-0">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 text-xs font-medium rounded-t-xl transition border-b-2 -mb-px ${
              activeTab === t.id
                ? 'border-cyan-500 text-cyan-300 bg-slate-900/60'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ANNOTATOR */}
      {activeTab === 'annotator' && (
        <div className="space-y-4">
          <div className="text-sm font-semibold text-slate-400">Step 1 — Select Domain</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {SAFETY.domains.map(d => (
              <button
                key={d.id}
                onClick={() => setDomain(d.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  domain === d.id
                    ? 'border-amber-600 bg-amber-950/30 text-amber-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-semibold">{d.title}</div>
                <div className="text-[11px] mt-0.5 opacity-70">{d.desc}</div>
              </button>
            ))}
          </div>

          <div className="text-sm font-semibold text-slate-400">Step 2 — Select Failure Category (multi-select)</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {SAFETY.failures.map(f => (
              <button
                key={f.code}
                onClick={() => toggleFailure(f.code)}
                className={`rounded-xl border p-3 text-left transition ${
                  failures.has(f.code)
                    ? 'border-red-600 bg-red-950/30 text-red-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold text-red-400">{f.code}</div>
                <div className="text-xs font-semibold mt-0.5">{f.name}</div>
                <div className="text-[11px] mt-0.5 opacity-60 leading-4">{f.desc}</div>
              </button>
            ))}
          </div>

          <div className="text-sm font-semibold text-slate-400">Step 3 — Assign Action Tier</div>
          <div className="grid grid-cols-4 gap-2">
            {SAFETY.tiers.map(t => (
              <button
                key={t.t}
                onClick={() => setTier(t.t)}
                className={`rounded-xl border p-3 text-center transition ${
                  tier === t.t
                    ? 'border-cyan-600 bg-cyan-950/30 text-cyan-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-lg font-bold text-cyan-400">{t.t}</div>
                <div className="text-[11px] mt-0.5">{t.label}</div>
              </button>
            ))}
          </div>

          <div className="text-sm font-semibold text-slate-400">Step 4 — Write Annotation</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 uppercase tracking-wide block mb-1">failure_step (turn number)</label>
              <input
                type="number" min="1" value={step}
                onChange={e => setStep(e.target.value)}
                placeholder="e.g. 2"
                className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 uppercase tracking-wide block mb-1">failure_description (1–2 evidence-based sentences)</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="The agent deleted all emails without prompting for confirmation..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleExport} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-sm font-medium text-slate-950 transition">
                Export JSON
              </button>
              <button onClick={reset} className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-sm text-slate-400 transition">
                Reset
              </button>
            </div>
          </div>

          {exported && (
            <pre className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {exported}
            </pre>
          )}
        </div>
      )}

      {/* DOMAINS */}
      {activeTab === 'domains' && (
        <div className="space-y-2">
          {SAFETY.domains.map(d => (
            <div key={d.id} className="rounded-xl border border-amber-900/30 bg-amber-950/15 px-4 py-3">
              <div className="text-sm font-semibold text-amber-300">{d.title}</div>
              <div className="text-xs text-slate-400 mt-1">{d.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* FAILURES */}
      {activeTab === 'failures' && (
        <div className="space-y-2">
          {SAFETY.failures.map(f => (
            <div key={f.code} className="rounded-xl border border-red-900/30 bg-red-950/15 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-400 w-6">{f.code}</span>
                <span className="text-sm font-semibold text-slate-200">{f.name}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 ml-8">{f.desc}</div>
            </div>
          ))}
          <div className="rounded-xl border border-amber-900/30 bg-amber-950/15 px-4 py-3 mt-4">
            <div className="text-xs font-semibold text-amber-400 mb-2">Remember: bidirectional</div>
            <div className="text-xs text-slate-400">F8 (Too Cautious) is a safety failure just like F1–F7. Over-refusal = failure.</div>
          </div>
        </div>
      )}

      {/* TIERS */}
      {activeTab === 'tiers' && (
        <div className="space-y-3">
          {SAFETY.tiers.map(t => (
            <div key={t.t} className="rounded-xl border border-cyan-900/30 bg-cyan-950/15 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-cyan-400 w-10">{t.t}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-200">{t.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{t.desc}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 mt-2">
            <div className="text-xs font-semibold text-slate-400 mb-2">Tiering rule (Part 17)</div>
            {SAFETY.tiering.map((t, i) => (
              <div key={i} className="flex gap-2 text-xs text-slate-400 py-1">
                <span className="text-cyan-500 shrink-0">›</span>{t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLOW */}
      {activeTab === 'flow' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Annotation Flow</div>
            {SAFETY.annotationFlow.map((s, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-slate-800/60 last:border-0">
                <span className="text-xs font-bold text-slate-600 w-4 shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-sm text-slate-300">{s}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Required Annotation Fields</div>
            {SAFETY.annotationFields.map((f, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-slate-800/60 last:border-0">
                <code className="text-xs text-cyan-400 font-mono shrink-0 mt-0.5">{f.field}</code>
                <span className="text-sm text-slate-400">{f.desc}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Safe Behavior Examples</div>
            {SAFETY.safeBehavior.map((s, i) => (
              <div key={i} className="flex gap-2 py-1.5 text-sm text-slate-300">
                <span className="text-emerald-500 shrink-0">✓</span>{s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
