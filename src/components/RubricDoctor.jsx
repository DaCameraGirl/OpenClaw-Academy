import { useState } from 'react'

const ALLOWED_WEIGHTS = new Set(['+5', '+3', '+1', '-1', '-3', '-5'])
const NEGATIVE_PHRASING = ['does not', 'did not', 'should not', 'must not', 'cannot', 'will not']
const FORBIDDEN_ADJECTIVES = ['correctly', 'properly', 'accurately', 'successfully', 'appropriately', 'effectively', 'good', 'well', 'appropriate', 'reasonable', 'optimal', 'efficiently']
const SUBJECTIVE_WORDS = ['feels', 'natural', 'good', 'nice', 'great', 'appropriate', 'reasonable', 'optimal', 'efficient', 'quality', 'clear', 'well-written', 'professional', 'coherent', 'logical']

/* ── diagnosis engine ──────────────────────────────── */
function analyzeRubric(text, weight, category) {
  const issues = []
  const warnings = []
  const t = text.toLowerCase()

  if (weight && !ALLOWED_WEIGHTS.has(weight)) {
    issues.push({ severity: 'error', code: 'BAD_WEIGHT', msg: `Weight "${weight}" is not in the allowed set. Use only: -5, -3, -1, +1, +3, +5.` })
  }
  const negPhrase = NEGATIVE_PHRASING.find(p => t.includes(p))
  if (negPhrase) {
    issues.push({ severity: 'error', code: 'NEGATIVE_PHRASING', msg: `Contains forbidden negative phrasing: "${negPhrase}". Rewrite to describe what CAN be observed.` })
  }
  const badAdj = FORBIDDEN_ADJECTIVES.find(a => t.includes(a))
  if (badAdj) {
    issues.push({ severity: 'error', code: 'FORBIDDEN_ADJECTIVE', msg: `Contains forbidden adjective: "${badAdj}". Describe the observable behavior, not how well it was done.` })
  }
  const subjWord = SUBJECTIVE_WORDS.find(s => t.includes(s))
  if (subjWord && !FORBIDDEN_ADJECTIVES.includes(subjWord)) {
    warnings.push({ severity: 'warning', code: 'SUBJECTIVE', msg: `May be subjective: contains "${subjWord}". Ensure the criterion is measurable without personal opinion.` })
  }
  if (t.includes('mentioned in the prompt') || t.includes('as stated in') || t.includes('from the prompt') || t.includes('in the prompt')) {
    issues.push({ severity: 'error', code: 'NOT_SELF_CONTAINED', msg: 'References the prompt — criterion must be evaluable from the model response alone. Bake the specific detail into the criterion text.' })
  }
  const andCount = (t.match(/ and /g) || []).length
  if (andCount >= 2) {
    warnings.push({ severity: 'warning', code: 'POSSIBLE_BUNDLING', msg: `Contains ${andCount} "and" conjunctions — verify this is atomic (tests one thing only).` })
  }
  if (t.startsWith('the agent ') && text.trim().split(' ').length < 6) {
    warnings.push({ severity: 'warning', code: 'TOO_VAGUE', msg: 'Criterion may be too vague. Specify exactly what the agent must produce or do.' })
  }
  if (weight === '+1' && (t.includes('creates') || t.includes('produces') || t.includes('outputs') || t.includes('generates')) && !t.includes('exact') && !t.includes('filename')) {
    warnings.push({ severity: 'warning', code: 'POSSIBLE_UNDERWEIGHT', msg: 'Creating/producing the main artifact is usually +5 or +3. Consider whether +1 is too low.' })
  }
  if (weight === '+5' && (t.includes('exact filename') || t.includes('named specifically'))) {
    warnings.push({ severity: 'warning', code: 'POSSIBLE_OVERWEIGHT', msg: 'Exact filename or naming is usually +1 or +3. Consider whether +5 is too high.' })
  }

  return { issues, warnings, clean: issues.length === 0 && warnings.length === 0 }
}

