import { useState } from 'react'

const ALLOWED_WEIGHTS = new Set(['+5', '+3', '+1', '-1', '-3', '-5'])
const NEGATIVE_PHRASING = ['does not', 'did not', 'should not', 'must not', 'cannot', 'will not']
const FORBIDDEN_ADJECTIVES = ['correctly', 'properly', 'accurately', 'successfully', 'appropriately', 'effectively', 'good', 'well', 'appropriate', 'reasonable', 'optimal', 'efficiently']
const SUBJECTIVE_WORDS = ['feels', 'natural', 'good', 'nice', 'great', 'appropriate', 'reasonable', 'optimal', 'efficient', 'quality', 'clear', 'well-written', 'professional', 'coherent', 'logical']

function analyzeRubric(text, weight, category) {
  const issues = []
  const warnings = []
  const t = text.toLowerCase()

  // Weight check
  if (weight && !ALLOWED_WEIGHTS.has(weight)) {
    issues.push({ severity: 'error', code: 'BAD_WEIGHT', msg: `Weight "${weight}" is not in the allowed set. Use only: -5, -3, -1, +1, +3, +5.` })
  }

  // Negative phrasing
  const negPhrase = NEGATIVE_PHRASING.find(p => t.includes(p))
  if (negPhrase) {
    issues.push({ severity: 'error', code: 'NEGATIVE_PHRASING', msg: `Contains forbidden negative phrasing: "${negPhrase}". Rewrite to describe what CAN be observed.` })
  }

  // Forbidden adjectives
  const badAdj = FORBIDDEN_ADJECTIVES.find(a => t.includes(a))
  if (badAdj) {
    issues.push({ severity: 'error', code: 'FORBIDDEN_ADJECTIVE', msg: `Contains forbidden adjective: "${badAdj}". Describe the observable behavior, not how well it was done.` })
  }

  // Subjective words
  const subjWord = SUBJECTIVE_WORDS.find(s => t.includes(s))
  if (subjWord && !FORBIDDEN_ADJECTIVES.includes(subjWord)) {
    warnings.push({ severity: 'warning', code: 'SUBJECTIVE', msg: `May be subjective: contains "${subjWord}". Ensure the criterion is measurable without personal opinion.` })
  }

  // Check for prompt reference
  if (t.includes('mentioned in the prompt') || t.includes('as stated in') || t.includes('from the prompt') || t.includes('in the prompt')) {
    issues.push({ severity: 'error', code: 'NOT_SELF_CONTAINED', msg: 'References the prompt — criterion must be evaluable from the model response alone. Bake the specific detail into the criterion text.' })
  }

  // Check for multiple conjunctions (might not be atomic)
  const andCount = (t.match(/ and /g) || []).length
  if (andCount >= 2) {
    warnings.push({ severity: 'warning', code: 'POSSIBLE_BUNDLING', msg: `Contains ${andCount} "and" conjunctions — verify this is atomic (tests one thing only). If multiple behaviors are bundled, split them.` })
  }

  // Check for vague "the agent" without specific behavior
  if (t.startsWith('the agent ') && text.trim().split(' ').length < 6) {
    warnings.push({ severity: 'warning', code: 'TOO_VAGUE', msg: 'Criterion may be too vague. Specify exactly what the agent must produce or do.' })
  }

  // Weight / importance mismatch hints
  if (weight === '+1' && (t.includes('creates') || t.includes('produces') || t.includes('outputs') || t.includes('generates')) && !t.includes('exact') && !t.includes('filename') && !t.includes('specific')) {
    warnings.push({ severity: 'warning', code: 'POSSIBLE_UNDERWEIGHT', msg: 'Creating/producing the main artifact is usually +5 or +3. Consider whether +1 is too low.' })
  }

  if (weight === '+5' && (t.includes('exact filename') || t.includes('named specifically'))) {
    warnings.push({ severity: 'warning', code: 'POSSIBLE_OVERWEIGHT', msg: 'Exact filename or naming conventions are usually minor (+1 or +3). Consider whether +5 is too high.' })
  }

  return { issues, warnings, clean: issues.length === 0 && warnings.length === 0 }
}

const EXAMPLES = [
  { text: 'The model does not include duplicate wine bottles in the final report.', weight: '-3', category: 'Negative Criterion' },
  { text: 'The response addresses the bug mentioned in the prompt.', weight: '+3', category: 'Task Completion' },
  { text: 'The agent correctly processes the input data.', weight: '+5', category: 'Task Completion' },
  { text: 'The final report has good formatting and is well-written.', weight: '+3', category: 'Instruction Following' },
  { text: 'The agent includes columns named "name," "email," and "phone" in the output CSV.', weight: '+5', category: 'Instruction Following' },
  { text: 'The agent creates a file named clean_contacts.csv in the workspace.', weight: '+5', category: 'Task Completion' },
]

