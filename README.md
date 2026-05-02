<!-- 🌈 FULL-WIDTH PINK → BLUE GRADIENT HEADER -->
<table width="100%" cellspacing="0" cellpadding="0">
  <tr>
    <td height="90" bgcolor="#ff9fd6"></td>
    <td height="90" bgcolor="#ffb3e6"></td>
    <td height="90" bgcolor="#ffc8f2"></td>
    <td height="90" bgcolor="#e0c8ff"></td>
    <td height="90" bgcolor="#b8a6ff"></td>
    <td height="90" bgcolor="#8f84ff"></td>
  </tr>
</table>

<div align="center">
  <h1 style="margin-top: -40px; color: #ffffff; text-shadow: 0 0 8px #ff9fd6;">
    💖 OpenClaw Academy — Angela Edition 💖
  </h1>
  <p style="color: #ffffff; font-size: 18px; margin-top: -10px;">
    Pink x Blue Jelly Gradient Vibes
  </p>
</div>

<table width="100%" cellspacing="0" cellpadding="0">
  <tr>
    <td height="20" bgcolor="#8f84ff"></td>
    <td height="20" bgcolor="#b8a6ff"></td>
    <td height="20" bgcolor="#e0c8ff"></td>
    <td height="20" bgcolor="#ffc8f2"></td>
    <td height="20" bgcolor="#ffb3e6"></td>
    <td height="20" bgcolor="#ff9fd6"></td>
  </tr>
</table>



<div align="center">

｡･:*:･ﾟ★,｡･:*:･ﾟ☆  🎀  O P E N C L A W   A C A D E M Y  🎀  ☆ﾟ･:*:･｡,★ﾟ･:*:･｡✧･ﾟ: *✧･ﾟ:* 　

>


<br/>

<!-- Faux gradient bar -->
<img src="https://img.shields.io/badge/-_-ff9fd6?style=for-the-badge&labelColor=7f5dff&color=ff9fd6&logoColor=ffffff" />
<img src="https://img.shields.io/badge/AI_Agent_Trainer-Online-7f5dff?style=for-the-badge&labelColor=ff9fd6&color=7f5dff" />
<img src="https://img.shields.io/badge/Pink_x_Blue-Gradient_Vibes-ff9fd6?style=for-the-badge&labelColor=7f5dff&color=ff9fd6" />

<br/><br/>

💗🌊 *A playground for learning how to design prompts, rubrics, and trajectories for OpenClaw—without the boring UI.* 🌊💗

</div>

---

💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙  

## 🌈 What Is OpenClaw Academy?

**OpenClaw Academy** is an interactive training app for:

- 💗 Designing **realistic OpenClaw tasks**
- 💗 Building **valid, atomic rubrics**
- 💗 Practicing **safe trajectory evaluation**
- 💗 Exploring the **full 1–113 atomic rules** in a friendly UI

Think: *“agent‑ops bootcamp”* but dipped in **pink and blue jelly gradient**.

💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙  

## 🎮 Core Features

### 🌸 Full Guidelines Explorer

- 🔢 All **113 atomic rules**, strict numeric order  
- 🔍 Search by **rule number, topic, or keyword**  
- 📂 Expand/collapse sections for focused reading  
- 🧩 Perfect for “wait, what does 78.1 say again?” moments  

---

### 🌸 Interactive Setup Runbook

- 💻 Step‑by‑step **Claude Code / OpenClaw** setup  
- 🧷 Admin vs non‑admin PowerShell flows  
- ✅ Verification checkpoints after each step  
- 🧯 Recovery guidance when something explodes  
- 📡 OpenRouter + Telegram integration notes  
- ♻️ A/B parity + MEMORY usage policy baked in  

---

### 🌸 Prompt Builder

- 🧠 Field‑driven prompt creation  
- 🧩 Enforces **parity**, **MEMORY**, **Skill usage**, **Outcome constraints**  
- ✅ Live validation so you don’t ship cursed prompts  
- 📋 One‑click copy of the final prompt text  

---

### 🌸 Rubric Builder

- ⚖️ Only valid weights: `-5, -3, -1, +1, +3, +5`  
- 🧬 Atomicity checks (one thing per criterion)  
- 🧷 Self‑contained criteria (no external context needed)  
- 🌱 Positive phrasing enforcement  
- 🚨 Negative‑weight requirement (safety / critical failures)  
- 📦 JSON export for OpenClaw use  

---

### 🌸 Rubric Doctor & Unit Test Doctor

- 🩺 Lints rubrics for structure & phrasing  
- 🧪 Flags overfitting unit tests  
- 🧱 Helps separate “unit test vs rubric” logic  
- 🧬 Encourages robust, non‑brittle checks  

---

### 🌸 Training & Practice Modules

- 🧭 Workflow trainer  
- 📝 Quiz mode  
- 🛡️ Safety annotation practice  
- 📚 Realistic examples to dissect and improve  

💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙  

## 🧱 Tech Stack

- ⚛️ **React** (Vite or CRA style SPA)
- 🧩 **Component‑driven UI** for each training module
- 📦 **Static deployment** via GitHub Pages
- 🧠 Data‑driven rendering of atomic rules & rubrics

💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙  

## 📂 Project Structure (High Level)

```bash
src/
  components/
    SetupClaudeCode.jsx      # Install runbook UI
    Guidelines.jsx           # Full atomic rules explorer
    PromptBuilder.jsx        # Prompt creation flow
    RubricBuilder.jsx        # Rubric editor
    RubricDoctor.jsx         # Rubric linting
    UnitTestDoctor.jsx       # Unit test linting
    QuizMode.jsx             # Quiz / training mode
    Workflow.jsx             # Workflow trainer
    SafetyAnnotation.jsx     # Safety labeling practice
  data/
    atomicRules.js           # Encoded atomic rules 1–113

💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙

🚀 Getting Started (Local Dev)
1️⃣ Requirements
🧊 Node.js 18+

📦 npm

🪟 Windows PowerShell (for the OpenClaw setup runbook content)

2️⃣ Clone the Repo
bash
git clone https://github.com/DaCameraGirl/OpenClaw-Academy.git
cd OpenClaw-Academy
3️⃣ Install Dependencies
bash
npm install
4️⃣ Run Dev Server
bash
npm run dev
Then open the printed URL in your browser (usually http://localhost:5173 or similar).

5️⃣ Build for Production
bash
npm run build
Output is ready for static hosting (GitHub Pages, etc.).

💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙

🌐 Live Deployment
The app is deployed via GitHub Pages:

👉 Live site:  
https://dacameragirl.github.io/OpenClaw-Academy

Deployment is handled by:

text
.github/workflows/deploy.yml
💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙

🤝 Contributing (Gradient Edition)
Wanna add a new module, tweak a rubric flow, or improve the UI?

🍭 Fork the repo

🌊 Create a feature branch

💅 Keep changes small and focused

🧪 Run npm run build before opening a PR

📸 Add screenshots for UI changes (extra points for pink/blue themes)

Be kind, be clear, and keep it cute.

💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙

🐾 Mascot Row
Because yes.

🐱 🐾 🐰 🌸 🐾 🐱

💖━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━💙


Made with 💖 + 🌈 by Angela
