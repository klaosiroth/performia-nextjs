'use client'

import { useState } from 'react'
import HeroSection from '@/components/employee/hero-section'
import type { EmployeeLang } from '@/lib/employee-tr'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

// Placeholder profile until Supabase data is wired end-to-end
const MOCK_PROFILE: Profile = {
  id:              'mock',
  name_th:         'สมชาย ใจดี',
  name_en:         'Somchai Jaidee',
  dept:            'Marketing',
  position:        null,
  role:            'employee',
  org_id:          null,
  credits_annual:  20,
  credits_used:    8,
  created_at:      new Date().toISOString(),
}

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
      <HeroSection profile={MOCK_PROFILE} latestAssessment={null} lang={lang} />
    </div>
  )
}
