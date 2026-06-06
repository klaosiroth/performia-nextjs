'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle, MapPin, Monitor, Laptop } from 'lucide-react'
import { et } from '@/lib/employee-tr'
import type { EmployeeLang } from '@/lib/employee-tr'
import type { Database } from '@/lib/supabase/types'
import type { PillarKey } from '@/tokens/pillars'

type ActivityRow = Database['public']['Tables']['activities']['Row']
type SlotRow     = Database['public']['Tables']['activity_slots']['Row']
type BookingRow  = Database['public']['Tables']['bookings']['Row']

export type BookingWithDetails = BookingRow & {
  activity_slots: (SlotRow & { activities: ActivityRow }) | null
}

interface Props {
  bookings: BookingWithDetails[]
  lang:     EmployeeLang
}

const PILLAR_BG: Record<PillarKey, string> = {
  Mind:       '#EEF8FF',
  Body:       '#DCFCE7',
  Money:      '#FEF9C3',
  Growth:     '#F3E8FF',
  Social:     '#FFE4E6',
  WorkDesign: '#F1F5F9',
}

const TH_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
const EN_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatSlot(startsAt: string, durationMin: number, lang: EmployeeLang): string {
  const start  = new Date(startsAt)
  const end    = new Date(start.getTime() + durationMin * 60_000)
  const months = lang === 'th' ? TH_MONTHS : EN_MONTHS
  const pad    = (n: number) => String(n).padStart(2, '0')
  return `${start.getDate()} ${months[start.getMonth()]} ${start.getFullYear()} · ${pad(start.getHours())}:${pad(start.getMinutes())}–${pad(end.getHours())}:${pad(end.getMinutes())}`
}

function FormatRow({ format }: { format: string }) {
  const iconStyle = { color: '#10D5D2', flexShrink: 0 as const }
  const rowStyle  = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#52627A' } as const
  if (format === 'online')   return <div style={rowStyle}><Monitor  size={12} style={iconStyle} />Online</div>
  if (format === 'inPerson') return <div style={rowStyle}><MapPin   size={12} style={iconStyle} />Onsite</div>
  return                            <div style={rowStyle}><Laptop   size={12} style={iconStyle} />Hybrid</div>
}

export default function BookingsSection({ bookings, lang }: Props) {
  const [hovered,    setHovered]    = useState<string | null>(null)
  const [btnHovered, setBtnHovered] = useState<string | null>(null)

  if (bookings.length === 0) return null

  return (
    <section className="fu d5">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {et(lang, 'book.title')}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            {et(lang, 'book.sub')}
          </div>
        </div>
        <Link
          href="/marketplace"
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-aqua)', textDecoration: 'none', whiteSpace: 'nowrap', marginTop: 3 }}
          onMouseEnter={e => { e.currentTarget.style.color = '#0ab8b5' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-aqua)' }}
        >
          {et(lang, 'book.link')}
        </Link>
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {bookings.map(booking => {
          const slot     = booking.activity_slots
          const activity = slot?.activities
          if (!slot || !activity) return null

          const title   = lang === 'th' ? activity.title_th : activity.title_en
          const dateStr = formatSlot(slot.starts_at, activity.duration, lang)
          const bg      = PILLAR_BG[activity.pillar] ?? '#EEF8FF'
          const isHov   = hovered    === booking.id
          const isBtnH  = btnHovered === booking.id

          return (
            <div
              key={booking.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 20,
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'box-shadow .2s',
                boxShadow: isHov ? '0 4px 20px rgba(6,24,73,0.08)' : 'none',
              }}
              onMouseEnter={() => setHovered(booking.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Thumbnail */}
              {activity.cover_image
                ? <img src={activity.cover_image} alt={title} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 56, height: 56, borderRadius: 12, background: bg, flexShrink: 0 }} />
              }

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#52627A' }}>
                    <Calendar size={12} style={{ color: '#10D5D2', flexShrink: 0 }} />
                    {dateStr}
                  </div>
                  <FormatRow format={activity.format} />
                </div>
              </div>

              {/* Right: status + manage */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: '#DCFCE7', color: '#15803D' }}>
                  <CheckCircle size={10} />
                  {et(lang, 'book.status')}
                </span>
                <button
                  style={{
                    height: 36,
                    borderRadius: 10,
                    padding: '0 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    border: '1px solid var(--color-border)',
                    background: isBtnH ? 'var(--color-bg-soft)' : 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'background .16s',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={() => setBtnHovered(booking.id)}
                  onMouseLeave={() => setBtnHovered(null)}
                >
                  {et(lang, 'book.manage')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
