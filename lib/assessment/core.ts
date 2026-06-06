import { PILLAR_KEYS } from '@/tokens/pillars'
import type { PillarKey, ZoneKey } from '@/tokens/pillars'

export type QuestionType = 'likert' | 'situation'

export interface Question {
  id:    string
  pillar: PillarKey
  type:   QuestionType
  text:   { th: string; en: string }
  opts?:  { th: string[]; en: string[] }
}

export type Answers = Record<string, number>

export interface Scores {
  pillars: Record<PillarKey, number>
  overall: number
}

export interface Persona {
  min:  number
  icon: string
  name: string
  desc: { th: string; en: string }
}

export const QUESTIONS: Question[] = [
  {
    id: '1', pillar: 'Mind', type: 'likert',
    text: {
      th: 'ฉันสามารถฟื้นตัวจากความเครียดหรือแรงกดดันในการทำงานได้',
      en: 'I can recover from stress or pressure at work.',
    },
  },
  {
    id: '2', pillar: 'Body', type: 'likert',
    text: {
      th: 'ฉันมีพลังงานเพียงพอสำหรับการทำงานในแต่ละวัน',
      en: 'I have enough energy for my daily work.',
    },
  },
  {
    id: '3', pillar: 'Money', type: 'situation',
    text: {
      th: 'เมื่อนึกถึงเรื่องการเงิน คุณรู้สึกอย่างไร?',
      en: 'When you think about your finances, you feel:',
    },
    opts: {
      th: ['วิตกกังวลและไม่มั่นใจ', 'พอรับได้ แต่ยังกังวลบ้าง', 'เป็นกลาง ดูแลได้แต่อยากพัฒนา', 'มั่นใจและจัดการได้ดี', 'มั่นใจมาก มีแผนชัดเจน'],
      en: ['Anxious and uncertain', 'Manageable but still worried', 'Neutral, handling it but want to improve', 'Confident and in control', 'Very confident with a clear plan'],
    },
  },
  {
    id: '4', pillar: 'Social', type: 'likert',
    text: {
      th: 'ฉันรู้สึกเป็นส่วนหนึ่งของทีมและองค์กร',
      en: 'I feel a sense of belonging with my team and organization.',
    },
  },
  {
    id: '5', pillar: 'Growth', type: 'likert',
    text: {
      th: 'ฉันมองเห็นโอกาสในการเรียนรู้และเติบโตในงานของฉัน',
      en: 'I see opportunities to learn and grow in my work.',
    },
  },
  {
    id: '6', pillar: 'WorkDesign', type: 'situation',
    text: {
      th: 'ในสัปดาห์ที่ผ่านมา คุณรู้สึกกับงานอย่างไร?',
      en: 'In the past week, how did you feel about your work?',
    },
    opts: {
      th: ['หมดแรงและท่วมท้นมาก', 'เครียด แต่พอผ่านได้', 'โอเค แต่รู้สึกซ้ำซากจำเจ', 'มีพลังและโฟกัสดี', 'มีชีวิตชีวา รู้สึก flow'],
      en: ['Exhausted and overwhelmed', 'Stressed but getting through', 'Okay but feeling stuck in a routine', 'Energized and focused', 'In flow — meaningful and alive'],
    },
  },
]

export const PERSONAS: Persona[] = [
  {
    min: 80, icon: '⚡', name: 'High Performer',
    desc: {
      th: 'คุณมีพลังงานสูง มีความสมดุลในทุกด้าน และพร้อมสำหรับความท้าทายใหม่',
      en: 'You have high energy, well-balanced across all dimensions, and ready for new challenges.',
    },
  },
  {
    min: 65, icon: '🌱', name: 'Growth Seeker',
    desc: {
      th: 'คุณมีรากฐานที่มั่นคง กำลังเติบโต และยังมีพื้นที่ให้พัฒนาในบางด้าน',
      en: 'You have a solid foundation and are growing, with some areas still developing.',
    },
  },
  {
    min: 50, icon: '⚖️', name: 'Steady Balancer',
    desc: {
      th: 'คุณจัดการได้ แต่บางด้านต้องการการดูแลเพิ่มเพื่อให้มีพลังงานมากขึ้น',
      en: "You're managing well but some dimensions need attention to unlock more energy.",
    },
  },
  {
    min: 35, icon: '🔥', name: 'Silent Burnout',
    desc: {
      th: 'คุณทำงานหนักโดยอาจไม่รู้ตัว หยุดพักและดูแลตัวเองก่อนจะเป็นสิ่งสำคัญ',
      en: 'You may be running hard without realising it. Rest and recovery are important steps forward.',
    },
  },
  {
    min: 0, icon: '🆘', name: 'High Pressure Under Stress',
    desc: {
      th: 'คุณกำลังเผชิญกับแรงกดดันสูงหลายด้าน การขอรับการสนับสนุนเป็นสิ่งสำคัญ',
      en: "You're facing high pressure across multiple areas. Seeking support is a meaningful first step.",
    },
  },
]

export function computeScores(answers: Answers): Scores {
  const pillars = {} as Record<PillarKey, number>

  for (const pillar of PILLAR_KEYS) {
    const qs = QUESTIONS.filter(q => q.pillar === pillar)
    const sum = qs.reduce((acc, q) => acc + (answers[q.id] ?? 3), 0)
    const avg = qs.length > 0 ? sum / qs.length : 3
    pillars[pillar] = Math.round(((avg - 1) / 4) * 100)
  }

  const overall = Math.round(
    Object.values(pillars).reduce((a, b) => a + b, 0) / PILLAR_KEYS.length
  )

  return { pillars, overall }
}

export function scoreToZone(score: number): ZoneKey {
  if (score >= 80) return 'performing'
  if (score >= 65) return 'stable'
  if (score >= 50) return 'watch'
  if (score >= 35) return 'risk'
  return 'critical'
}

export function getPersona(overallScore: number): Persona {
  return PERSONAS.find(p => overallScore >= p.min) ?? PERSONAS[PERSONAS.length - 1]
}
