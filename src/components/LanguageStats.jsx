import { useEffect, useRef, useState } from 'react'

const LANGUAGES = [
  { name: 'JavaScript', percent: 98.6, color: '#f7df1e', glow: '#f7df1e66', text: 'text-yellow-300' },
  { name: 'CSS',        percent: 1.3,  color: '#7c3aed', glow: '#7c3aed66', text: 'text-violet-400' },
  { name: 'HTML',       percent: 0.1,  color: '#e34c26', glow: '#e34c2666', text: 'text-orange-400' },
]

function useCountUp(target, duration = 1200, active = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((eased * target).toFixed(1)))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return value
}

function Bar({ lang, index, active }) {
  const count = useCountUp(lang.percent, 1400, active)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => setWidth(lang.percent), index * 120)
    return () => clearTimeout(timer)
  }, [active, lang.percent, index])

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span
          className={`font-bold text-sm tracking-wide ${lang.text}`}
          style={{ textShadow: `0 0 10px ${lang.color}` }}
        >
          {lang.name}
        </span>
        <span className="text-xs font-mono text-slate-300">
          {count}%
        </span>
      </div>

      {/* Track */}
      <div className="relative h-3 rounded-full bg-slate-800 overflow-hidden">
        {/* Shimmer sweep */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)`,
            backgroundSize: '200% 100%',
            animation: active ? 'shimmer 2s infinite' : 'none',
          }}
        />
        {/* Fill bar */}
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${lang.color}cc, ${lang.color})`,
            boxShadow: `0 0 12px ${lang.glow}, 0 0 4px ${lang.color}`,
            transitionDuration: '1.4s',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            transitionDelay: `${index * 120}ms`,
          }}
        />
      </div>
    </div>
  )
}

export default function LanguageStats() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        ref={ref}
        className="rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-sm p-6 mt-8"
        style={{
          animation: visible ? 'fadeSlideUp 0.6s ease forwards' : 'none',
          opacity: visible ? 1 : 0,
          boxShadow: '0 0 40px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">💻</span>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Built With
          </h3>
          <div className="flex-1 h-px bg-slate-800 ml-2" />
        </div>

        {/* Bars */}
        {LANGUAGES.map((lang, i) => (
          <Bar key={lang.name} lang={lang} index={i} active={visible} />
        ))}

        {/* Footer strip — GitHub-style color dots */}
        <div className="flex rounded-full overflow-hidden h-2 mt-6 gap-px">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.name}
              style={{
                width: `${lang.percent}%`,
                background: lang.color,
                boxShadow: `0 0 6px ${lang.glow}`,
              }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {LANGUAGES.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: lang.color, boxShadow: `0 0 6px ${lang.color}` }}
              />
              {lang.name}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
