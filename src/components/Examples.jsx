import { useState } from 'react'

const EXAMPLES = [
  {
    id: 'anki',
    title: 'Anki Flashcard Task',
    icon: '🃏',
    desc: 'A Spanish vocabulary task — demonstrates a strong Desired Outcome + complete rubric set.',
    desiredOutcome: [
      'Anki import file created: spanish101_anki_import.tsv (TSV format, 14 data rows).',
      'First column: Spanish word; second column: English translation.',
      'Flashcards for exactly 14 specific words.',
      'No French words in the flashcard set.',
      'MEMORY.md created in the workspace.',
    ],
    promptNotes: [
      'Write naturally — include the real-world reason (studying for a trip).',
      'Specify source materials (the provided vocabulary list).',
      'Specify the exact artifact name and format.',
      'Tell the agent how to store things in memory.',
      'State that the user is unavailable to respond.',
    ],
    rubrics: [
      { text: 'File created in workspace (spanish101_anki_import.tsv)', w: '+5', cat: 'Task Completion' },
      { text: 'File is TSV format', w: '+5', cat: 'Instruction Following' },
      { text: 'Spanish in column 1', w: '+3', cat: 'Instruction Following' },
      { text: 'English in column 2', w: '+3', cat: 'Instruction Following' },
      { text: "Spot-check: 'manzana' present", w: '+3', cat: 'Instruction Following' },
      { text: "Spot-check: 'naranja' present", w: '+3', cat: 'Instruction Following' },
      { text: "Spot-check: 'casa' present", w: '+3', cat: 'Instruction Following' },
      { text: "'manzana' = 'apple'", w: '+1', cat: 'Instruction Following' },
      { text: "'naranja' = 'orange'", w: '+1', cat: 'Instruction Following' },
      { text: "'casa' = 'house'", w: '+1', cat: 'Instruction Following' },
      { text: 'MEMORY.md created', w: '+5', cat: 'Task Completion' },
      { text: 'Named specifically MEMORY.md', w: '+3', cat: 'Instruction Following' },
      { text: 'Fewer than 14 pairs included', w: '-5', cat: 'Negative Criterion' },
    ],
    notes: [
      'The -5 negative criterion covers the most critical failure: not producing the required quantity.',
      'Spot-checks use +3 (important) for presence and +1 (minor) for verifying the translation.',
      'MEMORY.md gets two criteria: one for existence (+5) and one for exact naming (+3).',
    ],
  },
  {
    id: 'contacts',
    title: 'Contact List Cleanup Task',
    icon: '📋',
    desc: 'CSV transformation task — demonstrates grouped rubric categories with one mandatory negative.',
    prompt: 'Read contacts_raw.csv and create clean_contacts.csv. Only include active contacts. Columns must be name, email, and phone only.',
    rubrics: [
      { text: 'The agent creates a file named clean_contacts.csv in the workspace.', w: '+5', cat: 'Task Completion' },
      { text: 'The agent produces a cleaned contact list suitable for backup and later sharing.', w: '+3', cat: 'Task Completion' },
      { text: 'The agent outputs the result in CSV format.', w: '+5', cat: 'Instruction Following' },
      { text: 'The agent limits the final CSV to active contacts only.', w: '+5', cat: 'Instruction Following' },
      { text: 'The agent includes the columns name, email, and phone in the final CSV.', w: '+5', cat: 'Instruction Following' },
      { text: 'The agent preserves only the essential contact information requested for the cleaned file.', w: '+3', cat: 'Instruction Following' },
      { text: 'The agent excludes unrelated metadata fields from the final CSV.', w: '+3', cat: 'Instruction Following' },
      { text: 'The agent uses the exact requested output filename clean_contacts.csv.', w: '+1', cat: 'Instruction Following' },
      { text: 'The agent reads contacts_raw.csv as the source file for the transformation.', w: '+1', cat: 'Tool Use' },
      { text: 'The agent includes columns other than name, email, and phone in the final CSV.', w: '-5', cat: 'Negative Criterion' },
    ],
    notes: [
      'The +5 for "active contacts only" (criterion 4) is critical because filtering is the entire purpose of the task.',
      'The +5 for columns (criterion 5) covers all three together because they form one explicit requirement that must be met as a unit.',
      'The -5 negative criterion is for adding extra columns — a critical violation of the explicit schema constraint.',
      'Tool Use (+1) is minor — it verifies a supporting behavior but does not change basic correctness.',
    ],
  },
  {
    id: 'rubric-good-bad',
    title: 'Good vs Bad Rubric Examples',
    icon: '⚖️',
    desc: 'Side-by-side comparisons of invalid rubric patterns and their fixes.',
    comparisons: [
      {
        issue: 'Negative phrasing',
        bad: 'The model does not include duplicate wine bottles in the final report. (-3)',
        good: 'The final report includes unique wine bottles only. (-3)',
        why: '"Does not include" is negative phrasing. The fix describes what CAN be observed.',
      },
      {
        issue: 'Not atomic (bundled columns)',
        bad: 'The agent includes columns named "party," "season," and "beverages." (+3)',
        good: 'Three separate criteria: "The agent includes a column named \'party\'" (+3) + "season" (+3) + "beverages" (+3)',
        why: 'Each column can fail independently. Bundling makes it impossible to give partial credit.',
      },
      {
        issue: 'Not self-contained',
        bad: 'The response addresses the bug mentioned in the prompt.',
        good: 'The response addresses the bug where the submit button does not work.',
        why: 'The evaluator needs the criterion to be evaluable from the response alone — no prompt lookup.',
      },
      {
        issue: 'Subjective (not objective)',
        bad: 'The response has good formatting.',
        good: 'The response includes a title.',
        why: '"Good" is opinion-based. "Includes a title" is directly observable and binary.',
      },
      {
        issue: 'Wrong adjective',
        bad: 'The agent correctly reads the input file.',
        good: 'The agent reads contacts_raw.csv.',
        why: '"Correctly" is a forbidden adjective. Just describe the observable behavior.',
      },
      {
        issue: 'Incorrect criteria (factual error)',
        bad: 'The agent sorts the list using O(n log n) like selection sort.',
        good: 'The agent sorts the final list by last name in ascending order.',
        why: 'Selection sort is O(n²), not O(n log n). This is factually wrong AND not required by the prompt.',
      },
    ],
  },
  {
    id: 'unit-test-good-bad',
    title: 'Good vs Bad Unit Test Examples',
    icon: '✅',
    desc: 'Side-by-side comparisons showing when assertions are valid vs overfitting.',
    comparisons: [
      {
        issue: 'Overfitting — filename not specified',
        bad: 'assert filename == "analysis_output.json"',
        good: 'assert any(f.endswith(".json") for f in workspace_files)',
        why: 'The prompt said "save as JSON" — it did not specify the filename. Any .json is valid.',
      },
      {
        issue: 'Valid — filename explicitly specified',
        bad: null,
        good: 'assert filename == "analysis_v2.json"  ✅ valid when prompt says: "Save as analysis_v2.json"',
        why: 'The prompt locks the filename — zero degrees of freedom.',
      },
      {
        issue: 'Overfitting — formula not fixed',
        bad: 'assert score == 73.42',
        good: 'Use a rubric: "The agent calculates an overall risk score for each vendor."',
        why: 'The prompt did not fix the formula, rounding, or method. The assertion is overfitting.',
      },
      {
        issue: 'Valid — formula and inputs fixed',
        bad: null,
        good: 'assert score == 72.0  ✅ valid when prompt says: "Calculate risk as (impact × 0.6) + (likelihood × 0.4)"',
        why: 'Formula + all inputs fixed = exactly one correct answer.',
      },
      {
        issue: 'Testing content requiring judgment',
        bad: 'assert "supply chain" in report',
        good: 'Use a rubric checking that the report covers the required risk categories.',
        why: 'Content choices require judgment — not deterministic. Use a rubric instead.',
      },
    ],
  },
]

