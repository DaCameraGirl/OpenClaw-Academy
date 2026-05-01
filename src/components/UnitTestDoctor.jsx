import { useState } from 'react'

function analyzeTest(prompt, assertion) {
  const issues = []
  const warnings = []
  const p = prompt.toLowerCase()
  const a = assertion.toLowerCase()

  // Filter 1: Is the value locked by the prompt?
  const hasExactFilename = /['"]\w+\.\w+['"]/.test(assertion)
  const promptSpecifiesFilename = hasExactFilename && /called|named|file\s+['"]/.test(p)

  const hasExactNumber = /==\s*[\d.]+/.test(assertion)
  const promptSpecifiesFormula = /\([^)]+×[^)]+\)/.test(prompt) || /formula|calculate.*as\s/.test(p)

  const hasExactColumnName = /in\s+columns|["']\w+["']\s+in/.test(a) || /assert\s+["']\w+["']\s+in/.test(a)

  // Filename overfitting
  if (hasExactFilename && !promptSpecifiesFilename) {
    issues.push({ severity: 'error', code: 'FILENAME_OVERFITTING', msg: 'Asserting an exact filename when the prompt does not specify one. The model chose the filename — use a format check instead (e.g., assert any(f.endswith(".json") for f in files)).' })
  }

  // Exact numeric overfitting
  if (hasExactNumber && !promptSpecifiesFormula) {
    const match = assertion.match(/==\s*([\d.]+)/)
    if (match) {
      issues.push({ severity: 'error', code: 'NUMERIC_OVERFITTING', msg: `Asserting an exact value (${match[1]}) without a fixed formula or data in the prompt. Unless the prompt locks both the formula and all inputs, this is overfitting. Use a tolerance range or a rubric.` })
    }
  }

  // Check for content judgment
  if (a.includes('in report') || a.includes('in summary') || a.includes('in output') || a.includes('in email')) {
    const contentMatch = assertion.match(/["']([^'"]+)["']\s+in/)
    if (contentMatch) {
      warnings.push({ severity: 'warning', code: 'CONTENT_JUDGMENT', msg: `Asserting that "${contentMatch[1]}" appears in the output. Content choices often require judgment — unless the prompt explicitly requires this exact phrase, use a rubric.` })
    }
  }

  // Check for exact column names
  if (hasExactColumnName && !p.includes('column') && !p.includes('field')) {
    warnings.push({ severity: 'warning', code: 'COLUMN_OVERFITTING', msg: 'Asserting an exact column or field name when the prompt may not require that exact naming. Verify the prompt specifies this exact schema.' })
  }

  // Very long assertion — might test multiple things
  if (assertion.split('\n').filter(l => l.trim().startsWith('assert')).length > 1) {
    warnings.push({ severity: 'warning', code: 'MULTIPLE_ASSERTIONS', msg: 'Multiple assert statements detected. Each assertion is a separate unit test — ensure each one passes the 3-filter self-check independently.' })
  }

  // Prompt too vague to support any unit test
  if (prompt.trim().length < 30) {
    warnings.push({ severity: 'warning', code: 'PROMPT_TOO_SHORT', msg: 'The prompt is very short — ensure you pasted the complete prompt. Without the full prompt, overfitting analysis may miss issues.' })
  }

  // Check 3-filter questions
  const filter1 = !issues.some(i => i.code.includes('OVERFITTING'))
  const filter2 = filter1 // If not overfitting, assume it would pass different implementations
  const filter3 = promptSpecifiesFilename || promptSpecifiesFormula

  return { issues, warnings, clean: issues.length === 0 && warnings.length === 0, filters: { filter1, filter2, filter3 } }
}

const EXAMPLES = [
  {
    label: 'Overfitting (filename)',
    prompt: 'Analyze the vendor data and save your results to a JSON file.',
    assertion: 'assert filename == "analysis_output.json"',
  },
  {
    label: 'Valid (filename specified)',
    prompt: 'Analyze the vendor data and save your results to a file called analysis_v2.json.',
    assertion: 'assert filename == "analysis_v2.json"',
  },
  {
    label: 'Overfitting (formula not fixed)',
    prompt: 'Calculate an overall risk score for each vendor based on the data.',
    assertion: 'assert score == 73.42',
  },
  {
    label: 'Valid (formula fixed)',
    prompt: 'Calculate risk as (impact × 0.6) + (likelihood × 0.4) for each vendor.',
    assertion: 'assert score == 72.0',
  },
  {
    label: 'Content judgment (use rubric)',
    prompt: 'Write a summary of the vendor analysis highlighting key risks.',
    assertion: 'assert "supply chain" in report',
  },
]

export default function UnitTestDoctor() {
  const [prompt, setPrompt] = useState('')
  const [assertion, setAssertion] = useState('')
  const [result, setResult] = useState(null)

  const analyze = () => setResult(analyzeTest(prompt, assertion))

  const loadExample = (ex) => {
    setPrompt(ex.prompt)
    setAssertion(ex.assertion)
    setResult(null)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">🔬 Unit Test Doctor</h1>
        <p className="text-sm text-slate-500 mt-1">Paste a prompt + assertion and find out if it overfits, is valid, or should be a rubric.</p>
      </div>

      {/* 3-filter reminder */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">3-Filter Self-Check (all must be YES)</div>
        <div className="space-y-1.5">
          {[
            'Is the expected value locked by the PROMPT or INPUT DATA (not by what your model happened to output)?',
            'Would a different correct implementation also pass this assertion?',
            'Can you point to the exact line in the prompt or exact row in the data that makes this the only valid answer?',
          ].map((f, i) => (
            <div key={i} className="flex gap-2 text-xs text-slate-400">
              <span className="text-cyan-500 font-bold shrink-0">{i + 1}.</span>{f}
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-red-400 font-semibold">If any answer is NO → delete the test or convert to a rubric.</div>
      </div>

      {/* Examples */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Load an example</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => loadExample(ex)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">The task prompt</label>
          <textarea
            value={prompt}
            onChange={e => { setPrompt(e.target.value); setResult(null) }}
            placeholder='Paste the full task prompt here...'
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">The unit test assertion</label>
          <textarea
            value={assertion}
            onChange={e => { setAssertion(e.target.value); setResult(null) }}
            placeholder={'assert filename == "output.json"\n# or\nassert score == 73.42'}
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono outline-none focus:border-cyan-600 resize-none"
          />
        </div>
        <button
          onClick={analyze}
          disabled={!prompt.trim() || !assertion.trim()}
          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-slate-950 transition"
        >
          Evaluate Test
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          {/* Overall verdict */}
          <div className={`rounded-xl border p-4 ${
            result.issues.length > 0 ? 'border-red-800/60 bg-red-950/20'
            : result.warnings.length > 0 ? 'border-amber-800/60 bg-amber-950/20'
            : 'border-emerald-800/60 bg-emerald-950/20'
          }`}>
            <div className={`text-sm font-bold mb-1 ${
              result.issues.length > 0 ? 'text-red-400'
              : result.warnings.length > 0 ? 'text-amber-400'
              : 'text-emerald-400'
            }`}>
              {result.issues.length > 0 ? '✕ Issues detected — likely invalid or overfitting'
              : result.warnings.length > 0 ? '⚠ Warnings — review carefully'
              : '✓ Looks valid — passes basic checks'}
            </div>
          </div>

          {/* 3-Filter results */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">3-Filter Results</div>
            {[
              { label: 'Value locked by prompt/data?', pass: result.filters.filter1 },
              { label: 'Different correct impl would also pass?', pass: result.filters.filter2 },
              { label: 'Exact line in prompt makes this the only answer?', pass: result.filters.filter3 },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-800/60 last:border-0">
                <span className={f.pass ? 'text-emerald-400' : 'text-red-400'}>{f.pass ? '✓' : '✕'}</span>
                <span className="text-xs text-slate-400">{f.label}</span>
              </div>
            ))}
          </div>

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
  )
}
