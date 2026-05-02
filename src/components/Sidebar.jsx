import { useState } from 'react'

const NAV = [
  { id: 'home', icon: 'Home', label: 'Home' },
  { divider: 'Study' },
  { id: 'setup', icon: 'Setup', label: 'Setup: Claude Code' },
  { id: 'guidelines', icon: 'Guide', label: 'Full Guidelines' },
  { id: 'workflow', icon: 'Flow', label: 'Workflow & Trajectories' },
  { id: 'prompt_builder', icon: 'Build', label: 'Prompt Builder' },
  { id: 'rubric_builder', icon: 'Build', label: 'Rubric Builder' },
  { id: 'rubric_rules', icon: 'Rules', label: 'Rubric Rules' },
  { id: 'unit_test_rules', icon: 'Tests', label: 'Unit Test Rules' },
  { id: 'safety', icon: 'Safe', label: 'Safety Annotation' },
  { id: 'examples', icon: 'Examples', label: 'Examples Library' },
  { divider: 'Practice' },
  { id: 'quiz', icon: 'Quiz', label: 'Quiz Mode' },
  { divider: 'Tools' },
  { id: 'rubric_doctor', icon: 'Doctor', label: 'Rubric Doctor' },
  { id: 'unit_test_doctor', icon: 'Doctor', label: 'Unit Test Doctor' },
]

export default function Sidebar({ current, onNavigate, mobileOpen, onMobileClose }) {
  const [search, setSearch] = useState('')

  const filtered = search
    ? NAV.filter(n => !n.divider && n.label.toLowerCase().includes(search.toLowerCase()))
    : NAV

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30
      w-64 flex flex-col bg-slate-900 border-r border-slate-800
      transition-transform duration-200
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-4 border-b border-slate-800">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">OpenClaw Academy</div>
        <div className="text-base font-semibold text-slate-100 leading-tight">
          Interactive Study & Lab
        </div>
      </div>

      <div className="px-3 py-2 border-b border-slate-800">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter sections..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-600"
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {filtered.map((item, i) => {
          if (item.divider) return (
            <div key={i} className="px-2 pt-4 pb-1 text-[10px] uppercase tracking-widest text-slate-600">
              {item.divider}
            </div>
          )
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left
                transition-all duration-100
                ${current === item.id
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
              `}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-600">
        Built from the OpenClaw Guidelines Reference
      </div>
    </aside>
  )
}