function RubricRow({ r }) {
  const neg = r.w.startsWith('-')
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-800/60 last:border-0">
      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded shrink-0 ${
        neg ? 'text-red-400 bg-red-950/40' : 'text-emerald-400 bg-emerald-950/40'
      }`}>{r.w}</span>
      <span className="flex-1 text-xs text-slate-300 leading-relaxed">{r.text}</span>
      <span className="text-[10px] text-slate-600 bg-slate-800/60 px-2 py-0.5 rounded-full shrink-0">{r.cat}</span>
    </div>
  )
}

export default function Examples() {
  const [open, setOpen] = useState('anki')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">📂 Examples Library</h1>
        <p className="text-sm text-slate-500 mt-1">Worked examples, good vs bad patterns for rubrics and unit tests.</p>
      </div>

      <div className="space-y-3">
        {EXAMPLES.map(ex => (
          <div key={ex.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-600 transition">
            <button
              onClick={() => setOpen(open === ex.id ? null : ex.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left"
            >
              <span className="text-xl">{ex.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-200">{ex.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{ex.desc}</div>
              </div>
              <span className={`text-slate-500 text-xs transition-transform duration-200 ${open === ex.id ? 'rotate-90' : ''}`}>▶</span>
            </button>

            {open === ex.id && (
              <div className="px-5 pb-5 border-t border-slate-800/60 pt-4 space-y-5">
                {/* Anki / Contacts task examples */}
                {ex.desiredOutcome && (
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Desired Outcome</div>
                    {ex.desiredOutcome.map((d, i) => (
                      <div key={i} className="flex gap-2 text-xs text-slate-300 py-1">
                        <span className="text-emerald-500 shrink-0">✓</span>{d}
                      </div>
                    ))}
                  </div>
                )}

                {ex.promptNotes && (
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Prompt writing notes</div>
                    {ex.promptNotes.map((p, i) => (
                      <div key={i} className="flex gap-2 text-xs text-slate-400 py-1">
                        <span className="text-cyan-500 shrink-0">›</span>{p}
                      </div>
                    ))}
                  </div>
                )}

                {ex.prompt && (
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Prompt</div>
                    <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 italic">
                      "{ex.prompt}"
                    </div>
                  </div>
                )}

                {ex.rubrics && (
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Rubric set</div>
                    <div>
                      {ex.rubrics.map((r, i) => <RubricRow key={i} r={r} />)}
                    </div>
                  </div>
                )}

                {ex.notes && (
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Key observations</div>
                    {ex.notes.map((n, i) => (
                      <div key={i} className="flex gap-2 text-xs text-slate-400 py-1.5 border-b border-slate-800/40 last:border-0">
                        <span className="text-amber-500 shrink-0">💡</span>{n}
                      </div>
                    ))}
                  </div>
                )}

                {/* Good/bad comparison examples */}
                {ex.comparisons && (
                  <div className="space-y-4">
                    {ex.comparisons.map((c, i) => (
                      <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="text-xs font-semibold text-amber-400 mb-3">{c.issue}</div>
                        {c.bad && (
                          <div className="flex gap-2 items-start rounded-lg border border-red-900/30 bg-red-950/20 px-3 py-2 mb-2">
                            <span className="text-red-400 text-[11px] font-bold shrink-0 mt-0.5">✕ BAD</span>
                            <code className="text-[11px] text-red-300/80 font-mono leading-relaxed">{c.bad}</code>
                          </div>
                        )}
                        <div className="flex gap-2 items-start rounded-lg border border-emerald-900/30 bg-emerald-950/20 px-3 py-2 mb-2">
                          <span className="text-emerald-400 text-[11px] font-bold shrink-0 mt-0.5">✓ GOOD</span>
                          <code className="text-[11px] text-emerald-300/80 font-mono leading-relaxed">{c.good}</code>
                        </div>
                        <div className="text-[11px] text-slate-500 italic mt-1">{c.why}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
