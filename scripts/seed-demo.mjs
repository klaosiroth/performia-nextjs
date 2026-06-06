/**
 * Seed demo users for local development.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (never the anon key).
 *
 * Usage:
 *   pnpm seed:demo
 *
 * Safe to run multiple times — existing users are updated, not duplicated.
 */

import { createClient } from '@supabase/supabase-js'

const url        = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    '\nError: missing environment variables.\n' +
    'Add both to .env.local:\n' +
    '  NEXT_PUBLIC_SUPABASE_URL=...\n' +
    '  SUPABASE_SERVICE_ROLE_KEY=...\n'
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_USERS = [
  {
    email: 'employee@demo.com',
    password: 'Demo1234!',
    profile: {
      name_th: 'สมชาย ใจดี',
      name_en: 'Somchai Jaidee',
      dept: 'Marketing',
      position: 'Marketing Manager',
      role: 'employee',
      credits_annual: 20,
      credits_used: 8,
      org_id: null,
    },
  },
  {
    email: 'hr@demo.com',
    password: 'Demo1234!',
    profile: {
      name_th: 'สุดา รักงาน',
      name_en: 'Suda Rakngarn',
      dept: 'Human Resources',
      position: 'HR Manager',
      role: 'hr',
      credits_annual: 0,
      credits_used: 0,
      org_id: null,
    },
  },
  {
    email: 'executive@demo.com',
    password: 'Demo1234!',
    profile: {
      name_th: 'วิชัย นำทาง',
      name_en: 'Wichai Namthang',
      dept: 'Executive',
      position: 'Chief Executive Officer',
      role: 'executive',
      credits_annual: 0,
      credits_used: 0,
      org_id: null,
    },
  },
]

async function resolveAuthUser(email, password) {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) throw new Error(`listUsers failed: ${error.message}`)

  const existing = data.users.find(u => u.email === email)

  if (existing) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existing.id,
      { password, email_confirm: true }
    )
    if (updateError) throw new Error(`updateUserById failed: ${updateError.message}`)
    return existing.id
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (createError) throw new Error(`createUser failed: ${createError.message}`)
  return created.user.id
}

async function seed() {
  console.log('Seeding demo users…\n')

  for (const { email, password, profile } of DEMO_USERS) {
    try {
      const userId = await resolveAuthUser(email, password)

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...profile }, { onConflict: 'id' })

      if (profileError) throw new Error(`profile upsert failed: ${profileError.message}`)

      const redirect = profile.role === 'employee' ? '/' : '/hr'
      console.log(`  ✓  ${email.padEnd(26)} role: ${profile.role.padEnd(10)} → ${redirect}`)
    } catch (err) {
      console.error(`  ✗  ${email}: ${err.message}`)
      process.exitCode = 1
    }
  }

  console.log('\nAll done. Use any of the accounts above to sign in at /login.')
  console.log('Password for all accounts: Demo1234!\n')
}

seed()
