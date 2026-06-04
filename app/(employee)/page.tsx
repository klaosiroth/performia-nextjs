'use client'

import { useState } from 'react'
import HeroSection         from '@/components/employee/hero-section'
import CreditSummaryCard   from '@/components/employee/credit-summary-card'
import WellbeingSnapshot, { type PillarStatus } from '@/components/employee/wellbeing-snapshot'
import RecommendedFocus    from '@/components/employee/recommended-focus'
import QuickActions        from '@/components/employee/quick-actions'
import type { EmployeeLang } from '@/lib/employee-tr'
import type { Database }     from '@/lib/supabase/types'
import type { PillarKey } from '@/tokens/pillars'

type Profile = Database['public']['Tables']['profiles']['Row']

// ── Mock data (replaced when Supabase data fetching is wired) ──
const MOCK_PROFILE: Profile = {
  id:             'mock',
  name_th:        'สมชาย ใจดี',
  name_en:        'Somchai Jaidee',
  dept:           'Marketing',
  position:       null,
  role:           'employee',
  org_id:         null,
  credits_annual: 20,
  credits_used:   8,
  created_at:     new Date().toISOString(),
}

const MOCK_PILLARS: PillarStatus[] = [
  { pillar: 'Mind',       score: 82, zone: 'performing' },
  { pillar: 'Body',       score: 78, zone: 'performing' },
  { pillar: 'Social',     score: 70, zone: 'stable'     },
  { pillar: 'Growth',     score: 45, zone: 'watch'      },
  { pillar: 'WorkDesign', score: 75, zone: 'performing' },
  { pillar: 'Money',      score: 68, zone: 'stable'     },
]

const MOCK_FOCUS: PillarKey[] = ['Mind', 'Body', 'Growth']

export default function EmployeeHomePage() {
  const [lang] = useState<EmployeeLang>(() => {
    if (typeof window === 'undefined') return 'th'
    try {
      const saved = localStorage.getItem('performia_lang')
      if (saved === 'en' || saved === 'th') return saved
    } catch { /* ignore */ }
    return 'th'
  })

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero */}
      <HeroSection profile={MOCK_PROFILE} latestAssessment={null} lang={lang} />

      {/* Credit + Snapshot row */}
      <div className="dash-credit-row fu d1" style={{ display: 'grid', gridTemplateColumns: '288px 1fr', gap: 24 }}>
        <CreditSummaryCard annual={MOCK_PROFILE.credits_annual} used={MOCK_PROFILE.credits_used} lang={lang} />
        <WellbeingSnapshot pillars={MOCK_PILLARS} lang={lang} />
      </div>

      {/* Recommended Focus */}
      <RecommendedFocus pillars={MOCK_FOCUS} lang={lang} />

      {/* Quick Actions */}
      <QuickActions lang={lang} />
    </div>
  )
}
