'use client'

import { useState } from 'react'
import type { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { et } from '@/lib/employee-tr'
import type { EmployeeLang, EmployeeTrKey } from '@/lib/employee-tr'
import { QUESTIONS } from '@/lib/assessment/core'
import type { Answers } from '@/lib/assessment/core'
import { PILLAR_KEYS } from '@/tokens/pillars'
import type { PillarKey } from '@/tokens/pillars'

type Screen = 'intro' | 'privacy' | 'questions' | 'result'

function tpl(s: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.split(`{${k}}`).join(String(v)),
    s,
  )
}

const PILLAR_TR: Record<PillarKey, EmployeeTrKey> = {
  Mind:       'assess.pillar.Mind',
  Body:       'assess.pillar.Body',
  Money:      'assess.pillar.Money',
  Social:     'assess.pillar.Social',
  Growth:     'assess.pillar.Growth',
  WorkDesign: 'assess.pillar.WorkDesign',
}

const LIKERT_KEYS: EmployeeTrKey[] = [
  'assess.likert.1',
  'assess.likert.2',
  'assess.likert.3',
  'assess.likert.4',
  'assess.likert.5',
]

const PILLAR_SVG: Record<PillarKey, ReactElement> = {
  Mind: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3a6 6 0 00-6 6c0 2.025.98 3.823 2.5 4.97V17h7v-3.03A6.003 6.003 0 0018 9a6 6 0 00-6-6z"/>
    </svg>
  ),
  Body: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  ),
  Money: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  Social: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  ),
  Growth: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
    </svg>
  ),
  WorkDesign: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
    </svg>
  ),
}

// ─── Main Page (state machine) ────────────────────────────────────────────────

export default function AssessmentPage() {
  const router = useRouter()

  const [lang] = useState<EmployeeLang>(() => {
    if (typeof window === 'undefined') return 'th'
    try {
      const saved = localStorage.getItem('performia_lang')
      if (saved === 'en' || saved === 'th') return saved
    } catch { /* ignore */ }
    return 'th'
  })

  const [screen,       setScreen]       = useState<Screen>('intro')
  const [currentIdx,   setCurrentIdx]   = useState(0)
  const [answers,      setAnswers]       = useState<Answers>({})
  const [assessmentId, setAssessmentId] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVal,      setShowVal]      = useState(false)

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setShowVal(false)
  }

  const handleNext = async () => {
    const q = QUESTIONS[currentIdx]
    if (answers[q.id] === undefined) {
      setShowVal(true)
      return
    }
    if (currentIdx === QUESTIONS.length - 1) {
      setIsSubmitting(true)
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, assessmentId }),
      })
      setIsSubmitting(false)
      if (res.ok) {
        const data = await res.json() as { id: string }
        if (!assessmentId) setAssessmentId(data.id)
        setScreen('result')
      }
    } else {
      setCurrentIdx(i => i + 1)
      setShowVal(false)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1)
      setShowVal(false)
    }
  }

  const handleSaveExit = async () => {
    const res = await fetch('/api/assessment/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, assessmentId }),
    })
    if (res.ok) {
      const data = await res.json() as { id: string }
      if (!assessmentId && data.id) setAssessmentId(data.id)
    }
    router.push('/')
  }

  if (screen === 'intro') {
    return <IntroScreen lang={lang} onStart={() => setScreen('privacy')} />
  }
  if (screen === 'privacy') {
    return (
      <PrivacyScreen
        lang={lang}
        onStart={() => setScreen('questions')}
        onBack={() => setScreen('intro')}
      />
    )
  }
  if (screen === 'questions') {
    return (
      <QuestionFlow
        lang={lang}
        currentIdx={currentIdx}
        answers={answers}
        showVal={showVal}
        isSubmitting={isSubmitting}
        onSelect={handleSelect}
        onNext={handleNext}
        onPrev={handlePrev}
        onSaveExit={handleSaveExit}
      />
    )
  }

  return <div style={{ padding: '40px', textAlign: 'center' }}>Result Summary Stub</div>
}

// ─── IntroScreen ──────────────────────────────────────────────────────────────