/* ── rubric generation engine ──────────────────────── */
function generateRubric(prompt) {
  const t = prompt.toLowerCase()
  const criteria = []

  // ── detect output file(s) ──
  const fileMatches = [...prompt.matchAll(/(?:create|save|write|generate|output|produce|named?|called?)\s+[`"']?([a-zA-Z0-9_\-]+\.[a-zA-Z0-9]{2,5})[`"']?/gi)]
  const files = [...new Set(fileMatches.map(m => m[1]).filter(f => !f.startsWith('http')))]

  files.forEach(filename => {
    criteria.push({ text: `The agent creates a file named ${filename} in the workspace.`, weight: '+5', category: 'Task Completion' })
  })

  // ── detect format ──
  const formatMap = { csv: 'CSV', json: 'JSON', tsv: 'TSV', xlsx: 'Excel spreadsheet', md: 'Markdown', txt: 'plain text', zip: 'zip archive' }
  for (const [ext, label] of Object.entries(formatMap)) {
    if (t.includes(`.${ext}`) || t.includes(`${ext} format`) || t.includes(`as ${ext}`)) {
      criteria.push({ text: `The output file is in ${label} format.`, weight: '+5', category: 'Instruction Following' })
      break
    }
  }

  // ── detect column/field names ──
  const colMatch = prompt.match(/columns?\s+(?:must\s+be|are|include|named?|called?|:)\s+([^\n.]+)/i)
  if (colMatch) {
    const raw = colMatch[1]
    const cols = raw.split(/,|and/).map(c => c.replace(/['"]/g, '').trim()).filter(Boolean)
    cols.slice(0, 6).forEach(col => {
      criteria.push({ text: `The output includes a column named "${col}".`, weight: '+5', category: 'Instruction Following' })
    })
    if (cols.length > 0) {
      criteria.push({ text: `The output includes columns other than ${cols.map(c => `"${c}"`).join(', ')}.`, weight: '-5', category: 'Negative Criterion' })
    }
  }

  // ── detect exact counts ──
  const countMatch = prompt.match(/(?:exactly|at least|minimum of|)\s*(\d+)\s+(?:rows?|items?|records?|entries|words?|lines?|emails?|contacts?|criteria)/i)
  if (countMatch) {
    const n = countMatch[1]
    const unit = countMatch[0].split(/\s+/).pop()
    criteria.push({ text: `The output contains exactly ${n} ${unit}.`, weight: '+3', category: 'Instruction Following' })
    criteria.push({ text: `The output contains fewer than ${n} required ${unit}.`, weight: '-5', category: 'Negative Criterion' })
  }

  // ── detect filter conditions ──
  const filterPatterns = [
    { rx: /only\s+(active|current|valid)\s+/i, label: (m) => `The agent includes only ${m[1]} records in the output.` },
    { rx: /exclude\s+(inactive|deleted|archived|invalid)/i, label: (m) => `The output excludes ${m[1]} records.` },
    { rx: /no\s+(duplicates?|duplicate\s+entries)/i, label: () => 'The output contains duplicate entries.' },
  ]
  filterPatterns.forEach(({ rx, label }) => {
    const m = prompt.match(rx)
    if (m) {
      const text = label(m)
      const isNeg = text.toLowerCase().includes('duplicate')
      criteria.push({ text, weight: isNeg ? '-3' : '+5', category: isNeg ? 'Negative Criterion' : 'Instruction Following' })
    }
  })

  // ── detect MEMORY.md ──
  if (t.includes('memory.md') || t.includes('memory file') || t.includes('store in memory') || t.includes('save to memory')) {
    criteria.push({ text: 'The agent creates MEMORY.md in the workspace.', weight: '+5', category: 'Task Completion' })
    criteria.push({ text: 'The persistent memory file is specifically named MEMORY.md.', weight: '+3', category: 'Instruction Following' })
  }

  // ── detect email sending ──
  if (t.includes('send') && (t.includes('email') || t.includes('message'))) {
    criteria.push({ text: 'The agent sends the required email(s) to the specified recipient(s).', weight: '+5', category: 'Task Completion' })
    criteria.push({ text: 'The sent email includes the required subject line.', weight: '+3', category: 'Instruction Following' })
  }

  // ── detect tool / skill use ──
  if (t.includes('skill') || t.includes('tool') || t.includes('api') || t.includes('calendar') || t.includes('gmail') || t.includes('search')) {
    criteria.push({ text: 'The trajectory includes at least one OpenClaw Skill invocation.', weight: '+3', category: 'Tool Use' })
  }

  // ── detect summary / report requirement ──
  if (t.includes('summary') || t.includes('report') || t.includes('analysis')) {
    criteria.push({ text: 'The agent produces a summary or report artifact as required.', weight: '+5', category: 'Task Completion' })
    criteria.push({ text: 'The report contains the required sections or structure.', weight: '+3', category: 'Instruction Following' })
  }

  // ── detect word/length limits ──
  const wordLimit = prompt.match(/(?:under|less than|no more than|max(?:imum)?)\s+(\d+)\s+words?/i)
  if (wordLimit) {
    criteria.push({ text: `The output exceeds ${wordLimit[1]} words.`, weight: '-3', category: 'Negative Criterion' })
  }

  // ── always ensure at least one negative criterion ──
  const hasNeg = criteria.some(c => c.weight.startsWith('-'))
  if (!hasNeg) {
    criteria.push({ text: 'The agent produces output that omits required content or violates a core constraint.', weight: '-5', category: 'Negative Criterion' })
  }

  // ── group by category ──
  const ORDER = ['Task Completion', 'Instruction Following', 'Factuality & Hallucination', 'Tool Use', 'Agent Behavior', 'Negative Criterion']
  criteria.sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category))

  return criteria
}

/* ── examples ──────────────────────────────────────── */
const EXAMPLES = [
  { text: 'The model does not include duplicate wine bottles in the final report.', weight: '-3', category: 'Negative Criterion' },
  { text: 'The response addresses the bug mentioned in the prompt.', weight: '+3', category: 'Task Completion' },
  { text: 'The agent correctly processes the input data.', weight: '+5', category: 'Task Completion' },
  { text: 'The final report has good formatting and is well-written.', weight: '+3', category: 'Instruction Following' },
  { text: 'The agent includes columns named "name," "email," and "phone" in the output CSV.', weight: '+5', category: 'Instruction Following' },
  { text: 'The agent creates a file named clean_contacts.csv in the workspace.', weight: '+5', category: 'Task Completion' },
]

const MAKER_EXAMPLES = [
  'Read contacts_raw.csv and create clean_contacts.csv. Only include active contacts. Columns must be name, email, and phone only.',
  'Create spanish101_anki_import.tsv with exactly 14 rows. First column is Spanish word, second column is English translation. Store the word list in MEMORY.md.',
  'Read sales_data.csv and generate a monthly_summary.json report. Exclude inactive accounts. Send a summary email to the manager with subject line "Monthly Sales Report".',
]

const WEIGHT_COLORS = {
  '+5': 'text-emerald-400 border-emerald-800/60 bg-emerald-950/20',
  '+3': 'text-cyan-400 border-cyan-800/60 bg-cyan-950/20',
  '+1': 'text-blue-400 border-blue-800/60 bg-blue-950/20',
  '-1': 'text-amber-400 border-amber-800/60 bg-amber-950/20',
  '-3': 'text-orange-400 border-orange-800/60 bg-orange-950/20',
  '-5': 'text-red-400 border-red-800/60 bg-red-950/20',
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="px-2.5 py-1 text-[10px] rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition shrink-0"
    >
      {copied ? '✅ Copied' : 'Copy'}
    </button>
  )
}

/* ── rubric maker tab ──────────────────────────────── */
function RubricMaker() {
  const [prompt, setPrompt] = useState('')
  const [criteria, setCriteria] = useState([])
  const [generated, setGenerated] = useState(false)

  const generate = () => {
    const result = generateRubric(prompt)
    setCriteria(result)
    setGenerated(true)
  }

  const loadExample = (ex) => {
    setPrompt(ex)
    setCriteria([])
    setGenerated(false)
  }

  const fullRubricText = criteria.map(c => `(${c.weight}) [${c.category}] ${c.text}`).join('\n')

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-400 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
        Paste your task prompt below. The maker will extract file names, formats, columns, counts, filters, and memory requirements — then build a complete rubric set for you.
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Try a sample prompt</div>
        <div className="flex flex-col gap-2">
          {MAKER_EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => loadExample(ex)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition text-left">
              {ex.slice(0, 80)}…
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">Task prompt</label>
          <textarea
            value={prompt}
            onChange={e => { setPrompt(e.target.value); setGenerated(false) }}
            placeholder="Paste the full task prompt here — e.g. 'Read contacts_raw.csv and create clean_contacts.csv. Only include active contacts. Columns must be name, email, and phone only.'"
            rows={5}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none"
          />
        </div>
        <button
          onClick={generate}
          disabled={!prompt.trim()}
          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-slate-950 transition"
        >
          Generate Rubric
        </button>
      </div>

      {generated && criteria.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-200">
              Generated Rubric — {criteria.length} criteria
              {criteria.some(c => c.weight.startsWith('-'))
                ? <span className="ml-2 text-xs text-emerald-400">✓ has negative criterion</span>
                : <span className="ml-2 text-xs text-red-400">⚠ missing negative criterion</span>}
            </div>
            <CopyButton text={fullRubricText} />
          </div>

          {['Task Completion', 'Instruction Following', 'Factuality & Hallucination', 'Tool Use', 'Agent Behavior', 'Negative Criterion'].map(cat => {
            const group = criteria.filter(c => c.category === cat)
            if (!group.length) return null
            return (
              <div key={cat}>
                <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">{cat}</div>
                <div className="space-y-2">
                  {group.map((c, i) => (
                    <div key={i} className={`rounded-xl border px-4 py-3 flex gap-3 items-start ${WEIGHT_COLORS[c.weight] || 'border-slate-800 bg-slate-900/40'}`}>
                      <span className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${WEIGHT_COLORS[c.weight]?.split(' ')[0]}`}>{c.weight}</span>
                      <span className="text-sm text-slate-200 flex-1">{c.text}</span>
                      <CopyButton text={`(${c.weight}) ${c.text}`} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] uppercase tracking-widest text-slate-600">Full rubric (copy-ready)</div>
              <CopyButton text={fullRubricText} />
            </div>
            <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-6">{fullRubricText}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── main component ────────────────────────────────── */
export default function RubricDoctor() {
  const [text, setText] = useState('')
  const [weight, setWeight] = useState('+3')
  const [category, setCategory] = useState('Task Completion')
  const [result, setResult] = useState(null)
  const [bulk, setBulk] = useState('')
  const [bulkResults, setBulkResults] = useState([])
  const [tab, setTab] = useState('maker')

  const analyze = () => setResult(analyzeRubric(text, weight, category))

  const loadExample = (ex) => { setText(ex.text); setWeight(ex.weight); setCategory(ex.category); setResult(null) }

  const analyzeBulk = () => {
    const lines = bulk.split('\n').map(l => l.trim()).filter(Boolean)
    setBulkResults(lines.map(line => {
      const match = line.match(/^(.+?)\s*\(([+-]\d)\)?\s*$/)
      const t = match ? match[1].trim() : line
      const w = match ? match[2] : null
      return { text: t, weight: w, ...analyzeRubric(t, w, null) }
    }))
  }

  const TABS = [
    { id: 'maker', label: '✨ Rubric Maker' },
    { id: 'single', label: 'Single Criterion' },
    { id: 'bulk', label: 'Bulk Analyze' },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">🧪 Rubric Doctor</h1>
        <p className="text-sm text-slate-500 mt-1">Diagnose existing criteria or generate a full rubric from a task prompt.</p>
      </div>

      <div className="flex gap-1 border-b border-slate-800">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition border-b-2 -mb-px ${tab === t.id ? 'border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'maker' && <RubricMaker />}

      {tab === 'single' && (
        <div className="space-y-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Try an example</div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => loadExample(ex)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition">
                  Example {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">Criterion text</label>
              <textarea value={text} onChange={e => { setText(e.target.value); setResult(null) }}
                placeholder='e.g. "The agent creates a file named clean_contacts.csv in the workspace."'
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none" />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">Weight</label>
                <select value={weight} onChange={e => setWeight(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600">
                  {['+5','+3','+1','-1','-3','-5','+2','+4','-2','-4','0'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600">
                  {['Task Completion','Instruction Following','Factuality & Hallucination','Tool Use','Agent Behavior','Negative Criterion'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button onClick={analyze} disabled={!text.trim()}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-slate-950 transition">
              Analyze Criterion
            </button>
          </div>

          {result && (
            <div className="space-y-3">
              {result.clean && <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-300">✓ No issues detected — criterion looks valid.</div>}
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
              <textarea value={bulk} onChange={e => setBulk(e.target.value)}
                placeholder={"The model does not include duplicates. (+3)\nThe agent correctly processes the data. (+5)\nThe file clean_contacts.csv is created. (+5)"}
                rows={8}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none font-mono" />
            </div>
            <button onClick={analyzeBulk} disabled={!bulk.trim()}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-slate-950 transition">
              Analyze All
            </button>
          </div>

          {bulkResults.length > 0 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex gap-4 text-sm">
                <span className="text-emerald-400">{bulkResults.filter(r => r.clean).length} clean</span>
                <span className="text-red-400">{bulkResults.filter(r => r.issues.length > 0).length} with errors</span>
                <span className="text-amber-400">{bulkResults.filter(r => r.warnings.length > 0 && r.issues.length === 0).length} with warnings</span>
                {!bulkResults.some(r => r.issues.some(i => i.code === 'BAD_WEIGHT') || r.weight?.startsWith('-')) && (
                  <span className="text-red-400 font-semibold">⚠️ No negative-weight criterion detected</span>
                )}
              </div>
              {bulkResults.map((r, i) => (
                <div key={i} className={`rounded-xl border px-4 py-3 ${r.issues.length > 0 ? 'border-red-800/60 bg-red-950/10' : r.warnings.length > 0 ? 'border-amber-800/60 bg-amber-950/10' : 'border-emerald-800/40 bg-emerald-950/10'}`}>
                  <div className="flex items-start gap-2">
                    <span className={r.issues.length > 0 ? 'text-red-400' : r.warnings.length > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                      {r.issues.length > 0 ? '✕' : r.warnings.length > 0 ? '⚠' : '✓'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400 mb-1 truncate">"{r.text}"</div>
                      {r.issues.map((issue, j) => <div key={j} className="text-xs text-red-300 mb-0.5">{issue.msg}</div>)}
                      {r.warnings.map((warn, j) => <div key={j} className="text-xs text-amber-300 mb-0.5">{warn.msg}</div>)}
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
