import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Answers } from '@/lib/assessment/core'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { answers?: unknown; assessmentId?: unknown }

  if (typeof body.answers !== 'object' || body.answers === null || Array.isArray(body.answers)) {
    return NextResponse.json({ error: 'answers must be an object' }, { status: 400 })
  }

  const answers = body.answers as Answers
  const assessmentId = typeof body.assessmentId === 'string' ? body.assessmentId : undefined

  if (assessmentId) {
    const { data: existing } = await supabase
      .from('assessments')
      .select('id')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('assessments')
      .update({ answers, status: 'in_progress' })
      .eq('id', assessmentId)

    if (error) {
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ id: assessmentId, ok: true })
  }

  const { data, error } = await supabase
    .from('assessments')
    .insert({ user_id: user.id, status: 'in_progress', answers })
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, ok: true })
}
