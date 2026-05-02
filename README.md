# Claude Code + OpenClaw Academy

## Start Here: Claude Code + OpenClaw Setup

This repo is for building and evaluating OpenClaw tasks using Claude Code.

### 1) Open PowerShell in the repo

```powershell
cd C:\Users\enter\OpenClaw-Academy
```

### 2) Launch Claude Code

```powershell
claude
```

### 3) Paste this install request

```text
I want to install OpenClaw in this workspace.
Research current setup docs first, then install.
Use OpenRouter for model access (not Anthropic subscription keys).
Ask only when API keys/tokens are needed.
After install, run health checks:
1) model call works
2) Telegram bot sends and receives
3) MEMORY.md is created in workspace
```

### 4) Provide keys when prompted

- OpenRouter API key
- Telegram bot token (@BotFather)
- Tavily key (optional)

### 5) Validate setup

- model request succeeds
- bot replies in Telegram
- `MEMORY.md` exists in workspace

---

## What This App Includes

- Full Guidelines Explorer (rules 1-113 in strict order)
- Interactive Setup Runbook (admin/non-admin PowerShell paths)
- Prompt Builder (parity, MEMORY, skill-use, outcome checks)
- Rubric Builder (valid weights, atomicity, structure checks)
- Rubric Doctor + Unit Test Doctor
- Workflow trainer, quiz mode, safety annotation practice

---

## Local Dev

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Project Structure

```text
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

## Live Site

- https://dacameragirl.github.io/OpenClaw-Academy
- Deploy workflow: `.github/workflows/deploy.yml`
