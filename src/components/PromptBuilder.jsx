import { useMemo, useState } from 'react'

function Checklist({ ok, label }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-800/60 last:border-0">
      <span className={ok ? 'text-emerald-400' : 'text-red-400'}>{ok ? 'PASS' : 'MISS'}</span>
      <span className="text-sm text-slate-300">{label}</span>
    </div>
  )
}

export default function PromptBuilder() {
  const [agentRole, setAgentRole] = useState('Operations planning assistant for a small remote team')
  const [problem, setProblem] = useState('Build a one-shot workflow that triages incoming requests and outputs a ranked execution plan')
  const [contextPath, setContextPath] = useState('./references/OpenClaw_Guidelines_Reference.md')
  const [desiredArtifact, setDesiredArtifact] = useState('Save final output to ./artifacts/final_plan.json with ranked tasks and rationale')
  const [skillName, setSkillName] = useState('openai-docs')
  const [memoryRequired, setMemoryRequired] = useState(true)
  const [parityRequired, setParityRequired] = useState(true)
  const [unavailableUser, setUnavailableUser] = useState(true)
  const [constraints, setConstraints] = useState('Use the same context across Model A and Model B. Keep all actions traceable.')

  const checks = useMemo(() => {
    const prompt = buildPrompt({
      agentRole, problem, contextPath, desiredArtifact, skillName, memoryRequired, parityRequired, unavailableUser, constraints,
    }).toLowerCase()
    return {
      parity: prompt.includes('same initial prompt') || prompt.includes('equivalent'),
      memory: prompt.includes('memory.md'),
      skill: prompt.includes('installed skill') || prompt.includes('use at least one'),
      outcome: prompt.includes('final artifact') || prompt.includes('save final output'),
      threeStage: prompt.includes('data acquisition') && prompt.includes('reasoning') && prompt.includes('output generation'),
      selfContained: contextPath.trim().length > 0 && desiredArtifact.trim().length > 0 && problem.trim().length > 0,
    }
  }, [agentRole, problem, contextPath, desiredArtifact, skillName, memoryRequired, parityRequired, unavailableUser, constraints])

  const output = buildPrompt({
    agentRole, problem, contextPath, desiredArtifact, skillName, memoryRequired, parityRequired, unavailableUser, constraints,
  })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Prompt Builder</h1>
        <p className="text-sm text-slate-500 mt-1">Generate a single-turn prompt with parity, MEMORY, skill-use, and desired-outcome constraints baked in.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <Field label="Agent Objective" value={agentRole} setValue={setAgentRole} />
          <Field label="Real-world Problem" value={problem} setValue={setProblem} />
          <Field label="Reference Path" value={contextPath} setValue={setContextPath} />
          <Field label="Desired Outcome" value={desiredArtifact} setValue={setDesiredArtifact} />
          <Field label="Required Skill" value={skillName} setValue={setSkillName} />
          <Field label="Extra Constraints" value={constraints} setValue={setConstraints} />
          <Toggle label="Require MEMORY.md creation" checked={memoryRequired} onChange={setMemoryRequired} />
          <Toggle label="Require A/B baseline parity" checked={parityRequired} onChange={setParityRequired} />
          <Toggle label="User unavailable, proceed autonomously" checked={unavailableUser} onChange={setUnavailableUser} />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Validation checks</div>
          <Checklist ok={checks.parity} label="Cross-model parity requirement present" />
          <Checklist ok={checks.memory} label="MEMORY.md requirement present" />
          <Checklist ok={checks.skill} label="Installed skill usage requirement present" />
          <Checklist ok={checks.threeStage} label="Three-stage execution requirement present" />
          <Checklist ok={checks.outcome} label="Desired outcome artifact requirement present" />
          <Checklist ok={checks.selfContained} label="Prompt is self-contained with explicit inputs and output" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-200">Generated Single-Turn Prompt</h2>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500"
          >
            Copy
          </button>
        </div>
        <pre className="mt-3 text-xs leading-6 text-slate-300 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  )
}

function Field({ label, value, setValue }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-widest text-slate-600 block mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-600 resize-none"
      />
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  )
}

function buildPrompt(input) {
  const lines = [
    `You are ${input.agentRole}.`,
    `Task: ${input.problem}.`,
    `Read this reference first: ${input.contextPath}.`,
    '',
    'Execution requirements:',
    '- Complete the task in one single-turn run.',
    '- Follow a 3-stage flow: data acquisition, processing/reasoning, and output generation.',
    '- Use at least one installed skill during execution.',
    '- Coordinate tools and keep actions traceable.',
  ]

  if (input.memoryRequired) {
    lines.push('- Create MEMORY.md in the workspace and store reusable facts and decisions there.')
  }
  if (input.parityRequired) {
    lines.push('- This prompt must be identical across Model A and Model B with equivalent starting state.')
    lines.push('- Do not assume extra inbox, calendar, or hidden context.')
  }
  if (input.unavailableUser) {
    lines.push('- User is unavailable for follow-up; proceed with best judgment and explicit assumptions.')
  }
  if (input.constraints.trim()) {
    lines.push(`- Additional constraints: ${input.constraints}`)
  }

  lines.push('', 'Desired outcome:', `- ${input.desiredArtifact}`, '- The final artifact must be concrete, verifiable, and complete.')
  return lines.join('\n')
}
