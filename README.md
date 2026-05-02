# OpenClaw Academy

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-97.8%25-F7DF1E?style=flat-square&logo=javascript&logoColor=111827" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS-2.0%25-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS" />
  <img src="https://img.shields.io/badge/HTML-0.2%25-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML" />
</p>

<p align="left">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=22&pause=800&color=22D3EE&vCenter=true&width=980&lines=OpenClaw+Academy;Prompt+Forge+%2B+Rubric+Forge;Detailed+OpenClaw+Setup+for+Claude+Code+%2B+Lobster" alt="Animated title" />
</p>

<p align="left">
  <img alt="Claude bot" width="64" height="64" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png" />
  <img alt="Lobster" width="64" height="64" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Lobster" width="64" height="64" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Claude bot" width="64" height="64" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png" />
  <img alt="Lobster" width="64" height="64" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
</p>

OpenClaw Academy is a practical training app for writing stronger prompts, building valid rubrics, and running safer trajectory evaluations for OpenClaw tasks.

## What You Get

- Full Guidelines explorer sourced from atomic rules (1 through 113) in strict numeric order
- Interactive install runbook with exact PowerShell steps, admin/non-admin guidance, verification checks, and recovery steps
- Prompt Builder for single-turn prompt generation with parity, MEMORY, skill-use, and outcome constraints
- Rubric Builder with enforced weights, atomicity checks, self-contained checks, and negative-criterion requirements
- Rubric Doctor and Unit Test Doctor for linting and overfitting detection
- Workflow trainer, quiz mode, safety annotation study modules, and examples

## Core Pages

1. `Setup: Claude Code`
- Full step-by-step installation runbook
- Admin PowerShell instructions
- Workspace and references setup
- OpenRouter and Telegram integration flow
- A/B parity and MEMORY run policy

2. `Full Guidelines`
- Atomic Section 2 rule rendering
- Search by number/topic text
- Expand/collapse all
- Strict numeric ordering toggle

3. `Prompt Builder`
- Interactive field-driven prompt creation
- Live constraint checks
- Copy-ready single-turn output

4. `Rubric Builder`
- Criterion-by-criterion editing
- Valid weight enforcement (`-5, -3, -1, +1, +3, +5`)
- Positive phrasing and structure checks
- JSON export

## Install and Run Locally

### 1) Requirements

- Node.js 18+ (recommended latest LTS)
- npm
- Windows PowerShell (for setup/tutorial parity with app docs)

### 2) Clone the repository

```bash
git clone https://github.com/DaCameraGirl/OpenClaw-Academy.git
cd OpenClaw-Academy
```

### 3) Install dependencies

```bash
npm install
```

### 4) Start dev server

```bash
npm run dev
```

### 5) Build production bundle

```bash
npm run build
```

## OpenClaw Setup Notes (In-App)

For full details, use the `Setup: Claude Code` page in the app. It includes:

- how to open PowerShell as Admin vs non-Admin
- where to run each command
- exact copy/paste command blocks
- expected outputs after each step
- what to do when each step fails

## Project Structure (High Level)

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

- URL: `https://dacameragirl.github.io/OpenClaw-Academy/`
- Deploy workflow: `.github/workflows/deploy.yml`

## Mascot Row (because yes)

<p align="left">
  <img alt="Lobster" width="40" height="40" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Lobster" width="40" height="40" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Lobster" width="40" height="40" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Claude bot" width="40" height="40" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png" />
  <img alt="Lobster" width="40" height="40" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Lobster" width="40" height="40" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Claude bot" width="40" height="40" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png" />
</p>
