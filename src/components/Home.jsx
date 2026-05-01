const FAST_RULES = [
  'Universe = source of truth. Viewer = your window only — never pass the viewer.',
  'Files may add context, but cannot replace or contradict universe data.',
  'Rubrics must be atomic, self-contained, objective, and positively phrased.',
  'Allowed rubric weights only: -5, -3, -1, +1, +3, +5.',
  'Every rubric set MUST contain at least one negative-weight criterion.',
  'Unit tests are ONLY for deterministic outcomes with zero degrees of freedom.',
  'For repeated actions, use aggregate-count + spot-check (not one rubric per item).',
  'Model A must fail ≥50% of rubric score when no safety failure is present.',
  'Do NOT force-end the session — close the tab normally.',
  'Explicitly ask in chat to create MEMORY.md — it will NOT be created automatically.',
]

const MODULES = [
  { id: 'guidelines', icon: '📘', title: 'Full Guidelines', desc: 'All 21 parts covering the complete OpenClaw workflow from mission to ranking.' },
  { id: 'workflow', icon: '🧭', title: 'Workflow & Trajectories', desc: '6-step process, trajectory steps, Silver Trajectory, file packaging.' },
  { id: 'rubric_rules', icon: '⚖️', title: 'Rubric Rules', desc: 'Atomic, self-contained, objective, positive phrasing, weights, categories, PRESENT/NOT PRESENT.' },
  { id: 'unit_test_rules', icon: '✅', title: 'Unit Test Rules', desc: 'Deterministic-only rule, overfitting traps, 3-filter self-check, common mistakes.' },
  { id: 'safety', icon: '🛡️', title: 'Safety Annotation', desc: '7 domains, F1–F8 failure categories, T0–T3 action tiers, annotation workflow.' },
  { id: 'examples', icon: '📂', title: 'Examples Library', desc: 'Anki flashcard task, contact list cleanup — full prompt + rubric + unit test breakdowns.' },
  { id: 'quiz', icon: '🎯', title: 'Quiz Mode', desc: '25 multiple-choice questions across rubrics, unit tests, safety, workflow, and prompts.' },
  { id: 'rubric_doctor', icon: '🧪', title: 'Rubric Doctor', desc: 'Paste a criterion and get instant analysis: phrasing, atomicity, self-containment, weight.' },
  { id: 'unit_test_doctor', icon: '🔬', title: 'Unit Test Doctor', desc: 'Paste a prompt + assertion and find out if it overfits, is valid, or should be a rubric.' },
]

const QUIZ_PREVIEW = [
  { q: 'Which is NOT a required property of a good criterion?', a: 'Subjective so the reviewer can interpret it flexibly — criteria must be objective.' },
  { q: 'When should you use a unit test instead of a rubric?', a: 'Only when the correct answer is a single deterministic outcome fixed by the prompt and input data.' },
  { q: 'What is the one-line rule for universes?', a: "Don't pass the viewer — design tasks that USE the universe." },
  { q: 'What happens if a rubric set has no negative-weight criterion?', a: 'The WHOLE TASK FAILS. At least one negative criterion is mandatory.' },
]

export default function Home({ onNavigate }) {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Hero */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-900/50 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-300 mb-4">
          <span>🧠</span>
          <span>OpenClaw Academy</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-100">
          Interactive Guidelines, Quiz Trainer &amp; Rubric / Test Lab
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
          A complete study site for OpenClaw onboarding — covering every rule in the guidelines, with
          interactive tools to study, quiz yourself, and diagnose rubric and unit-test mistakes before submission.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { label: '📘 Guidelines', id: 'guidelines' },
            { label: '🎯 Quiz Mode', id: 'quiz' },
            { label: '🧪 Rubric Doctor', id: 'rubric_doctor' },
            { label: '🔬 Unit Test Doctor', id: 'unit_test_doctor' },
          ].map(b => (
            <button
              key={b.id}
              onClick={() => onNavigate(b.id)}
              className="rounded-2xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Modules grid */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>🗺️</span> All modules
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {MODULES.map(m => (
              <button
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left hover:border-slate-600 transition group"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                  <span>{m.icon}</span>{m.title}
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {/* Fast rules */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
            <div className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <span>⚡</span> Fast rules
            </div>
            <ul className="space-y-2">
              {FAST_RULES.map((r, i) => (
                <li key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs leading-5 text-slate-300">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Quiz preview */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
            <div className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2 justify-between">
              <span className="flex items-center gap-2"><span>🎯</span> Quiz preview</span>
              <button
                onClick={() => onNavigate('quiz')}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                All 25 questions →
              </button>
            </div>
            <div className="space-y-2">
              {QUIZ_PREVIEW.map((item, i) => (
                <details key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 group">
                  <summary className="cursor-pointer list-none text-xs font-medium text-slate-300">
                    {i + 1}. {item.q}
                  </summary>
                  <p className="mt-2 text-xs leading-5 text-cyan-300 border-t border-slate-800 pt-2">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
