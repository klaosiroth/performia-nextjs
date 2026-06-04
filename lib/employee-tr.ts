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
    // CreditSummaryCard
    'credit.title':     'เครดิตคงเหลือ',
    'credit.fy':        'ปีงบประมาณ',
    'credit.chip':      'Active',
    'credit.rem':       'คงเหลือ',
    'credit.used':      'ใช้ไปแล้ว',
    'credit.total':     'ทั้งหมด',
    'credit.micro':     'ใช้เครดิตของคุณกับกิจกรรมที่ช่วยดูแลตัวเองได้ตลอดปี',
    'credit.cta':       'ใช้เครดิตกับกิจกรรม',
    // WellbeingSnapshot
    'snap.title':       'ภาพรวมของคุณ',
    'snap.sub':         'PERFORM-6™ Wellbeing Snapshot',
    'snap.link':        'ดูโปรไฟล์เต็ม →',
    'snap.footer':      'ดูรายละเอียดโปรไฟล์ทั้ง 6 มิติของคุณ',
    'snap.cta':         'ดูโปรไฟล์ PERFORM-6™',
    // RecommendedFocus
    'focus.title':      'เสาที่แนะนำสำหรับคุณเดือนนี้',
    'focus.sub':        'จากโปรไฟล์ PERFORM-6™ ของคุณ',
    'focus.link':       'ดูทั้งหมด →',
    'focus.cta':        'ดูกิจกรรม',
    'focus.unit':       'กิจกรรม',
    // QuickActions
    'quick.title':      'ทางลัด',
    'quick.profile':    'โปรไฟล์ของฉัน',
    'quick.credits':    'เครดิตของฉัน',
    'quick.activities': 'กิจกรรมของฉัน',
    'quick.assessment': 'แบบประเมิน',
    'quick.help':       'ศูนย์ช่วยเหลือ',
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
    // CreditSummaryCard
    'credit.title':     'Credits Remaining',
    'credit.fy':        'FY',
    'credit.chip':      'Active',
    'credit.rem':       'Remaining',
    'credit.used':      'Used',
    'credit.total':     'Total',
    'credit.micro':     'Use your credits throughout the year for activities that support your wellbeing.',
    'credit.cta':       'Use Credits for Activities',
    // WellbeingSnapshot
    'snap.title':       'Your Wellbeing Snapshot',
    'snap.sub':         'PERFORM-6™ Wellbeing Snapshot',
    'snap.link':        'View Full Profile →',
    'snap.footer':      'View all 6 dimensions of your wellbeing profile.',
    'snap.cta':         'View PERFORM-6™ Profile',
    // RecommendedFocus
    'focus.title':      'Recommended Focus This Month',
    'focus.sub':        'Based on your PERFORM-6™ profile',
    'focus.link':       'View All →',
    'focus.cta':        'View Activities',
    'focus.unit':       'activities',
    // QuickActions
    'quick.title':      'Quick Actions',
    'quick.profile':    'My Profile',
    'quick.credits':    'My Credits',
    'quick.activities': 'My Activities',
    'quick.assessment': 'Assessment',
    'quick.help':       'Help Center',
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
