import { useState } from 'react'

const STEPS = [
  {
    title: '1) Prep a shared workspace',
    points: [
      'Put every required reference file inside the same project folder used by OpenClaw.',
      'Use workspace-relative paths in prompts (for example: ./references/OpenClaw_Guidelines_Reference.md).',
      'Do not rely on external OneDrive/Desktop paths during model runs.',
    ],
  },
  {
    title: '2) Set baseline parity before each model',
    points: [
      'Reset both model environments so inbox, calendar, and starting files are equivalent.',
      'Use the same initial prompt text for Model A and Model B.',
      'Keep the same context volume and same attached files for both runs.',
    ],
  },
  {
    title: '3) Run with required constraints in prompt',
    points: [
      'Explicitly instruct the model to create and update MEMORY.md.',
      'Explicitly require use of installed OpenClaw Skills.',
      'Require multi-stage flow: data acquisition, reasoning, output artifact generation.',
    ],
  },
  {
    title: '4) Preserve session for trace extraction',
    points: [
      'When done, close the tab normally (do not force-end session).',
      'Use Collect Traces & Continue in the task flow.',
      'If needed, use Restart Session to continue, or Start Fresh only for full reset.',
    ],
  },
  {
    title: '5) Package outputs cleanly',
    points: [
      'Download workspace files for each model and trajectory.',
      'Label folders clearly by model and trajectory type.',
      'Zip the full package and upload.',
    ],
  },
]

const FLOWS = {
  claude: {
    title: 'Claude Code Flow',
    points: [
      'Open terminal Claude Code and ask it to research first, then install OpenClaw.',
      'Use OpenRouter for model access, not direct Anthropic subscription keys.',
      'Run a test ping through your connected chat channel and confirm MEMORY.md updates.',
    ],
  },
  lobster: {
    title: 'Lobster VM Flow',
    points: [
      'Run OpenClaw inside a dedicated VM/container so the runtime is isolated.',
      'Keep the VM awake (or always-on host) to preserve background agent availability.',
      'Validate parity by resetting both model environments before each trajectory run.',
    ],
  },
}

const PROMPT_SNIPPET = `Before starting:
- Read ./references/OpenClaw_Guidelines_Reference.md.
- Create MEMORY.md in the workspace and store persistent facts there.

Task requirements:
- Use at least one installed OpenClaw Skill.
- Execute a 3-stage flow: data acquisition -> reasoning -> final artifact output.
- Produce a concrete, verifiable artifact in the workspace with clear success criteria.`

export default function SetupClaudeCode() {
  const [activeFlow, setActiveFlow] = useState('claude')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">OpenClaw + Claude Code Setup</h1>
        <p className="text-sm text-slate-500 mt-1">
          Practical setup flow to run comparable trajectories and avoid missing-file/session issues.
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-4 text-sm text-cyan-100">
        Key fix: keep reference files inside the active workspace and reference them with relative paths.
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-200">Interactive Setup Paths</h2>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setActiveFlow('claude')}
            className={`px-3 py-2 rounded-xl text-sm border ${
              activeFlow === 'claude'
                ? 'border-cyan-700 bg-cyan-900/40 text-cyan-200'
                : 'border-slate-700 text-slate-300'
            }`}
          >
            Claude Code
          </button>
          <button
            onClick={() => setActiveFlow('lobster')}
            className={`px-3 py-2 rounded-xl text-sm border ${
              activeFlow === 'lobster'
                ? 'border-cyan-700 bg-cyan-900/40 text-cyan-200'
                : 'border-slate-700 text-slate-300'
            }`}
          >
            Lobster
          </button>
        </div>
        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="text-sm font-medium text-slate-200">{FLOWS[activeFlow].title}</div>
          <ul className="mt-2 space-y-1.5">
            {FLOWS[activeFlow].points.map((point) => (
              <li key={point} className="text-sm text-slate-300 leading-relaxed">{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        {STEPS.map((step) => (
          <div key={step.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-semibold text-slate-200">{step.title}</h2>
            <ul className="mt-2 space-y-1.5">
              {step.points.map((point) => (
                <li key={point} className="text-sm text-slate-300 leading-relaxed">{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-200">Prompt Starter</h2>
        <pre className="mt-3 text-xs leading-6 text-slate-300 overflow-x-auto whitespace-pre-wrap">
          {PROMPT_SNIPPET}
        </pre>
      </div>
    </div>
  )
}
