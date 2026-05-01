import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Home from './components/Home.jsx'
import Guidelines from './components/Guidelines.jsx'
import RubricDoctor from './components/RubricDoctor.jsx'
import UnitTestDoctor from './components/UnitTestDoctor.jsx'
import QuizMode from './components/QuizMode.jsx'
import SafetyAnnotation from './components/SafetyAnnotation.jsx'
import Examples from './components/Examples.jsx'
import Workflow from './components/Workflow.jsx'
import RubricRules from './components/RubricRules.jsx'
import UnitTestRules from './components/UnitTestRules.jsx'

const PAGES = {
  home: Home,
  guidelines: Guidelines,
  workflow: Workflow,
  rubric_rules: RubricRules,
  unit_test_rules: UnitTestRules,
  safety: SafetyAnnotation,
  examples: Examples,
  quiz: QuizMode,
  rubric_doctor: RubricDoctor,
  unit_test_doctor: UnitTestDoctor,
}

function App() {
  const [page, setPage] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const Page = PAGES[page] || Home

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        current={page}
        onNavigate={(p) => { setPage(p); setMobileOpen(false) }}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400"
          >
            ☰
          </button>
          <span className="text-sm font-semibold text-slate-200">OpenClaw Academy</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Page onNavigate={setPage} />
        </main>
      </div>
    </div>
  )
}

export default App
