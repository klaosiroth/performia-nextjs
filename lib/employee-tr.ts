export type EmployeeLang = 'th' | 'en'

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
  },
} as const

export type EmployeeTrKey = keyof typeof TR.en

export function et(lang: EmployeeLang, key: EmployeeTrKey): string {
  const map = TR[lang] as Record<string, string>
  return map[key] ?? (TR.en as Record<string, string>)[key] ?? key
}

const MONTH_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']
const MONTH_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function monthYear(lang: EmployeeLang): string {
  const d = new Date()
  const months = lang === 'th' ? MONTH_TH : MONTH_EN
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}
