import { tr, type LoginLang } from '@/lib/login-tr'

interface BrandPanelProps {
  lang: LoginLang
}

export default function BrandPanel({ lang }: BrandPanelProps) {
  const t = (k: Parameters<typeof tr>[1]) => tr(lang, k)
  const lh = lang === 'th' ? { h: 1.52, b: 1.88 } : { h: 1.18, b: 1.58 }

  return (
    <div
      className="lp"
      style={{
        width: '46%',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        background: `
          radial-gradient(ellipse 120% 70% at 60% -5%,  rgba(255,255,255,.09) 0%,transparent 50%),
          radial-gradient(ellipse 80%  90% at -10% 110%, rgba(16,213,210,.10)  0%,transparent 52%),
          radial-gradient(ellipse 60%  60% at 110% 60%,  rgba(89,227,255,.07)  0%,transparent 50%),
          linear-gradient(158deg, #132674 0%, #0B1F62 32%, #0C2166 60%, #112472 100%)`,
      }}
    >
      {/* Ambient SVG illustration */}
      <svg
        aria-hidden="true"
        viewBox="0 0 560 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#10D5D2" stopOpacity=".32"/>
            <stop offset="60%"  stopColor="#59E3FF" stopOpacity=".10"/>
            <stop offset="100%" stopColor="#59E3FF" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#59E3FF" stopOpacity=".22"/>
            <stop offset="55%"  stopColor="#10D5D2" stopOpacity=".07"/>
            <stop offset="100%" stopColor="#10D5D2" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="orb3" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity=".08"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="humanGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#59E3FF" stopOpacity=".72"/>
            <stop offset="100%" stopColor="#10D5D2" stopOpacity=".32"/>
          </radialGradient>
          <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
          <filter id="blur35"><feGaussianBlur stdDeviation="35"/></filter>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Glow pools */}
        <ellipse cx="480" cy="120" rx="200" ry="160" fill="url(#orb2)" filter="url(#blur35)">
          <animate attributeName="ry" values="160;178;160" dur="12s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;.7;1" dur="12s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="80" cy="680" rx="180" ry="180" fill="url(#orb1)" filter="url(#blur35)">
          <animate attributeName="ry" values="180;200;180" dur="16s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;.65;1" dur="16s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="280" cy="400" rx="160" ry="200" fill="url(#orb3)" filter="url(#blur35)"/>

        {/* Atmospheric rings */}
        <g transform="translate(280,380)" fill="none">
          <circle r="140" stroke="#59E3FF" strokeWidth="1" strokeOpacity=".12" style={{ transformOrigin:'0 0', animation:'ring-pulse 10s ease-in-out infinite' }}/>
          <circle r="195" stroke="#59E3FF" strokeWidth="1" strokeOpacity=".08" style={{ transformOrigin:'0 0', animation:'ring-pulse2 14s ease-in-out infinite' }}/>
          <circle r="250" stroke="#10D5D2" strokeWidth=".8" strokeOpacity=".05" style={{ transformOrigin:'0 0', animation:'ring-pulse2 18s ease-in-out infinite', animationDelay:'-6s' }}/>
          <circle r="310" stroke="#59E3FF" strokeWidth=".5" strokeOpacity=".04"/>
        </g>

        {/* Human figure */}
        <g style={{ animation:'float-slow 8s ease-in-out infinite', transformOrigin:'280px 380px' }} filter="url(#glow)">
          <circle cx="280" cy="250" r="38" fill="none" stroke="url(#humanGrad)" strokeWidth="1.5" strokeOpacity=".75"/>
          <circle cx="280" cy="250" r="38" fill="url(#orb1)" filter="url(#blur8)" opacity=".6"/>
          <circle cx="280" cy="218" r="3.5" fill="#59E3FF" opacity=".7"><animate attributeName="opacity" values=".7;1;.7" dur="3s" repeatCount="indefinite"/></circle>
          <line x1="280" y1="288" x2="280" y2="310" stroke="#59E3FF" strokeWidth="1.2" strokeOpacity=".45" strokeLinecap="round"/>
          <path d="M200 360 Q230 308 280 308 Q330 308 360 360" fill="none" stroke="url(#humanGrad)" strokeWidth="1.4" strokeOpacity=".6" strokeLinecap="round"/>
          <path d="M210 355 Q170 370 140 390" fill="none" stroke="#59E3FF" strokeWidth="1.2" strokeOpacity=".35" strokeLinecap="round"/>
          <path d="M350 355 Q390 370 420 390" fill="none" stroke="#59E3FF" strokeWidth="1.2" strokeOpacity=".35" strokeLinecap="round"/>
          <ellipse cx="280" cy="365" rx="28" ry="40" fill="none" stroke="#10D5D2" strokeWidth="1" strokeOpacity=".3"/>
          <ellipse cx="280" cy="365" rx="16" ry="24" fill="url(#orb1)" filter="url(#blur8)" opacity=".5"/>
          <circle cx="280" cy="355" r="5" fill="#10D5D2" opacity=".5">
            <animate attributeName="r" values="5;7;5" dur="2.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values=".5;.8;.5" dur="2.2s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* Connection lines */}
        <line x1="140" y1="390" x2="85" y2="470" stroke="#10D5D2" strokeWidth="1" strokeOpacity=".18" strokeDasharray="4 6"><animate attributeName="strokeDashoffset" values="0;-40" dur="4s" repeatCount="indefinite"/></line>
        <line x1="420" y1="390" x2="475" y2="480" stroke="#59E3FF" strokeWidth="1" strokeOpacity=".18" strokeDasharray="4 6"><animate attributeName="strokeDashoffset" values="0;-40" dur="5s" repeatCount="indefinite"/></line>
        <line x1="280" y1="218" x2="410" y2="155" stroke="#59E3FF" strokeWidth="1" strokeOpacity=".16" strokeDasharray="3 7"><animate attributeName="strokeDashoffset" values="0;-40" dur="6s" repeatCount="indefinite"/></line>
        <line x1="280" y1="405" x2="280" y2="520" stroke="#10D5D2" strokeWidth="1" strokeOpacity=".15" strokeDasharray="4 6"><animate attributeName="strokeDashoffset" values="0;-40" dur="3.5s" repeatCount="indefinite"/></line>

        {/* Satellite nodes */}
        <g style={{ animation:'float-slow 7s ease-in-out infinite', animationDelay:'-2s', transformOrigin:'415px 148px' }}>
          <circle cx="415" cy="148" r="22" fill="none" stroke="#59E3FF" strokeWidth="1" strokeOpacity=".28"/>
          <circle cx="415" cy="148" r="22" fill="#59E3FF" fillOpacity=".06" filter="url(#blur8)"/>
          <circle cx="415" cy="148" r="4" fill="#59E3FF" opacity=".55"><animate attributeName="opacity" values=".55;.85;.55" dur="3.5s" repeatCount="indefinite"/></circle>
        </g>
        <g style={{ animation:'float-med 9s ease-in-out infinite', animationDelay:'-4s', transformOrigin:'78px 468px' }}>
          <circle cx="78" cy="468" r="18" fill="none" stroke="#10D5D2" strokeWidth="1" strokeOpacity=".25"/>
          <circle cx="78" cy="468" r="18" fill="#10D5D2" fillOpacity=".07" filter="url(#blur8)"/>
          <circle cx="78" cy="468" r="3.5" fill="#10D5D2" opacity=".5"><animate attributeName="opacity" values=".5;.8;.5" dur="4s" repeatCount="indefinite"/></circle>
        </g>
        <g style={{ animation:'float-slow 8s ease-in-out infinite', animationDelay:'-1s', transformOrigin:'480px 478px' }}>
          <circle cx="480" cy="478" r="20" fill="none" stroke="#59E3FF" strokeWidth="1" strokeOpacity=".24"/>
          <circle cx="480" cy="478" r="20" fill="#59E3FF" fillOpacity=".06" filter="url(#blur8)"/>
          <circle cx="480" cy="478" r="3.5" fill="#59E3FF" opacity=".52"><animate attributeName="opacity" values=".52;.82;.52" dur="3.2s" repeatCount="indefinite"/></circle>
        </g>
        <g style={{ animation:'float-med 10s ease-in-out infinite', animationDelay:'-6s', transformOrigin:'280px 528px' }}>
          <circle cx="280" cy="528" r="16" fill="none" stroke="#10D5D2" strokeWidth="1" strokeOpacity=".22"/>
          <circle cx="280" cy="528" r="16" fill="#10D5D2" fillOpacity=".08" filter="url(#blur8)"/>
          <circle cx="280" cy="528" r="3" fill="#10D5D2" opacity=".48"><animate attributeName="opacity" values=".48;.75;.48" dur="2.8s" repeatCount="indefinite"/></circle>
        </g>

        {/* Ambient particles */}
        <g opacity=".7">
          <circle cx="80"  cy="180" r="1.5" fill="#59E3FF" opacity=".3"><animate attributeName="cy" values="180;165;180" dur="9s" repeatCount="indefinite"/><animate attributeName="opacity" values=".3;.55;.3" dur="9s" repeatCount="indefinite"/></circle>
          <circle cx="460" cy="280" r="1.2" fill="#10D5D2" opacity=".28"><animate attributeName="cy" values="280;262;280" dur="11s" repeatCount="indefinite"/><animate attributeName="opacity" values=".28;.5;.28" dur="11s" repeatCount="indefinite"/></circle>
          <circle cx="160" cy="550" r="1.8" fill="#59E3FF" opacity=".25"><animate attributeName="cy" values="550;534;550" dur="7s" repeatCount="indefinite"/><animate attributeName="opacity" values=".25;.48;.25" dur="7s" repeatCount="indefinite"/></circle>
          <circle cx="390" cy="620" r="1.3" fill="#10D5D2" opacity=".32"><animate attributeName="cy" values="620;605;620" dur="13s" repeatCount="indefinite"/><animate attributeName="opacity" values=".32;.55;.32" dur="13s" repeatCount="indefinite"/></circle>
          <circle cx="50"  cy="320" r="1"   fill="#59E3FF" opacity=".22"><animate attributeName="cy" values="320;308;320" dur="8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".22;.42;.22" dur="8s" repeatCount="indefinite"/></circle>
          <circle cx="510" cy="200" r="1.5" fill="#59E3FF" opacity=".2"><animate attributeName="cy" values="200;185;200" dur="10s" repeatCount="indefinite"/><animate attributeName="opacity" values=".2;.4;.2" dur="10s" repeatCount="indefinite"/></circle>
          <circle cx="330" cy="690" r="1.2" fill="#10D5D2" opacity=".24"><animate attributeName="cy" values="690;676;690" dur="12s" repeatCount="indefinite"/><animate attributeName="opacity" values=".24;.45;.24" dur="12s" repeatCount="indefinite"/></circle>
          <circle cx="200" cy="120" r="1"   fill="#59E3FF" opacity=".2"><animate attributeName="cy" values="120;107;120" dur="9.5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".2;.4;.2" dur="9.5s" repeatCount="indefinite"/></circle>
        </g>

        {/* Arc lines */}
        <path d="M60 600 Q180 540 280 580 Q380 620 500 560" fill="none" stroke="#10D5D2" strokeWidth="1" strokeOpacity=".1"><animate attributeName="strokeOpacity" values=".1;.2;.1" dur="8s" repeatCount="indefinite"/></path>
        <path d="M40 200 Q160 140 280 180 Q400 220 520 160" fill="none" stroke="#59E3FF" strokeWidth=".8" strokeOpacity=".08"><animate attributeName="strokeOpacity" values=".08;.18;.08" dur="11s" repeatCount="indefinite"/></path>
      </svg>

      {/* Copy layer */}
      <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', padding:'clamp(30px,3.8vw,56px)' }}>
        {/* Logo */}
        <div className="fu d1" style={{ flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'11px' }}>
            <div style={{ width:40, height:40, borderRadius:11, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.16)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(12px)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="7" r="2.8" fill="rgba(89,227,255,.88)"/>
                <path d="M7 18c0-2.76 2.24-4.5 5-4.5s5 1.74 5 4.5" stroke="rgba(89,227,255,.88)" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="4.5" cy="9.5" r="1.5" fill="rgba(16,213,210,.52)"/>
                <circle cx="19.5" cy="9.5" r="1.5" fill="rgba(16,213,210,.52)"/>
                <line x1="6.8" y1="9.2" x2="9.8" y2="7.8" stroke="rgba(16,213,210,.3)" strokeWidth="1" strokeLinecap="round"/>
                <line x1="17.2" y1="9.2" x2="14.2" y2="7.8" stroke="rgba(16,213,210,.3)" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:'1.08rem', letterSpacing:'-.015em', lineHeight:1.1 }}>Performia</div>
              <div style={{ color:'rgba(89,227,255,.48)', fontSize:'.56rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', marginTop:2 }}>{t('brand.tagline')}</div>
            </div>
          </div>
        </div>

        {/* Desktop headline */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div className="fu d2" style={{ marginBottom:16 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 11px', borderRadius:99, background:'rgba(16,213,210,.1)', border:'1px solid rgba(16,213,210,.2)' }}>
              <span className="ldot" style={{ width:5, height:5, borderRadius:'50%', background:'var(--color-aqua)', flexShrink:0, display:'inline-block' }}/>
              <span style={{ color:'rgba(89,227,255,.76)', fontSize:'.59rem', fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase' }}>{t('brand.badge')}</span>
            </div>
          </div>
          <div className="fu d3">
            <h1 style={{ color:'#fff', fontWeight:600, fontSize:'clamp(1.7rem,2.9vw,2.5rem)', lineHeight:lh.h, letterSpacing:'-.018em', marginBottom:14 }}>{t('brand.headline')}</h1>
            <p style={{ color:'rgba(185,210,230,.55)', fontSize:'clamp(.8rem,.96vw,.9rem)', fontWeight:300, lineHeight:lh.b, maxWidth:310 }}>{t('brand.supporting')}</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="fu d4" style={{ flexShrink:0, paddingTop:8 }}>
          <p style={{ color:'rgba(185,210,230,.18)', fontSize:'.61rem' }}>{t('brand.copyright')}</p>
        </div>
      </div>
    </div>
  )
}
