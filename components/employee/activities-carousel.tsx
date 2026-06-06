'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Monitor, MapPin, Laptop } from 'lucide-react'
import { et } from '@/lib/employee-tr'
import type { EmployeeLang } from '@/lib/employee-tr'
import type { Database } from '@/lib/supabase/types'
import type { PillarKey } from '@/tokens/pillars'

type Activity = Database['public']['Tables']['activities']['Row']

interface Props {
  activities: Activity[]
  lang:       EmployeeLang
}

const PILLAR_CHIP: Record<PillarKey, { bg: string; color: string; labelTh: string; labelEn: string }> = {
  Mind:       { bg: '#EEF8FF', color: '#1D4ED8', labelTh: 'ใจ · Mind',            labelEn: 'Mind'        },
  Body:       { bg: '#DCFCE7', color: '#15803D', labelTh: 'กาย · Body',            labelEn: 'Body'        },
  Money:      { bg: '#FEF9C3', color: '#92400E', labelTh: 'การเงิน · Money',       labelEn: 'Money'       },
  Growth:     { bg: '#F3E8FF', color: '#6D28D9', labelTh: 'การเติบโต · Growth',    labelEn: 'Growth'      },
  Social:     { bg: '#FFE4E6', color: '#BE123C', labelTh: 'สังคม · Social',        labelEn: 'Social'      },
  WorkDesign: { bg: '#F1F5F9', color: '#334155', labelTh: 'การทำงาน · Work',       labelEn: 'Work Design' },
}

const PILLAR_IMG_BG: Record<PillarKey, string> = {
  Mind:       '#EEF8FF',
  Body:       '#DCFCE7',
  Money:      '#FEF9C3',
  Growth:     '#F3E8FF',
  Social:     '#FFE4E6',
  WorkDesign: '#F1F5F9',
}

function FormatBadge({ format }: { format: string }) {
  const style = { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(6,24,73,0.78)', color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, backdropFilter: 'blur(4px)' } as const
  if (format === 'online')   return <span style={style}><Monitor  size={10} />Online</span>
  if (format === 'inPerson') return <span style={style}><MapPin   size={10} />Onsite</span>
  return                            <span style={style}><Laptop   size={10} />Hybrid</span>
}

export default function ActivitiesCarousel({ activities, lang }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [ctaHov,  setCtaHov]  = useState<string | null>(null)

  if (activities.length === 0) return null

  return (
    <section className="fu d4">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {et(lang, 'act.title')}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            {et(lang, 'act.sub')}
          </div>
        </div>
        <Link
          href="/marketplace"
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-aqua)', textDecoration: 'none', whiteSpace: 'nowrap', marginTop: 3 }}
          onMouseEnter={e => { e.currentTarget.style.color = '#0ab8b5' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-aqua)' }}
        >
          {et(lang, 'act.link')}
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div className="hscroll">
        {activities.map(activity => {
          const chip    = PILLAR_CHIP[activity.pillar]
          const imgBg   = PILLAR_IMG_BG[activity.pillar] ?? '#EEF8FF'
          const title   = lang === 'th' ? activity.title_th : activity.title_en
          const desc    = lang === 'th' ? activity.desc_th  : activity.desc_en
          const isHov   = hovered === activity.id
          const isCtaH  = ctaHov  === activity.id

          return (
            <div
              key={activity.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 20,
                overflow: 'hidden',
                minWidth: 256,
                maxWidth: 256,
                flexShrink: 0,
                transition: 'box-shadow .22s, transform .22s',
                boxShadow: isHov ? '0 8px 28px rgba(6,24,73,0.12)' : 'var(--shadow-card)',
                transform:  isHov ? 'translateY(-3px)' : 'none',
              }}
              onMouseEnter={() => setHovered(activity.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Image */}
              <div style={{ position: 'relative' }}>
                {activity.cover_image
                  ? <img src={activity.cover_image} alt={title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                  : <div style={{ width: '100%', height: 160, background: imgBg }} />
                }
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <FormatBadge format={activity.format} />
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <span style={{ background: 'rgba(6,24,73,0.78)', color: '#10D5D2', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                    {activity.credits} {lang === 'th' ? 'เครดิต' : 'credits'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', background: chip.bg, color: chip.color, padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                  {lang === 'th' ? chip.labelTh : chip.labelEn}
                </span>

                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                  {title}
                </div>

                {desc && (
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {desc}
                  </p>
                )}

                {/* Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-secondary)' }}>
                    <Clock size={11} />
                    {activity.duration} min
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-secondary)' }}>
                    {activity.format === 'online'   && <Monitor  size={11} />}
                    {activity.format === 'inPerson' && <MapPin   size={11} />}
                    {activity.format === 'hybrid'   && <Laptop   size={11} />}
                    {activity.format === 'online'   ? (lang === 'th' ? 'ออนไลน์' : 'Online') : activity.format === 'inPerson' ? (lang === 'th' ? 'Onsite' : 'Onsite') : 'Hybrid'}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/marketplace/${activity.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 38,
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                    transition: 'background .18s',
                    background: isCtaH ? 'var(--color-navy-dark)' : 'var(--color-navy)',
                    color: '#fff',
                  }}
                  onMouseEnter={() => setCtaHov(activity.id)}
                  onMouseLeave={() => setCtaHov(null)}
                >
                  {et(lang, 'act.cta')}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