function IntroScreen({ lang, onStart }: { lang: EmployeeLang; onStart: () => void }) {
  const [hov, setHov] = useState(false)

  const stats = [
    { val: et(lang, 'assess.intro.stat.q'), lbl: et(lang, 'assess.intro.stat.q.lbl') },
    { val: et(lang, 'assess.intro.stat.t'), lbl: et(lang, 'assess.intro.stat.t.lbl') },
  ]

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px 60px' }}>
      <div className="fu" style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 16, boxShadow: 'var(--shadow-card)', padding: '36px 32px', textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: 'rgba(16,213,210,.08)',
          border: '1.5px solid rgba(16,213,210,.25)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <svg width="24" height="24" fill="none" stroke="var(--color-aqua)" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.4, marginBottom: 10 }}>
          {et(lang, 'assess.intro.title')}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
          {et(lang, 'assess.intro.sub')}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.lbl} style={{
              flex: 1, maxWidth: 140, padding: '12px 16px', borderRadius: 12,
              background: 'var(--color-bg-page)', border: '1px solid var(--color-border)',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: '100%', padding: '13px 28px', borderRadius: 10, border: 'none',
            background: hov ? 'var(--color-navy-dark)' : 'var(--color-navy)',
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background .18s', fontFamily: 'var(--font-sans)',
          }}
        >
          {et(lang, 'assess.intro.cta')}
          <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </main>
  )
}

// ─── PrivacyScreen ────────────────────────────────────────────────────────────

