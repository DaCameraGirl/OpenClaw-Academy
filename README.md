<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=180&text=OpenClaw%20Academy&fontAlign=50&fontAlignY=35&color=0:00c6ff,30:0072ff,70:ff5f6d,100:ffc371&fontColor=ffffff&fontSize=56&desc=Interactive%20Prompt%20%2B%20Rubric%20Training&descAlign=50&descAlignY=60" alt="OpenClaw Academy banner" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Quicksand&weight=700&size=28&pause=700&color=F9D423&center=true&vCenter=true&width=980&lines=✨+Build+better+OpenClaw+tasks+✨;🧠+Prompt+Builder:+writes+strong+task+prompts;📏+Rubric+Builder:+checks+if+your+scoring+rules+are+valid;🌟+Twinkle+mode+enabled+🌟" alt="Animated twinkle title" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-97.8%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS-2.0%25-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS" />
  <img src="https://img.shields.io/badge/HTML-0.2%25-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML" />
</p>

<p align="center">
  <img alt="Claude bot" width="60" height="60" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png" />
  <img alt="Lobster" width="60" height="60" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Lobster" width="60" height="60" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
  <img alt="Claude bot" width="60" height="60" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f916.png" />
  <img alt="Lobster" width="60" height="60" src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f99e.png" />
</p>

---

## What this project is

OpenClaw Academy is a training app that helps you:

- write stronger task prompts
- build valid scoring rubrics
- avoid onboarding mistakes
- compare model trajectories correctly

## Plain-English tool meanings

1. **Prompt Builder**
- Helps you create a complete task prompt.
- Checks parity, MEMORY.md requirement, skill usage, and outcome clarity.

2. **Rubric Builder**
- Helps you write scoring criteria that follow your rules.
- Checks allowed weights, positive phrasing, atomic criteria, and required negative criterion.

3. **Rubric Doctor / Unit Test Doctor**
- Explain what is wrong in your rubric or test assertions and how to fix it.

## How to use Claude Code with OpenClaw (step-by-step)

1. Open **PowerShell (normal window)** and go to project folder:

```powershell
cd C:\Users\enter\OpenClaw-Academy
```

2. Launch Claude Code from that same folder:

```powershell
claude
```

3. Paste this install request in Claude Code:

```text
I want to install OpenClaw in this workspace.
Research current setup docs first, then install.
Use OpenRouter for model access (not Anthropic subscription keys).
Ask me only when you need API keys or tokens.
After install, run a health check:
1) model call works
2) Telegram bot sends and receives
3) MEMORY.md is created in workspace
```

4. Add your required keys when Claude asks:
- OpenRouter API key
- Telegram bot token (from @BotFather)
- Tavily key (optional for web search)

5. Verify setup is truly working:
- Claude confirms provider/model configuration
- Telegram bot replies to your test message
- `MEMORY.md` exists in workspace

6. Run benchmark tasks correctly:
- Use the same initial prompt for Model A and Model B
- Keep baseline state equivalent across models
- Require at least one installed skill
- Require a concrete final artifact path/output

7. Extract traces safely:
- Close tab normally (do not force-end session)
- Use **Collect Traces & Continue**
- Download model outputs + trajectories and package cleanly

## Main modules

- Interactive install runbook (PowerShell admin + non-admin step-by-step)
- Full Guidelines (atomic rules, strict ordering)
- Prompt Builder (with guideline audit)
- Rubric Builder (with guideline audit)
- Workflow trainer, quiz mode, safety annotation tools

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Live site

- `https://dacameragirl.github.io/OpenClaw-Academy/`
- Deploy workflow: `.github/workflows/deploy.yml`

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Quicksand&weight=700&size=22&pause=700&color=7CFFCB&center=true&vCenter=true&width=780&lines=💫+Twinkle+twinkle+little+prompt...;Now+your+rubrics+won't+fumble+onboarding+💫" alt="Twinkle footer" />
</p>
