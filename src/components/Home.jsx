const FAST_RULES = [
  'Universe = source of truth. Viewer = your window only - never pass the viewer.',
  'Files may add context, but cannot replace or contradict universe data.',
  'Rubrics must be atomic, self-contained, objective, and positively phrased.',
  'Allowed rubric weights only: -5, -3, -1, +1, +3, +5.',
  'Every rubric set MUST contain at least one negative-weight criterion.',
  'Unit tests are ONLY for deterministic outcomes with zero degrees of freedom.',
  'For repeated actions, use aggregate-count + spot-check (not one rubric per item).',
  'Model A must fail >=50% of rubric score when no safety failure is present.',
  'Do NOT force-end the session - close the tab normally.',
  'Explicitly ask in chat to create MEMORY.md - it will NOT be created automatically.',
]

const MODULES = [
  { id: 'guidelines', icon: 'Guide', title: 'Full Guidelines', desc: 'All atomic rules, strict order, searchable.' },
  { id: 'workflow', icon: 'Flow', title: 'Workflow & Trajectories', desc: '6-step process, extraction, silver trajectory, packaging.' },
  { id: 'rubric_rules', icon: 'Rules', title: 'Rubric Rules', desc: 'Atomic, self-contained, objective, weighted, binary scoring.' },
  { id: 'unit_test_rules', icon: 'Tests', title: 'Unit Test Rules', desc: 'Deterministic-only test logic and overfitting avoidance.' },
  { id: 'safety', icon: 'Safe', title: 'Safety Annotation', desc: 'Domains, F1-F8 categories, tiers, annotation workflow.' },
  { id: 'examples', icon: 'Examples', title: 'Examples Library', desc: 'Prompt and rubric breakdowns with worked references.' },
  { id: 'quiz', icon: 'Quiz', title: 'Quiz Mode', desc: 'Knowledge checks across prompts, rubrics, safety, and tests.' },
  { id: 'rubric_doctor', icon: 'Doctor', title: 'Rubric Doctor', desc: 'Instant criterion diagnostics and fixes.' },
  { id: 'unit_test_doctor', icon: 'Doctor', title: 'Unit Test Doctor', desc: 'Prompt/assertion overfitting checks and guidance.' },
]

const QUIZ_PREVIEW = [
  { q: 'Which is NOT a required property of a good criterion?', a: 'Subjective interpretation flexibility. Criteria must be objective.' },
  { q: 'When should you use a unit test instead of a rubric?', a: 'Only when outcome is deterministic from prompt + input data.' },
  { q: 'What is the one-line rule for universes?', a: "Do not pass the viewer. Design tasks that use the universe." },
  { q: 'What happens if a rubric set has no negative-weight criterion?', a: 'The task fails. At least one negative criterion is mandatory.' },
]

export default function Home({ onNavigate }) {
  return (
    <div className="relative p-6 max-w-6xl mx-auto space-y-6 overflow-hidden oc-home-bg rounded-3xl">
      <div className="pointer-events-none absolute -top-12 -left-12 w-56 h-56 rounded-full bg-cyan-400/30 oc-blob" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 w-64 h-64 rounded-full bg-pink-500/30 oc-blob" style={{ animationDelay: '1.2s' }} />
      <div className="pointer-events-none absolute top-1/3 -left-8 w-44 h-44 rounded-full bg-blue-400/20 oc-blob" style={{ animationDelay: '2.1s' }} />
      <div className="pointer-events-none absolute bottom-1/3 -right-10 w-48 h-48 rounded-full bg-fuchsia-400/20 oc-blob" style={{ animationDelay: '3.1s' }} />
      <div className="pointer-events-none absolute top-16 right-24 text-yellow-300 oc-twinkle">?</div>
      <div className="pointer-events-none absolute top-40 left-24 text-pink-200 oc-twinkle" style={{ animationDelay: '0.8s' }}>?</div>
      <div className="pointer-events-none absolute bottom-24 left-1/2 text-cyan-200 oc-twinkle" style={{ animationDelay: '1.6s' }}>?</div>

      <div className="relative z-10 space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/95 via-slate-900/95 to-slate-950/95 p-6 shadow-2xl">
          <div className="text-[11px] text-pink-200/90 font-mono leading-6 mb-3 whitespace-pre-wrap">{`??:*:???,??:*:???    O P E N C L A W   A C A D E M Y    ???:*:??,???:*:??`}</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-900/50 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-300 mb-4">
            <span>Hacker Cat Online</span>
          </div>
          <pre className="text-xs text-pink-100/90 bg-pink-950/20 border border-pink-300/20 rounded-xl px-3 py-2 inline-block mb-4">{`( ?? ? 7     H A C K E R   C A T   O N L I N E
l? ~?
??f_, )?`}</pre>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-100">
            Interactive Guidelines, Quiz Trainer and Rubric/Test Lab
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            A complete study site for OpenClaw onboarding - covering every rule, with interactive tools to study,
            quiz yourself, and diagnose prompt/rubric mistakes before submission.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { label: 'Guidelines', id: 'guidelines' },
              { label: 'Quiz Mode', id: 'quiz' },
              { label: 'Rubric Doctor', id: 'rubric_doctor' },
              { label: 'Unit Test Doctor', id: 'unit_test_doctor' },
            ].map((b) => (
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
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="text-base font-semibold text-slate-200 mb-4">All modules</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {MODULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onNavigate(m.id)}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left hover:border-slate-600 transition group"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                    <span>{m.icon}</span>{m.title}
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <div className="text-base font-semibold text-slate-200 mb-3">Fast rules</div>
              <ul className="space-y-2">
                {FAST_RULES.map((r, i) => (
                  <li key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs leading-5 text-slate-300">
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <div className="text-base font-semibold text-slate-200 mb-3 flex items-center justify-between">
                <span>Quiz preview</span>
                <button onClick={() => onNavigate('quiz')} className="text-xs text-cyan-400 hover:text-cyan-300">All questions &rarr;</button>
              </div>
              <div className="space-y-2">
                {QUIZ_PREVIEW.map((item, i) => (
                  <details key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 group">
                    <summary className="cursor-pointer list-none text-xs font-medium text-slate-300">{i + 1}. {item.q}</summary>
                    <p className="mt-2 text-xs leading-5 text-cyan-300 border-t border-slate-800 pt-2">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
