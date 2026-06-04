export type { LoginLang as EmployeeLang } from '@/lib/login-tr'
import type { LoginLang } from '@/lib/login-tr'

type Lang = LoginLang

const TR = {
  th: {
    'nav.section':      'Menu',
    'nav.home':         'หน้าหลัก',
    'nav.assessment':   'แบบประเมิน',
    'nav.profile':      'โปรไฟล์ PERFORM-6™',
    'nav.activities':   'กิจกรรม',
    'nav.credits':      'กระเป๋าเครดิต',
    'nav.bookings':     'การจองของฉัน',
    'nav.feedback':     'ความคิดเห็น',
    'nav.help':         'ศูนย์ช่วยเหลือ',
    'page.home':        'My Performia',
    'page.assessment':  'แบบประเมิน',
    'page.profile':     'โปรไฟล์ PERFORM-6™',
    'page.marketplace': 'กิจกรรม',
    'search.ph':        'ค้นหากิจกรรม...',
    // Hero
    'hero.greeting':    'สวัสดี คุณ',
    'hero.sub':         'วันนี้คุณอยากดูแลตัวเองด้านไหน',
    'hero.cta1':        'ดูกิจกรรมที่เหมาะกับฉัน',
    'hero.cta2':        'ดูโปรไฟล์ของฉัน',
    'hero.credits.lbl': 'เครดิตคงเหลือ',
    'hero.bookings.lbl':'กิจกรรมที่จอง',
    'hero.bookings.unit':'รายการ',
    // Pillar short labels (strip)
    'pillar.mind':      'ใจ',
    'pillar.body':      'กาย',
    'pillar.social':    'สังคม',
    'pillar.growth':    'การเติบโต',
    'pillar.work':      'การทำงาน',
    'pillar.money':     'การเงิน',
  },
  en: {
    'nav.section':      'Menu',
    'nav.home':         'Home',
    'nav.assessment':   'Assessment',
    'nav.profile':      'My PERFORM-6™ Profile',
    'nav.activities':   'Activities',
    'nav.credits':      'Credit Wallet',
    'nav.bookings':     'My Bookings',
    'nav.feedback':     'Feedback',
    'nav.help':         'Help Center',
    'page.home':        'My Performia',
    'page.assessment':  'Assessment',
    'page.profile':     'PERFORM-6™ Profile',
    'page.marketplace': 'Activities',
    'search.ph':        'Search activities...',
    // Hero
    'hero.greeting':    'Hello, ',
    'hero.sub':         'What would you like to take care of today?',
    'hero.cta1':        'View Recommended Activities',
    'hero.cta2':        'View My Profile',
    'hero.credits.lbl': 'Credits Remaining',
    'hero.bookings.lbl':'Upcoming Bookings',
    'hero.bookings.unit':'activities',
    // Pillar short labels (strip)
    'pillar.mind':      'Mind',
    'pillar.body':      'Body',
    'pillar.social':    'Social',
    'pillar.growth':    'Growth',
    'pillar.work':      'Work',
    'pillar.money':     'Money',
  },
} as const

export type EmployeeTrKey = keyof typeof TR.en

export function et(lang: Lang, key: EmployeeTrKey): string {
  const map = TR[lang] as Record<string, string>
  return map[key] ?? (TR.en as Record<string, string>)[key] ?? key
}

const MONTH_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']
const MONTH_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function monthYear(lang: Lang): string {
  const d = new Date()
  const months = lang === 'th' ? MONTH_TH : MONTH_EN
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}
