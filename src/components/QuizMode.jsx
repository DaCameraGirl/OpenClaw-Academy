import { useState, useEffect, useMemo } from 'react'
import { QUIZ_QUESTIONS } from '../data/quiz.js'

const CATEGORIES = ['All', 'Rubrics', 'Unit Tests', 'Safety', 'Workflow', 'Prompts', 'Task Design', 'Universes & Files']

export default function QuizMode() {
  const [filter, setFilter] = useState('All')
  const [mode, setMode] = useState('study') // 'study' | 'challenge'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('oc_quiz') || '{}') }
    catch { return {} }
  })

  const questions = useMemo(() => {
    const base = filter === 'All' ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter(q => q.category === filter)
    if (mode === 'challenge') {
      return [...base].sort(() => Math.random() - 0.5)
    }
    return base
  }, [filter, mode])

  const q = questions[currentIndex]

  const handleSelect = (i) => {
    if (revealed) return
    setSelected(i)
  }

  const handleReveal = () => {
    if (selected === null) return
    setRevealed(true)
    const correct = selected === q.correct
    setScore(prev => ({ ...prev, [correct ? 'correct' : 'wrong']: prev[correct ? 'correct' : 'wrong'] + 1 }))
    const next = { ...history, [q.id]: correct ? 'correct' : 'wrong' }
    setHistory(next)
    localStorage.setItem('oc_quiz', JSON.stringify(next))
  }

  const handleNext = () => {
    setSelected(null)
    setRevealed(false)
    setCurrentIndex(i => Math.min(i + 1, questions.length - 1))
  }

  const handlePrev = () => {
    setSelected(null)
    setRevealed(false)
    setCurrentIndex(i => Math.max(i - 1, 0))
  }

  const resetProgress = () => {
    setHistory({})
    setScore({ correct: 0, wrong: 0 })
    setCurrentIndex(0)
    setSelected(null)
    setRevealed(false)
    localStorage.removeItem('oc_quiz')
  }

  const attempted = score.correct + score.wrong
  const pct = attempted > 0 ? Math.round(score.correct / attempted * 100) : 0

  if (!q) return (
    <div className="p-6 max-w-2xl mx-auto">
      <p className="text-slate-500">No questions for this filter.</p>
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">🎯 Quiz Mode</h1>
          <p className="text-sm text-slate-500 mt-1">{QUIZ_QUESTIONS.length} questions across rubrics, unit tests, safety, workflow, and prompts.</p>
        </div>
        <button onClick={resetProgress} className="text-xs text-slate-600 hover:text-slate-400 transition">Reset progress</button>
      </div>

      {/* Filters & mode */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => { setFilter(c); setCurrentIndex(0); setSelected(null); setRevealed(false) }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                filter === c
                  ? 'bg-cyan-700 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['study', 'challenge'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setCurrentIndex(0); setSelected(null); setRevealed(false) }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition capitalize ${
                mode === m ? 'bg-violet-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {m === 'challenge' ? '🎲 Challenge (random)' : '📖 Study (ordered)'}
            </button>
          ))}
        </div>
      </div>

      {/* Score bar */}
      {attempted > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="text-xs text-slate-400 shrink-0">
            <span className="text-emerald-400 font-bold">{score.correct}</span> correct ·{' '}
            <span className="text-red-400 font-bold">{score.wrong}</span> wrong ·{' '}
            <span className="text-slate-400">{pct}%</span>
          </div>
        </div>
      )}

      {/* Question card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600 bg-slate-800/60 px-2 py-1 rounded-full">{q.category}</span>
            <span className={`text-[10px] px-2 py-1 rounded-full ${
              q.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-950/40'
              : q.difficulty === 'Medium' ? 'text-amber-400 bg-amber-950/40'
              : 'text-red-400 bg-red-950/40'
            }`}>{q.difficulty}</span>
          </div>
          <span className="text-xs text-slate-600">{currentIndex + 1} / {questions.length}</span>
        </div>

        <p className="text-base font-medium text-slate-100 leading-relaxed">{q.question}</p>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600'
            if (revealed) {
              if (i === q.correct) style = 'border-emerald-600 bg-emerald-950/30 text-emerald-200'
              else if (i === selected && i !== q.correct) style = 'border-red-600 bg-red-950/30 text-red-300'
              else style = 'border-slate-800 bg-slate-950/40 text-slate-600'
            } else if (selected === i) {
              style = 'border-cyan-600 bg-cyan-950/30 text-cyan-200'
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-left transition-all ${style} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className="font-mono text-slate-600 mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Reveal button */}
        {!revealed && (
          <button
            onClick={handleReveal}
            disabled={selected === null}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition ${
              selected !== null
                ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            Reveal Answer
          </button>
        )}

        {/* Explanation */}
        {revealed && (
          <div className="space-y-3">
            <div className={`rounded-xl border p-4 ${
              selected === q.correct
                ? 'border-emerald-800/60 bg-emerald-950/20'
                : 'border-red-800/60 bg-red-950/20'
            }`}>
              <div className={`text-xs font-bold mb-1 ${selected === q.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                {selected === q.correct ? '✓ Correct!' : '✕ Incorrect'}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
            </div>

            {/* Why other options are wrong */}
            {q.why_wrong && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-[11px] uppercase tracking-widest text-slate-600 mb-2">Why the other options are wrong</div>
                <div className="space-y-1.5">
                  {q.why_wrong.map((w, i) => w && i !== q.correct && (
                    <div key={i} className="flex gap-2 text-xs text-slate-400">
                      <span className="text-slate-600 font-mono shrink-0">{String.fromCharCode(65 + i)}.</span>
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition ml-auto"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
