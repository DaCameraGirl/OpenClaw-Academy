import { useState } from 'react'

const STEPS = [
  {
    title: '1) Open PowerShell correctly (Admin + Non-Admin)',
    why: 'You need one Admin terminal for machine setup checks and one normal terminal for project work.',
    actions: [
      'Press Start, type "PowerShell".',
      'Right-click "Windows PowerShell" -> Run as administrator.',
      'Keep this Admin window open for system checks only.',
      'Open a second normal PowerShell window (not admin) for project commands.',
    ],
    commands: [
      'whoami',
      '$PSVersionTable.PSVersion',
      'Get-ExecutionPolicy -List',
    ],
    expected: [
      'You can run commands in both windows.',
      'Admin window opens without permission errors.',
      'Normal window is used for repo commands.',
    ],
    fix: [
      'If "Run as administrator" is blocked, sign in with an account that has local admin rights.',
      'If scripts are blocked, run: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned (only in your own account).',
    ],
  },
  {
    title: '2) Prepare workspace and copy reference file into project',
    why: 'OpenClaw/Claude Code should read files from workspace-relative paths, not random OneDrive absolute paths.',
    actions: [
      'In normal PowerShell, move into project folder.',
      'Create a references folder in the repo.',
      'Copy the guidelines markdown into that references folder.',
    ],
    commands: [
      'cd C:\\Users\\enter\\OpenClaw-Academy',
      'New-Item -ItemType Directory -Force .\\references | Out-Null',
      'Copy-Item "C:\\Users\\enter\\OneDrive\\Documents\\Project101\\OpenClaw_Guidelines_Reference.md" ".\\references\\OpenClaw_Guidelines_Reference.md" -Force',
      'Test-Path .\\references\\OpenClaw_Guidelines_Reference.md',
    ],
    expected: [
      'Final Test-Path output is True.',
      'File exists at ./references/OpenClaw_Guidelines_Reference.md inside repo.',
    ],
    fix: [
      'If copy fails, verify source path exactly and remove accidental quotes/spaces.',
      'If OneDrive is offline, open file once in OneDrive so it is downloaded locally, then copy again.',
    ],
  },
  {
    title: '3) Start Claude Code from the project directory',
    why: 'Claude should operate inside the exact workspace where OpenClaw files live.',
    actions: [
      'In normal PowerShell, stay in C:\\Users\\enter\\OpenClaw-Academy.',
      'Launch Claude Code from this directory.',
      'Paste the install prompt exactly (provided below).',
    ],
    commands: [
      'cd C:\\Users\\enter\\OpenClaw-Academy',
      'claude',
    ],
    expected: [
      'Claude starts with current working directory = OpenClaw-Academy.',
      'Claude confirms it will research current OpenClaw setup before install.',
    ],
    fix: [
      'If claude is not recognized, install/update Claude CLI first, then relaunch terminal.',
      'If Claude starts in wrong folder, exit and relaunch after cd to project.',
    ],
  },
  {
    title: '4) Force provider setup: OpenRouter only',
    why: 'Avoid wrong billing/auth path and keep setup aligned with OpenClaw guidance.',
    actions: [
      'Create OpenRouter API key at openrouter.ai.',
      'When Claude asks, provide key and explicitly set model provider to OpenRouter.',
      'Use a concrete starter model, then run a health-check call.',
    ],
    commands: [
      'Model target: google/gemma-3-27b-it:free',
      'Fallback target: deepseek/deepseek-chat-v3-0324:free (or another available free model)',
    ],
    expected: [
      'Claude confirms provider = OpenRouter.',
      'Health check returns valid model output (not auth failure).',
    ],
    fix: [
      'If auth fails, rotate key and retry.',
      'If rate-limited, swap to another free model and rerun health check.',
    ],
  },
  {
    title: '5) Connect Telegram bot end-to-end',
    why: 'OpenClaw must receive and send real messages through your bot channel.',
    actions: [
      'In Telegram, open @BotFather and run /newbot.',
      'Copy bot token and provide token to Claude during setup.',
      'Bind bot access to your user/chat ID only.',
      'Send test message: "hello test".',
    ],
    commands: [
      'Telegram manual flow: @BotFather -> /newbot -> token',
      'In Claude: request strict allowed-user binding',
    ],
    expected: [
      'Bot replies to your test message.',
      'Logs show inbound + outbound events.',
      'Unauthorized users are blocked.',
    ],
    fix: [
      'If silent, re-check token and chat binding.',
      'If wrong user can access bot, lock allowed-user config and retest.',
    ],
  },
  {
    title: '6) Benchmark-safe run policy (A/B parity + MEMORY)',
    why: 'Trajectory quality is invalid if model contexts diverge or memory rules are skipped.',
    actions: [
      'Use exactly the same initial prompt for Model A and Model B.',
      'Reset both environments to equivalent baseline before each run.',
      'Explicitly require MEMORY.md creation in the prompt.',
      'Require at least one installed skill usage.',
    ],
    commands: [
      'Prompt line: "Create MEMORY.md in workspace and store reusable facts there."',
      'Prompt line: "Use at least one installed OpenClaw Skill during execution."',
    ],
    expected: [
      'Both models start from equivalent state.',
      'MEMORY.md appears during run.',
      'Trajectories are comparable.',
    ],
    fix: [
      'If one run had extra context, reset both and rerun.',
      'If MEMORY.md missing, stop and rerun with explicit memory instruction.',
    ],
  },
  {
    title: '7) Session-safe extraction and packaging',
    why: 'Forcing session end can break trace extraction.',
    actions: [
      'After run, close tab normally (do not force-end).',
      'Use "Collect Traces & Continue".',
      'Download all workspace outputs per model and Silver trajectory when used.',
      'Zip folders with clear naming and upload.',
    ],
    commands: [
      'Folder convention: .\\exports\\model-a\\, .\\exports\\model-b\\, .\\exports\\silver\\',
      'Zip name convention: openclaw_submission_YYYY-MM-DD.zip',
    ],
    expected: [
      'Each model has trajectory file + output artifacts.',
      'Zip includes all required folders before upload.',
    ],
    fix: [
      'If traces missing, reopen with Restart Session and collect again.',
      'If files are mixed, rebuild folder mapping and re-zip.',
    ],
  },
]