export default function RubricDoctor() {
  const [text, setText] = useState('')
  const [weight, setWeight] = useState('+3')
  const [category, setCategory] = useState('Task Completion')
  const [result, setResult] = useState(null)
  const [bulk, setBulk] = useState('')
  const [bulkResults, setBulkResults] = useState([])
  const [tab, setTab] = useState('single')

  const analyze = () => setResult(analyzeRubric(text, weight, category))

  const loadExample = (ex) => {
    setText(ex.text)
    setWeight(ex.weight)
    setCategory(ex.category)
    setResult(null)
  }

  const analyzeBulk = () => {
    const lines = bulk.split('\n').map(l => l.trim()).filter(Boolean)
    setBulkResults(lines.map(line => {
      // Try to parse "text (weight)" format
      const match = line.match(/^(.+?)\s*\(([+-]\d)\)?\s*$/)
      const t = match ? match[1].trim() : line
      const w = match ? match[2] : null
      return { text: t, weight: w, ...analyzeRubric(t, w, null) }
    }))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">🧪 Rubric Doctor</h1>
        <p className="text-sm text-slate-500 mt-1">Paste a criterion and get instant diagnosis: phrasing, atomicity, self-containment, objectivity, and weight.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800 pb-0">
        {['single', 'bulk'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-t-xl transition border-b-2 -mb-px capitalize ${tab === t ? 'border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t === 'single' ? 'Single Criterion' : 'Bulk Analyze'}
          </button>
        ))}
      </div>

      {tab === 'single' && (
        <div className="space-y-4">
          {/* Example picker */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Try an example</div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => loadExample(ex)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition"
                >
                  Example {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">Criterion text</label>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setResult(null) }}
                placeholder='e.g. "The agent creates a file named clean_contacts.csv in the workspace."'
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">Weight</label>
                <select
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600"
                >
                  {['+5','+3','+1','-1','-3','-5','+2','+4','-2','-4','0'].map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600"
                >
                  {['Task Completion','Instruction Following','Factuality & Hallucination','Tool Use','Agent Behavior','Negative Criterion'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={analyze}
              disabled={!text.trim()}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-slate-950 transition"
            >
              Analyze Criterion
            </button>
          </div>

          {result && (
            <div className="space-y-3">
              {result.clean && (
                <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-300">
                  ✓ No issues detected — criterion looks valid.
                </div>
              )}
              {result.issues.map((issue, i) => (
                <div key={i} className="rounded-xl border border-red-800/60 bg-red-950/20 px-4 py-3">
                  <div className="text-xs font-bold text-red-400 mb-1">🚫 {issue.code.replace(/_/g, ' ')}</div>
                  <p className="text-sm text-slate-300">{issue.msg}</p>
                </div>
              ))}
              {result.warnings.map((warn, i) => (
                <div key={i} className="rounded-xl border border-amber-800/60 bg-amber-950/20 px-4 py-3">
                  <div className="text-xs font-bold text-amber-400 mb-1">⚠️ {warn.code.replace(/_/g, ' ')}</div>
                  <p className="text-sm text-slate-300">{warn.msg}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'bulk' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">
                One criterion per line. Optionally add weight like: <code className="text-cyan-400">criterion text (+5)</code>
              </label>
              <textarea
                value={bulk}
                onChange={e => setBulk(e.target.value)}
                placeholder={"The model does not include duplicates. (+3)\nThe agent correctly processes the data. (+5)\nThe file clean_contacts.csv is created. (+5)"}
                rows={8}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none font-mono"
              />
            </div>
            <button
              onClick={analyzeBulk}
              disabled={!bulk.trim()}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-slate-950 transition"
            >
              Analyze All
            </button>
          </div>

          {bulkResults.length > 0 && (
            <div className="space-y-3">
              {/* Summary */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex gap-4 text-sm">
                <span className="text-emerald-400">{bulkResults.filter(r => r.clean).length} clean</span>
                <span className="text-red-400">{bulkResults.filter(r => r.issues.length > 0).length} with errors</span>
                <span className="text-amber-400">{bulkResults.filter(r => r.warnings.length > 0 && r.issues.length === 0).length} with warnings</span>
                {!bulkResults.some(r => r.issues.some(i => i.code === 'BAD_WEIGHT') || r.weight?.startsWith('-')) && (
                  <span className="text-red-400 font-semibold">⚠️ No negative-weight criterion detected</span>
                )}
              </div>
              {bulkResults.map((r, i) => (
                <div key={i} className={`rounded-xl border px-4 py-3 ${
                  r.issues.length > 0 ? 'border-red-800/60 bg-red-950/10'
                  : r.warnings.length > 0 ? 'border-amber-800/60 bg-amber-950/10'
                  : 'border-emerald-800/40 bg-emerald-950/10'
                }`}>
                  <div className="flex items-start gap-2">
                    <span className={r.issues.length > 0 ? 'text-red-400' : r.warnings.length > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                      {r.issues.length > 0 ? '✕' : r.warnings.length > 0 ? '⚠' : '✓'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400 mb-1 truncate">"{r.text}"</div>
                      {r.issues.map((issue, j) => (
                        <div key={j} className="text-xs text-red-300 mb-0.5">{issue.msg}</div>
                      ))}
                      {r.warnings.map((warn, j) => (
                        <div key={j} className="text-xs text-amber-300 mb-0.5">{warn.msg}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