function PrivacyScreen({
  lang, onStart, onBack,
}: { lang: EmployeeLang; onStart: () => void; onBack: () => void }) {
  const [hovCta,  setHovCta]  = useState(false)
  const [hovBack, setHovBack] = useState(false)

  const pointKeys: EmployeeTrKey[] = ['assess.priv.pt1', 'assess.priv.pt2', 'assess.priv.pt3']

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div className="fu" style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 16, boxShadow: 'var(--shadow-card)', padding: '28px 28px 24px',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: 'rgba(16,213,210,.08)',
          border: '1.5px solid rgba(16,213,210,.25)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <svg width="22" height="22" fill="none" stroke="var(--color-aqua)" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.5, marginBottom: 8 }}>
          {et(lang, 'assess.priv.title')}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          {et(lang, 'assess.priv.body')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {pointKeys.map(key => (
            <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,213,210,.12)',
                border: '1.5px solid rgba(16,213,210,.3)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
              }}>
                <svg width="9" height="9" viewBox="0 0 20 20" fill="var(--color-aqua)">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {et(lang, key)}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          onMouseEnter={() => setHovCta(true)}
          onMouseLeave={() => setHovCta(false)}
          style={{
            width: '100%', padding: '13px 28px', borderRadius: 10, border: 'none',
            background: hovCta ? 'var(--color-navy-dark)' : 'var(--color-navy)',
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 10, transition: 'background .18s', fontFamily: 'var(--font-sans)',
          }}
        >
          {et(lang, 'assess.priv.cta')}
        </button>

        <button
          onClick={onBack}
          onMouseEnter={() => setHovBack(true)}
          onMouseLeave={() => setHovBack(false)}
          style={{
            width: '100%', padding: '10px 20px', borderRadius: 10,
            background: hovBack ? 'var(--color-bg-page)' : 'transparent',
            color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            border: '1.5px solid var(--color-border)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background .18s', fontFamily: 'var(--font-sans)',
          }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          {et(lang, 'assess.priv.back')}
        </button>
      </div>
    </main>
  )
}

// ─── QuestionFlow ─────────────────────────────────────────────────────────────

interface QuestionFlowProps {
  lang:         EmployeeLang
  currentIdx:   number
  answers:      Answers
  showVal:      boolean
  isSubmitting: boolean
  onSelect:     (id: string, value: number) => void
  onNext:       () => void
  onPrev:       () => void
  onSaveExit:   () => void
}

function QuestionFlow({
  lang, currentIdx, answers, showVal, isSubmitting,
  onSelect, onNext, onPrev, onSaveExit,
}: QuestionFlowProps) {
  const [hovCard, setHovCard] = useState<{ qIdx: number; v: number } | null>(null)
  const [hovBack, setHovBack] = useState(false)
  const [hovSave, setHovSave] = useState(false)
  const [hovNext, setHovNext] = useState(false)

  const q         = QUESTIONS[currentIdx]
  const total     = QUESTIONS.length
  const answered  = Object.keys(answers).length
  const pct       = Math.round((answered / total) * 100)
  const isLast    = currentIdx === total - 1
  const sel       = answers[q.id] !== undefined ? answers[q.id] : null
  const pillarIdx = PILLAR_KEYS.indexOf(q.pillar)

  const mins     = Math.ceil(((total - currentIdx) / total) * 8)
  const timeText = mins <= 1
    ? et(lang, 'assess.time.one')
    : tpl(et(lang, 'assess.time.plural'), { n: mins })

  const qLabel   = tpl(et(lang, 'assess.q.label'), { pillar: et(lang, PILLAR_TR[q.pillar]), n: currentIdx + 1, total })
  const qOfLabel = tpl(et(lang, 'assess.progress.q_of'), { c: currentIdx + 1, t: total })
  const pctLabel = tpl(et(lang, 'assess.progress.pct'), { p: pct })

  const opts = q.type === 'situation' ? (q.opts?.[lang] ?? q.opts?.en ?? []) : null

  return (
    <>
      {/* ── Sticky progress ── */}
      <div style={{
        background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
        padding: '12px 20px', position: 'sticky', top: 72, zIndex: 150,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Pillar pills */}
          <div className="assess-pillar-nav" style={{ marginBottom: 10 }}>
            {PILLAR_KEYS.map((pillar, i) => {
              const state = i < pillarIdx ? 'done' : i === pillarIdx ? 'active' : 'upcoming'
              return (
                <div key={pillar} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 9999, border: '1.5px solid',
                  fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
                  ...(state === 'done'     && { background: 'rgba(16,213,210,.08)', color: 'var(--color-aqua)', borderColor: 'rgba(16,213,210,.3)' }),
                  ...(state === 'active'   && { background: 'var(--color-navy)', color: '#fff', borderColor: 'transparent' }),
                  ...(state === 'upcoming' && { background: 'transparent', color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }),
                }}>
                  {state === 'done' && (
                    <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {state === 'active' && (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-aqua)', display: 'inline-block', flexShrink: 0 }} />
                  )}
                  {et(lang, PILLAR_TR[pillar])}
                </div>
              )
            })}
          </div>

          {/* Progress bar + counters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
              {qOfLabel}
            </span>
            <div style={{ flex: 1, minWidth: 80, height: 6, background: 'var(--color-border)', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`, background: 'var(--color-aqua)',
                borderRadius: 9999, transition: 'width .6s cubic-bezier(.4,0,.2,1)',
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-aqua)', whiteSpace: 'nowrap' }}>
              {pctLabel}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {timeText}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '20px 20px 140px' }}>
        {/* Question card — key triggers slide-up animation on question change */}
        <div key={currentIdx} className="slide-up" style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 16, boxShadow: 'var(--shadow-card)', padding: 20, marginBottom: 14,
        }}>
          {/* Pillar header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, background: 'rgba(16,213,210,.08)',
              border: '1px solid rgba(16,213,210,.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--color-aqua)', flexShrink: 0,
            }}>
              {PILLAR_SVG[q.pillar]}
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              {qLabel}
            </p>
          </div>

          {/* Question text */}
          <h2 style={{ fontSize: 'clamp(16px,3.5vw,20px)', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.6, marginBottom: 16 }}>
            {lang === 'th' ? q.text.th : q.text.en}
          </h2>

          {/* Scale hint */}
          <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '.03em', marginBottom: 14 }}>
            {et(lang, q.type === 'likert' ? 'assess.scale.likert' : 'assess.scale.situation')}
          </p>

          {/* Answer area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup">
            {q.type === 'likert' ? (
              [1, 2, 3, 4, 5].map(v => {
                const isSel = sel === v
                const isHov = hovCard?.qIdx === currentIdx && hovCard?.v === v
                return (
                  <div
                    key={v}
                    role="radio"
                    aria-checked={isSel}
                    tabIndex={0}
                    onClick={() => onSelect(q.id, v)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(q.id, v) } }}
                    onMouseEnter={() => setHovCard({ qIdx: currentIdx, v })}
                    onMouseLeave={() => setHovCard(null)}
                    style={{
                      cursor: 'pointer', padding: '14px 18px', borderRadius: 10,
                      border: `1.5px solid ${isSel || isHov ? 'var(--color-aqua)' : 'var(--color-border)'}`,
                      background: isSel || isHov ? 'rgba(16,213,210,.08)' : 'var(--color-surface)',
                      boxShadow: isSel ? '0 0 0 3px rgba(16,213,210,.12)' : 'none',
                      display: 'flex', alignItems: 'center', gap: 14, transition: 'all .18s ease',
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, transition: 'all .18s',
                      border: `2px solid ${isSel ? 'var(--color-aqua)' : '#B8CCE4'}`,
                      background: isSel ? 'var(--color-aqua)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSel && (
                        <svg width="9" height="9" viewBox="0 0 20 20" fill="white">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: isSel ? 600 : 500, color: isSel ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      {et(lang, LIKERT_KEYS[v - 1])}
                    </span>
                  </div>
                )
              })
            ) : (
              (opts ?? []).map((opt, i) => {
                const v     = i + 1
                const isSel = sel === v
                const isHov = hovCard?.qIdx === currentIdx && hovCard?.v === v
                return (
                  <div
                    key={v}
                    role="radio"
                    aria-checked={isSel}
                    tabIndex={0}
                    onClick={() => onSelect(q.id, v)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(q.id, v) } }}
                    onMouseEnter={() => setHovCard({ qIdx: currentIdx, v })}
                    onMouseLeave={() => setHovCard(null)}
                    style={{
                      cursor: 'pointer', padding: '16px 18px', borderRadius: 10,
                      border: `1.5px solid ${isSel || isHov ? 'var(--color-aqua)' : 'var(--color-border)'}`,
                      background: isSel || isHov ? 'rgba(16,213,210,.08)' : 'var(--color-surface)',
                      boxShadow: isSel ? '0 0 0 3px rgba(16,213,210,.12)' : 'none',
                      transition: 'all .18s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1, transition: 'all .18s',
                        border: `1.5px solid ${isSel ? 'var(--color-aqua)' : '#B8CCE4'}`,
                        background: isSel ? 'var(--color-aqua)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSel && (
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: isSel ? 600 : 500, color: isSel ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                        {opt}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Validation message */}
          {showVal && (
            <div style={{
              marginTop: 12, background: 'rgba(245,158,11,.07)',
              border: '1px solid rgba(245,158,11,.25)', borderRadius: 8,
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="15" height="15" fill="none" stroke="#F59E0B" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              <span style={{ color: '#92400E', fontSize: 13 }}>{et(lang, 'assess.val.required')}</span>
            </div>
          )}
        </div>

        {/* Privacy notice */}
        <div style={{
          background: 'rgba(16,213,210,.08)', border: '1px solid rgba(16,213,210,.22)',
          borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <svg width="15" height="15" fill="none" stroke="var(--color-aqua)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {et(lang, 'assess.priv.inline')}
          </p>
        </div>
      </main>

      {/* ── Bottom bar ── */}
      <div style={{
        position: 'sticky', bottom: 0, zIndex: 100,
        background: 'rgba(248,251,253,.96)', borderTop: '1px solid var(--color-border)',
        padding: '12px 20px 20px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 10 }}>
          {/* Back */}
          <button
            onClick={onPrev}
            disabled={currentIdx === 0}
            onMouseEnter={() => setHovBack(true)}
            onMouseLeave={() => setHovBack(false)}
            style={{
              flexShrink: 0, padding: '11px 16px', borderRadius: 10,
              background: hovBack && currentIdx > 0 ? 'var(--color-bg-page)' : 'transparent',
              color: currentIdx === 0 ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
              border: '1.5px solid var(--color-border)', fontSize: 14, fontWeight: 600,
              cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              opacity: currentIdx === 0 ? 0.35 : 1,
              transition: 'background .18s', fontFamily: 'var(--font-sans)',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            {et(lang, 'assess.btn.back')}
          </button>

          {/* Save & Exit */}
          <button
            onClick={onSaveExit}
            onMouseEnter={() => setHovSave(true)}
            onMouseLeave={() => setHovSave(false)}
            style={{
              flexShrink: 0, padding: '11px 14px', borderRadius: 10,
              background: hovSave ? 'var(--color-bg-page)' : 'transparent',
              color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'background .18s', fontFamily: 'var(--font-sans)',
            }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            <span style={{ whiteSpace: 'nowrap' }}>{et(lang, 'assess.btn.save_exit')}</span>
          </button>

          {/* Next / Submit */}
          <button
            onClick={onNext}
            disabled={isSubmitting}
            onMouseEnter={() => setHovNext(true)}
            onMouseLeave={() => setHovNext(false)}
            style={{
              flex: 1, padding: '11px 20px', borderRadius: 10, border: 'none',
              background: hovNext && !isSubmitting ? 'var(--color-navy-dark)' : 'var(--color-navy)',
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'background .18s', fontFamily: 'var(--font-sans)',
            }}
          >
            {isSubmitting ? (
              <>
                {et(lang, 'assess.btn.submitting')}
                <svg className="spin-anim" width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M12 3a9 9 0 109 9"/>
                </svg>
              </>
            ) : isLast ? (
              <>
                {et(lang, 'assess.btn.submit')}
                <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </>
            ) : (
              <>
                {et(lang, 'assess.btn.next')}
                <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 10 }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{
              height: 5, borderRadius: 9999, transition: 'all .3s cubic-bezier(.4,0,.2,1)',
              width: i === currentIdx ? 18 : 5,
              background: i < currentIdx
                ? 'var(--color-aqua)'
                : i === currentIdx
                  ? 'var(--color-navy)'
                  : 'var(--color-border)',
            }} />
          ))}
        </div>
      </div>
    </>
  )
}