const INSTALL_PROMPT = `I want to install OpenClaw in this workspace.
Research current setup documentation first, then perform install.
Use OpenRouter for model access (not Anthropic subscription keys).
Ask me only for secrets when needed (API keys/tokens).
After install, run an end-to-end health check:
1) model call succeeds
2) Telegram bot receives + replies
3) MEMORY.md is created in workspace.`

export default function SetupClaudeCode() {
  const [idx, setIdx] = useState(0)
  const step = STEPS[idx]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Interactive Install: OpenClaw + Claude Code</h1>
        <p className="text-sm text-slate-500 mt-1">Explicit runbook with admin instructions, exact commands, expected outputs, and recovery paths.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">Step {idx + 1} of {STEPS.length}</div>
          <div className="flex gap-2">
            <button onClick={() => setIdx((v) => Math.max(0, v - 1))} className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300">Back</button>
            <button onClick={() => setIdx((v) => Math.min(STEPS.length - 1, v + 1))} className="px-3 py-1.5 text-xs rounded-lg bg-cyan-600 text-slate-950">Next</button>
          </div>
        </div>

        <div className="mt-3 text-sm font-semibold text-slate-200">{step.title}</div>
        <div className="mt-1 text-xs text-slate-400">Why: {step.why}</div>

        <Block title="Actions" items={step.actions} />
        <Code title="Commands / Inputs" lines={step.commands} />
        <Block title="Expected result" items={step.expected} />
        <Block title="If broken, do this" items={step.fix} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Copy-ready install prompt</h2>
          <button onClick={() => navigator.clipboard.writeText(INSTALL_PROMPT)} className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-300">
            Copy
          </button>
        </div>
        <pre className="mt-3 text-xs leading-6 text-slate-300 whitespace-pre-wrap">{INSTALL_PROMPT}</pre>
      </div>
    </div>
  )
}

function Block({ title, items }) {
  const copyText = `${title}\n${items.map((item) => `- ${item}`).join('\n')}`
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="text-[11px] uppercase tracking-widest text-slate-600">{title}</div>
        <button
          onClick={() => navigator.clipboard.writeText(copyText)}
          className="px-2 py-1 text-[10px] rounded-md border border-slate-700 text-slate-300 hover:border-slate-500"
        >
          Copy
        </button>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-slate-300 leading-relaxed">{item}</li>
        ))}
      </ul>
    </div>
  )
}

function Code({ title, lines }) {
  const copyText = lines.join('\n')
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="text-[11px] uppercase tracking-widest text-slate-600">{title}</div>
        <button
          onClick={() => navigator.clipboard.writeText(copyText)}
          className="px-2 py-1 text-[10px] rounded-md border border-slate-700 text-slate-300 hover:border-slate-500"
        >
          Copy
        </button>
      </div>
      <pre className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
        {lines.join('\n')}
      </pre>
    </div>
  )
}
