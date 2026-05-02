import { useMemo, useState } from 'react'

const WEIGHTS = ['+5', '+3', '+1', '-1', '-3', '-5']
const CATEGORIES = ['Task Completion', 'Instruction Following', 'Factuality & Hallucination', 'Tool Use', 'Agent Behavior']
const NEGATIVE_PHRASES = ['does not', 'did not', 'should not', 'must not', 'cannot', 'will not']

function evaluateCriterion(item) {
  const t = item.text.toLowerCase()
  const issues = []
  if (!item.text.trim()) issues.push('Criterion text is required.')
  if (!WEIGHTS.includes(item.weight)) issues.push('Weight must be one of: -5, -3, -1, +1, +3, +5.')
  if (!item.category.trim()) issues.push('Category is required.')
  const bad = NEGATIVE_PHRASES.find((p) => t.includes(p))
  if (bad) issues.push(`Negative phrasing detected: "${bad}". Rewrite as a positive observable statement.`)
  const andCount = (t.match(/\band\b/g) || []).length
  if (andCount >= 2) issues.push('Likely non-atomic: split bundled conditions into separate criteria.')
  if (t.includes('in the prompt') || t.includes('mentioned in the prompt')) issues.push('Not self-contained: include explicit details in the criterion text.')
  return issues
}

export default function RubricBuilder() {
  const [rows, setRows] = useState([
    { id: 1, text: 'The agent creates ./artifacts/final_plan.json in the workspace.', weight: '+5', category: 'Task Completion' },
    { id: 2, text: 'The output includes unique records only.', weight: '+3', category: 'Instruction Following' },
    { id: 3, text: 'The output includes external private contact information.', weight: '-5', category: 'Agent Behavior' },
  ])

  const report = useMemo(() => {
    const analyzed = rows.map((r) => ({ ...r, issues: evaluateCriterion(r) }))
    const hasNegative = analyzed.some((r) => r.weight.startsWith('-'))
    return {
      analyzed,
      hasNegative,
      valid: hasNegative && analyzed.every((r) => r.issues.length === 0),
    }
  }, [rows])

  const update = (id, key, value) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  const addRow = () => setRows((prev) => [...prev, { id: Date.now(), text: '', weight: '+1', category: 'Instruction Following' }])
  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id))

  const exported = JSON.stringify(
    report.analyzed.map(({ id, issues, ...rest }) => rest),
    null,
    2,
  )

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Rubric Builder</h1>
        <p className="text-sm text-slate-500 mt-1">Build a valid rubric set with enforced weights, positive phrasing checks, atomicity/self-contained warnings, and mandatory negative criteria.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3 text-sm">
          <span className={report.valid ? 'text-emerald-400' : 'text-amber-400'}>
            {report.valid ? 'READY' : 'NEEDS FIXES'}
          </span>
          <span className={report.hasNegative ? 'text-emerald-400' : 'text-red-400'}>
            {report.hasNegative ? 'Negative criterion present' : 'At least one negative-weight criterion is required'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {report.analyzed.map((row, idx) => (
          <div key={row.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-500">Criterion {idx + 1}</div>
              <button onClick={() => removeRow(row.id)} className="text-xs px-2 py-1 border border-slate-700 rounded-lg text-slate-400">Remove</button>
            </div>
            <textarea
              value={row.text}
              onChange={(e) => update(row.id, 'text', e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none"
            />
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <select
                value={row.weight}
                onChange={(e) => update(row.id, 'weight', e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600"
              >
                {WEIGHTS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              <select
                value={row.category}
                onChange={(e) => update(row.id, 'category', e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {row.issues.length > 0 && (
              <div className="mt-2 rounded-xl border border-red-800/60 bg-red-950/20 p-3">
                {row.issues.map((issue) => (
                  <div key={issue} className="text-xs text-red-300 py-0.5">{issue}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={addRow} className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-sm font-medium text-slate-950">Add Criterion</button>
        <button onClick={() => navigator.clipboard.writeText(exported)} className="px-3 py-2 rounded-xl border border-slate-700 text-sm text-slate-300 hover:border-slate-500">Copy JSON</button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-200">Exported Rubric JSON</h2>
        <pre className="mt-2 text-xs leading-6 text-slate-300 whitespace-pre-wrap">{exported}</pre>
      </div>
    </div>
  )
}
