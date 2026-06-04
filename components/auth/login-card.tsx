'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/lib/supabase/types'
import { tr, type LoginLang } from '@/lib/login-tr'

function detectRoles(email: string): Role[] {
  const e = email.toLowerCase()
  if (e.includes('multi')) return ['employee', 'hr', 'executive']
  if (e.includes('exec') || e.includes('ceo') || e.includes('cfo')) return ['executive']
  if (e.includes('hr') || e.includes('admin') || e.includes('people')) return ['hr']
  return ['employee']
}

const ROLE_PATH: Record<Role, string> = { employee: '/', hr: '/hr', executive: '/hr' }
const ROLE_LABEL_KEY: Record<Role, Parameters<typeof tr>[1]> = {
  employee: 'ws.employee.title',
  hr: 'ws.hr.title',
  executive: 'ws.exec.title',
}

interface LoginCardProps {
  lang: LoginLang
  onToast: (msg: string) => void
  onModal: (roles: Role[]) => void
  onBanner: (msg: string) => void
  onNavigate: (path: string) => void
}

export default function LoginCard({ lang, onToast, onModal, onBanner, onNavigate }: LoginCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const t = useCallback((k: Parameters<typeof tr>[1]) => tr(lang, k), [lang])
  const lh = lang === 'th' ? { h: 1.52, b: 1.88 } : { h: 1.18, b: 1.58 }

  const triggerRedirect = useCallback((role: Role) => {
    onBanner(`${t('redirect.to')} ${t(ROLE_LABEL_KEY[role])}…`)
    setTimeout(() => onNavigate(ROLE_PATH[role]), 2700)
  }, [t, onBanner, onNavigate])

  const handleSignIn = useCallback(async () => {
    const emailVal = email.trim()
    if (!emailVal)                                    { onToast(t('val.noEmail'));      return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)){ onToast(t('val.invalidEmail')); return }
    if (!password)                                    { onToast(t('val.noPassword'));   return }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email: emailVal, password })
      if (error) { onToast(error.message); return }

      const { data: profileRow } = await supabase
        .from('profiles').select('role').eq('id', data.user.id).single()

      const storedRole = (profileRow as { role: string } | null)?.role as Role | undefined

      const emailRoles = detectRoles(emailVal)
      const roles: Role[] = emailRoles.length > 1
        ? emailRoles
        : [storedRole ?? emailRoles[0]]

      if (roles.length > 1) { onModal(roles) } else { triggerRedirect(roles[0]) }
    } finally {
      setLoading(false)
    }
  }, [email, password, onToast, onModal, t, triggerRedirect])

  const handleSSO = useCallback(async (provider: 'google' | 'azure') => {
    const label = provider === 'google' ? 'Google' : 'Microsoft'
    onToast(`${t('val.ssoConnect')} ${label}…`)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    })
  }, [t, onToast])

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') void handleSignIn()
  }, [handleSignIn])

  // ── Shared style objects ──
  const inpStyle: React.CSSProperties = {
    width: '100%', padding: '10.5px 14px', borderRadius: 10,
    border: '1.5px solid #C3D8EC', background: 'rgba(232,243,251,.52)',
    fontFamily: 'var(--font-sans)', fontSize: lang === 'th' ? '.9rem' : '.875rem',
    color: 'var(--color-text-primary)', outline: 'none',
    transition: 'border-color .22s, box-shadow .22s, background .22s',
  }

  return (
    <div style={{ width:'54%', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(24px,3vw,56px)', position:'relative', overflow:'hidden', background:`radial-gradient(ellipse 70% 60% at 85% 10%, rgba(89,227,255,.055) 0%,transparent 65%), radial-gradient(ellipse 55% 55% at 5% 90%, rgba(16,213,210,.04) 0%,transparent 60%), linear-gradient(155deg,#EDF6FC 0%,#E4F1F9 48%,#EEF5FB 100%)` }}>
      {/* Dot grid */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'radial-gradient(circle,rgba(7,27,99,.055) 1px,transparent 1px)', backgroundSize:'26px 26px', opacity:.9 }}/>

      <div className="fu d2" style={{ width:'100%', maxWidth:416, position:'relative', zIndex:1 }}>
        {/* Glass card */}
        <div style={{ background:'rgba(255,255,255,.94)', backdropFilter:'blur(48px)', WebkitBackdropFilter:'blur(48px)', borderRadius:'2rem', border:'1px solid rgba(255,255,255,.85)', boxShadow:'0 0 0 1px rgba(255,255,255,.68) inset, 0 2px 0 rgba(255,255,255,.98) inset, 0 40px 96px rgba(6,24,73,.082), 0 12px 40px rgba(6,24,73,.048), 0 2px 8px rgba(6,24,73,.030)', position:'relative', padding:'clamp(28px,2.8vw,42px)' }}>
          {/* Top shine line */}
          <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, borderRadius:'50%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,.96),transparent)' }}/>

          {/* Card logo */}
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:22 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,rgba(16,213,210,.17),rgba(89,227,255,.09))', border:'1px solid rgba(16,213,210,.22)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="7.5" r="2.5" fill="var(--color-aqua)" opacity=".82"/>
                <path d="M7.5 16.5c0-2.485 2.015-4 4.5-4s4.5 1.515 4.5 4" stroke="var(--color-aqua)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="5.5" cy="9" r="1.5" fill="var(--color-aqua)" opacity=".36"/>
                <circle cx="18.5" cy="9" r="1.5" fill="var(--color-aqua)" opacity=".36"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:'.9rem', color:'var(--color-navy)', letterSpacing:'-.012em', lineHeight:1 }}>Performia</div>
              <div style={{ fontSize:'.57rem', color:'var(--color-aqua)', letterSpacing:'.07em', textTransform:'uppercase', marginTop:2, opacity:.7 }}>{t('brand.tagline')}</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom:24 }}>
            <h2 style={{ color:'var(--color-text-primary)', fontWeight:600, fontSize:'clamp(1.18rem,1.6vw,1.44rem)', letterSpacing:'-.015em', marginBottom:6, lineHeight:lh.h }}>{t('login.headline')}</h2>
            <p style={{ color:'var(--color-text-secondary)', fontSize:'.86rem', lineHeight:lh.b, fontWeight:300 }}>{t('login.subheadline')}</p>
          </div>

          {/* Form */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Email */}
            <div>
              <label htmlFor="login-email" style={{ display:'block', fontSize:'.74rem', fontWeight:500, color:'var(--color-text-primary)', marginBottom:5 }}>{t('form.emailLabel')}</label>
              <input id="login-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} placeholder={t('form.emailPlaceholder')} style={inpStyle}
                onFocus={e => { e.currentTarget.style.borderColor='var(--color-aqua)'; e.currentTarget.style.background='rgba(255,255,255,.98)'; e.currentTarget.style.boxShadow='0 0 0 3.5px rgba(16,213,210,.1)' }}
                onBlur={e => { e.currentTarget.style.borderColor='#C3D8EC'; e.currentTarget.style.background='rgba(232,243,251,.52)'; e.currentTarget.style.boxShadow='none' }}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                <label htmlFor="login-password" style={{ fontSize:'.74rem', fontWeight:500, color:'var(--color-text-primary)' }}>{t('form.passwordLabel')}</label>
                <a href="#" style={{ fontSize:'.73rem', color:'var(--color-aqua)', textDecoration:'none' }} onClick={e => e.preventDefault()}>{t('form.forgotPassword')}</a>
              </div>
              <div style={{ position:'relative' }}>
                <input id="login-password" type={showPw ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} placeholder="••••••••" style={{ ...inpStyle, paddingRight:42 }}
                  onFocus={e => { e.currentTarget.style.borderColor='var(--color-aqua)'; e.currentTarget.style.background='rgba(255,255,255,.98)'; e.currentTarget.style.boxShadow='0 0 0 3.5px rgba(16,213,210,.1)' }}
                  onBlur={e => { e.currentTarget.style.borderColor='#C3D8EC'; e.currentTarget.style.background='rgba(232,243,251,.52)'; e.currentTarget.style.boxShadow='none' }}
                />
                <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPw(v => !v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', lineHeight:0, transition:'color .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-aqua)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    {showPw ? (<><path d="M3 3l14 14M10 4C5.5 4 2 10 2 10s1.5 2.5 4 4M10 16c4.5 0 8-6 8-6s-1.5-2.5-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></>) : (<><path d="M10 4C5.5 4 2 10 2 10s3.5 6 8 6 8-6 8-6-3.5-6-8-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></>)}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label style={{ display:'flex', alignItems:'center', gap:7, cursor:'pointer', userSelect:'none' }}>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ appearance:'none', width:15, height:15, borderRadius:4, border:`1.5px solid ${rememberMe ? 'transparent' : '#BACEDF'}`, background: rememberMe ? 'linear-gradient(135deg,var(--color-aqua),var(--color-cyan-accent))' : 'rgba(255,255,255,.9)', cursor:'pointer', flexShrink:0, position:'relative', transition:'background .15s, border-color .15s' }}/>
              <span style={{ fontSize:'.78rem', color:'var(--color-text-secondary)', fontWeight:300 }}>{t('form.rememberMe')}</span>
            </label>

            {/* Sign in button */}
            <button type="button" disabled={loading} onClick={() => void handleSignIn()} style={{ width:'100%', padding:12, border:'none', borderRadius:11, cursor: loading ? 'not-allowed' : 'pointer', background:'linear-gradient(128deg,var(--color-navy) 0%,#0C3686 52%,#0B7FA3 100%)', color:'#fff', fontFamily:'var(--font-sans)', fontWeight:600, fontSize:'.9rem', letterSpacing: lang === 'th' ? 0 : '.008em', boxShadow:'0 4px 24px rgba(7,27,99,.26),0 1px 3px rgba(7,27,99,.16)', transition:'transform .2s, box-shadow .2s', opacity: loading ? .8 : 1 }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(7,27,99,.3)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 24px rgba(7,27,99,.26),0 1px 3px rgba(7,27,99,.16)' }}
            >
              {loading ? (
                <div style={{ width:17, height:17, margin:'0 auto', border:'2px solid rgba(255,255,255,.25)', borderTopColor:'#fff', borderRadius:'50%', animation:'login-spin .7s linear infinite' }}/>
              ) : t('form.signIn')}
            </button>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:'.71rem', color:'var(--color-text-muted)' }}>
              <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,#CFE3F0,transparent)' }}/>
              {t('form.orWith')}
              <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,#CFE3F0,transparent)' }}/>
            </div>

            {/* SSO */}
            <div style={{ display:'flex', gap:10 }}>
              {([['google','Google'],['azure','Microsoft']] as const).map(([provider, label]) => (
                <button key={provider} type="button" aria-label={`Sign in with ${label}`} onClick={() => void handleSSO(provider)} style={{ flex:1, padding:'9.5px 10px', borderRadius:10, border:'1.5px solid #C3D8EC', background:'rgba(255,255,255,.84)', fontFamily:'var(--font-sans)', fontSize:'.81rem', fontWeight:500, color:'var(--color-text-primary)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'border-color .2s, background .2s, box-shadow .2s, transform .18s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(16,213,210,.55)'; e.currentTarget.style.background='#fff'; e.currentTarget.style.boxShadow='0 4px 16px rgba(16,213,210,.08)'; e.currentTarget.style.transform='translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#C3D8EC'; e.currentTarget.style.background='rgba(255,255,255,.84)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
                >
                  {provider === 'google' ? (
                    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect width="8.5" height="8.5" fill="#F25022"/><rect x="9.5" width="8.5" height="8.5" fill="#7FBA00"/><rect y="9.5" width="8.5" height="8.5" fill="#00A4EF"/><rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/></svg>
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy note */}
          <div style={{ marginTop:20, display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px', borderRadius:10, background:'rgba(16,213,210,.04)', border:'1px solid rgba(16,213,210,.12)' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginTop:2, flexShrink:0 }} aria-hidden="true"><path d="M8 2L3 4.5v4C3 11.5 5.5 14 8 14s5-2.5 5-5.5v-4L8 2z" stroke="var(--color-aqua)" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 8l1.5 1.5L10 6.5" stroke="var(--color-aqua)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p style={{ color:'var(--color-text-secondary)', fontSize:'.7rem', lineHeight:lh.b, fontWeight:300 }}>{t('form.privacy')}</p>
          </div>
        </div>

        {/* Footer links */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginTop:15 }}>
          {(['footer.privacy','footer.terms','footer.support'] as const).map((key, i) => (
            <span key={key} style={{ display:'contents' }}>
              {i > 0 && <span style={{ color:'#C4DCF0', fontSize:'.4rem' }}>●</span>}
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize:'.7rem', color:'var(--color-text-muted)', textDecoration:'none', transition:'color .15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-aqua)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >{t(key)}</a>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
