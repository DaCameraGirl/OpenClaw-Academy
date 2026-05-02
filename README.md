# OpenClaw Academy
**Cute UI, serious agent work.**

<div align="center">

🤖 🦞 ✨ 🦞 🤖

</div>

---

## What Is OpenClaw Academy?

OpenClaw Academy is an interactive training app for:

- Designing realistic OpenClaw tasks
- Building valid, atomic rubrics
- Practicing safe trajectory evaluation
- Exploring the full 1-113 atomic rules in a friendly UI

---

## Core Features

### Full Guidelines Explorer
- All 113 atomic rules, strict numeric order
- Search by rule number, topic, or keyword
- Expand/collapse sections for focus mode

### Interactive Setup Runbook
- Step-by-step Claude Code / OpenClaw setup
- Admin vs non-admin PowerShell flows
- Verification checkpoints after each step
- Recovery guidance when steps fail
- OpenRouter + Telegram integration notes
- A/B parity + MEMORY usage policy

### Prompt Builder
- Field-driven prompt creation
- Enforces parity, MEMORY, skill usage, and outcome constraints
- Live validation
- One-click copy of final prompt text

### Rubric Builder
- Valid weights only: `-5, -3, -1, +1, +3, +5`
- Atomicity checks
- Self-contained criteria checks
- Positive phrasing checks
- Negative-weight requirement enforcement
- JSON export

### Rubric Doctor + Unit Test Doctor
- Lints rubrics for structure and phrasing
- Flags overfitting unit tests
- Helps separate "unit test vs rubric" logic

### Training Modules
- Workflow trainer
- Quiz mode
- Safety annotation practice
- Real examples

---

## Claude Code + OpenClaw (Start Here)

1. Open PowerShell and move into the repo:

```powershell
cd C:\Users\enter\OpenClaw-Academy
```

2. Start Claude Code:

```powershell
claude
```

3. Paste this install request:

```text
I want to install OpenClaw in this workspace.
Research current setup docs first, then install.
Use OpenRouter for model access (not Anthropic subscription keys).
Ask only when you need API keys/tokens.
After install, run health checks:
1) model call works
2) Telegram bot sends and receives
3) MEMORY.md is created in workspace
```

4. Provide keys when requested:
- OpenRouter API key
- Telegram bot token (@BotFather)
- Tavily key (optional)

5. Validate:
- model request succeeds
- bot replies in Telegram
- `MEMORY.md` exists in workspace

---

## Tech Stack

- React (Vite SPA)
- Component-driven UI modules
- Static deploy via GitHub Pages
- Data-driven atomic rules rendering

---

## Project Structure (High Level)

```bash
src/
  components/
    SetupClaudeCode.jsx
    Guidelines.jsx
    PromptBuilder.jsx
    RubricBuilder.jsx
    RubricDoctor.jsx
    UnitTestDoctor.jsx
    QuizMode.jsx
    Workflow.jsx
    SafetyAnnotation.jsx
  data/
    atomicRules.js
```

---

## Getting Started (Local Dev)

### Requirements
- Node.js 18+
- npm
- Windows PowerShell

### Clone the repo

```bash
git clone https://github.com/DaCameraGirl/OpenClaw-Academy.git
cd OpenClaw-Academy
```

### Install dependencies

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

### Build production bundle

```bash
npm run build
```

---

## Live Site

`https://dacameragirl.github.io/OpenClaw-Academy`

Deploy workflow:

```text
.github/workflows/deploy.yml
```

---

## Contributing

- Fork the repo
- Create a feature branch
- Keep changes focused
- Run `npm run build` before PR
- Add screenshots for UI changes

Be kind. Be clear.
