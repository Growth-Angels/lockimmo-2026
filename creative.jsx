// Creative renderer — exports to window.Creative
// 5 angles × 4 formats × 2 styles = 40 LOCKimmo PerfMax ads

const COLORS = {
  dark:  { bg: '#353230', bg2: '#2a2826', text: '#FFFFFF', sub: 'rgba(255,255,255,0.62)', accent: '#FF8753', accentPeach: '#FFBD86', card: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.10)', muted: '#AAA09A' },
  light: { bg: '#F3F0ED', bg2: '#EAE5E0', text: '#353230', sub: '#6C6057',               accent: '#FF8753', accentPeach: '#FFBD86', card: '#FFFFFF',                 border: 'rgba(53,50,48,0.13)',    muted: '#AAA09A' },
};

const ANGLES = [
  {
    id: 'temps', label: 'Gain de temps', icon: '⏱',
    headline: ['4h de gagnées.', 'Chaque jour.'],
    headlineLong: '4h économisées par jour, dès la première semaine.',
    sub: 'Relances, rapprochement bancaire, quittances — LOCKimmo automatise pendant que vous développez votre portefeuille.',
    subShort: 'LOCKimmo automatise ce qui vous prenait des heures.',
    stat: '4h', statLabel: 'économisées\npar jour',
    photo: 'assets/photo-lifestyle.jpg',
    visual: null,
    tag: 'Automatisation',
  },
  {
    id: 'simplicite', label: 'Simplicité', icon: '✦',
    headline: ['Le rapprochement', 'bancaire en 3 clics.'],
    headlineLong: 'Le rapprochement bancaire, enfin simple.',
    sub: 'LOCKimmo détecte les écarts, pointe les encaissements et vous alerte si quelque chose cloche. Sans tableur Excel.',
    subShort: 'Fini les tableurs. LOCKimmo pointe vos encaissements automatiquement.',
    stat: '3', statLabel: 'clics\nsuffisent',
    photo: 'assets/photo-interior.png',
    visual: 'assets/chart-revenue.png',
    tag: 'Simplicité',
  },
  {
    id: 'performance', label: 'Performance', icon: '◆',
    headline: ['5× plus rapide', 'que les autres.'],
    headlineLong: '5× plus rapide que les autres plateformes dédiées.',
    sub: 'Pendant que vos concurrents s\'épuisent sur leurs outils, vous pilotez votre parc et développez votre activité.',
    subShort: 'Vos concurrents s\'épuisent. Vous, vous avancez.',
    stat: '5×', statLabel: 'plus rapide\nque les autres',
    photo: 'assets/photo-lifestyle.jpg',
    visual: 'assets/chart-revenue.png',
    tag: 'Performance',
  },
  {
    id: 'social', label: 'Social proof', icon: '❝',
    headline: ['"Enfin du beau', 'et de l\'efficace !"'],
    headlineLong: '"LOCKimmo secoue le milieu de l\'immobilier."',
    sub: 'La plateforme adoptée par les gestionnaires qui refusent de perdre du temps sur des outils dépassés.',
    subShort: 'La plateforme qui secoue l\'immobilier.',
    stat: null, statLabel: null,
    photo: 'assets/photo-lifestyle.jpg',
    visual: 'assets/press-logo.png',
    tag: 'Vu dans la presse',
  },
  {
    id: 'features', label: 'Tout-en-un', icon: '▣',
    headline: ['Agenda. Relances.', 'Encaissements.'],
    headlineLong: 'Tout ce dont un gestionnaire a besoin. Réuni en un seul outil.',
    sub: 'Agenda intelligent, suivi financier en temps réel, relances automatisées — LOCKimmo gère l\'arrière-plan pour que vous gardiez le cap.',
    subShort: 'Un seul outil pour piloter tout votre parc immobilier.',
    stat: null, statLabel: null,
    photo: 'assets/photo-interior.png',
    visuals: ['assets/app-calendar.png','assets/chart-revenue.png','assets/app-relances.png'],
    tag: 'Tout-en-un',
  },
];

const FORMATS = [
  { id: 'square',    label: '1:1',     w: 1200, h: 1200, desc: '1200 × 1200 px — Display & YouTube' },
  { id: 'landscape', label: '1.91:1',  w: 1200, h: 628,  desc: '1200 × 628 px — Display & Search' },
  { id: 'portrait',  label: '4:5',     w: 960,  h: 1200, desc: '960 × 1200 px — YouTube Shorts & Discover' },
  { id: 'story',     label: '9:16',    w: 1080, h: 1920, desc: '1080 × 1920 px — YouTube Shorts' },
];

// ─── Sub-components ───────────────────────────────────────────────

function Logo({ color = '#fff', size = 28 }) {
  // Lock icon + wordmark
  const lh = size * 0.9;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
      <svg width={size * 0.72} height={size * 0.9} viewBox="0 0 22 27" fill="none">
        <rect x="1" y="11" width="20" height="15" rx="4" fill={color} />
        <path d="M6 11V8a5 5 0 0 1 10 0v3" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <circle cx="11" cy="19" r="2.5" fill={color === '#fff' ? '#FF8753' : '#FF8753'} />
      </svg>
      <span style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: size, lineHeight: 1, color, letterSpacing: '-0.04em' }}>
        LOCKimmo
      </span>
    </div>
  );
}

function OrangeBlob({ style = {} }) {
  return (
    <div style={{
      position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
      background: 'radial-gradient(circle, rgba(255,135,83,0.55) 0%, rgba(255,135,83,0.18) 50%, transparent 75%)',
      filter: 'blur(1px)',
      ...style,
    }} />
  );
}

function CTAButton({ C, size = 16 }) {
  const isDark = C.text === '#FFFFFF';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: isDark ? '#FFFFFF' : C.accent,
      color: isDark ? '#353230' : '#FFFFFF',
      borderRadius: 14, padding: `${size * 0.55}px ${size * 1.5}px`,
      fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: size,
      whiteSpace: 'nowrap', letterSpacing: '-0.01em',
    }}>
      Essayer gratuitement
    </div>
  );
}

function TagPill({ label, C, size = 13 }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: C.accent + '22', border: `1px solid ${C.accent}55`,
      borderRadius: 100, padding: `${size * 0.35}px ${size * 0.9}px`,
      color: C.accent, fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontWeight: 600, fontSize: size, letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      {label}
    </div>
  );
}

function BigStat({ stat, label, C, statSize = 140, labelSize = 18 }) {
  return (
    <div>
      <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: statSize, lineHeight: 1, color: C.accent, letterSpacing: '-0.04em' }}>
        {stat}
      </div>
      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: labelSize, color: C.sub, lineHeight: 1.3, marginTop: 6, whiteSpace: 'pre-line' }}>
        {label}
      </div>
    </div>
  );
}

function Headline({ lines, C, size = 52 }) {
  return (
    <div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: size, lineHeight: 1.1, color: C.text, letterSpacing: '-0.05em' }}>
          {l}
        </div>
      ))}
    </div>
  );
}

// ─── Layout: Landscape 1.91:1 ─────────────────────────────────────

function LandscapeCreative({ angle, fmt, C }) {
  const { w, h } = fmt;
  const hasStat = !!angle.stat;
  const hasVisuals = !!angle.visuals;
  const photoSrc = angle.photo;

  return (
    <div style={{ position: 'relative', width: w, height: h, background: C.bg, display: 'flex', overflow: 'hidden' }}>
      {/* Left text panel */}
      <div style={{ width: w * 0.52, height: h, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${h*0.1}px ${h*0.08}px ${h*0.1}px ${h*0.13}px`, gap: h*0.05, zIndex: 2 }}>
        <OrangeBlob style={{ width: h*1.2, height: h*1.2, left: -h*0.3, top: -h*0.1, opacity: 0.35 }} />
        <Logo color={C.text} size={h * 0.052} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: h*0.025, marginTop: h*0.04 }}>
          <TagPill label={angle.tag} C={C} size={h*0.038} />
          <Headline lines={angle.headline} C={C} size={h * 0.09} />
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: h*0.045, color: C.sub, lineHeight: 1.45, maxWidth: w*0.42 }}>
            {angle.subShort}
          </div>
        </div>
        {hasStat && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: h*0.02, marginTop: h*0.02 }}>
            <BigStat stat={angle.stat} label={angle.statLabel} C={C} statSize={h*0.18} labelSize={h*0.042} />
          </div>
        )}
        <div style={{ marginTop: h*0.03 }}>
          <CTAButton C={C} size={h*0.047} />
        </div>
      </div>
      {/* Right visual panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {hasVisuals ? (
          <div style={{ position: 'absolute', inset: 0, background: C.bg2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: h*0.04, padding: h*0.06 }}>
            {angle.visuals.map((src, i) => (
              <img key={i} src={src} style={{ width: '85%', height: h*0.22, objectFit: 'cover', borderRadius: 10, border: `1px solid ${C.border}` }} alt="" />
            ))}
          </div>
        ) : angle.id === 'social' ? (
          <div style={{ position: 'absolute', inset: 0, background: C.bg2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: h*0.12, gap: h*0.06 }}>
            <OrangeBlob style={{ width: h*1.5, height: h*1.5, right: -h*0.5, top: -h*0.3, opacity: 0.25 }} />
            <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: h*0.14, color: C.accent, lineHeight: 0.9, marginBottom: h*0.04 }}>❝</div>
            <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: h*0.075, color: C.text, lineHeight: 1.2, letterSpacing: '-0.04em' }}>Enfin du beau<br/>et de l'efficace&nbsp;!</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: h*0.042, color: C.muted }}>— Vu dans la presse</div>
          </div>
        ) : (
          <>
            <img src={photoSrc} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${C.bg}CC 0%, ${C.bg}00 40%)` }} />
          </>
        )}
      </div>
      {/* Bottom logo stripe */}
      <div style={{ position: 'absolute', bottom: h*0.04, right: h*0.06, opacity: 0.5 }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: h*0.038, color: C.text, letterSpacing: '0.08em', textTransform: 'uppercase' }}>lockimmo.fr</div>
      </div>
    </div>
  );
}

// ─── Layout: Square 1:1 ───────────────────────────────────────────

function SquareCreative({ angle, fmt, C }) {
  const { w, h } = fmt;
  const hasStat = !!angle.stat;
  const hasVisuals = !!angle.visuals;

  return (
    <div style={{ position: 'relative', width: w, height: h, background: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top visual area */}
      <div style={{ position: 'relative', height: h * 0.46, overflow: 'hidden', flexShrink: 0 }}>
        {hasVisuals ? (
          <div style={{ position: 'absolute', inset: 0, background: C.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: w*0.025, padding: w*0.04 }}>
            {angle.visuals.map((src, i) => (
              <div key={i} style={{ flex: 1, height: '80%', borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
            ))}
          </div>
        ) : angle.id === 'social' ? (
          <div style={{ position: 'absolute', inset: 0, background: C.bg2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: w*0.08 }}>
            <OrangeBlob style={{ width: w*0.8, height: w*0.8, left: '10%', top: '-20%', opacity: 0.35 }} />
            <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.18, color: C.accent, lineHeight: 0.9, alignSelf: 'flex-start', marginBottom: w*0.02 }}>❝</div>
            <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.075, color: C.text, lineHeight: 1.2, letterSpacing: '-0.04em', textAlign: 'center' }}>Enfin du beau<br/>et de l'efficace&nbsp;!</div>
          </div>
        ) : hasStat ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={angle.photo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} alt="" />
            <div style={{ position: 'absolute', inset: 0, background: `${C.bg}AA` }} />
            <OrangeBlob style={{ width: w*0.7, height: w*0.7, left: '15%', top: '5%', opacity: 0.5 }} />
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.28, lineHeight: 0.9, color: C.accent, letterSpacing: '-0.04em' }}>{angle.stat}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: w*0.045, color: C.text, marginTop: w*0.02, whiteSpace: 'pre-line' }}>{angle.statLabel}</div>
            </div>
          </div>
        ) : (
          <>
            <img src={angle.photo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${C.bg} 100%)` }} />
          </>
        )}
      </div>

      {/* Bottom text area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: `${w*0.06}px ${w*0.07}px ${w*0.11}px` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: w*0.025 }}>
          <TagPill label={angle.tag} C={C} size={w*0.028} />
          <Headline lines={angle.headline} C={C} size={w * 0.072} />
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: w*0.037, color: C.sub, lineHeight: 1.5, maxWidth: '90%' }}>
            {angle.subShort}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <CTAButton C={C} size={w*0.038} />
          <Logo color={C.muted} size={w*0.038} />
        </div>
      </div>
    </div>
  );
}

// ─── Layout: Portrait 4:5 ─────────────────────────────────────────

function PortraitCreative({ angle, fmt, C }) {
  const { w, h } = fmt;
  const hasStat = !!angle.stat;
  const hasVisuals = !!angle.visuals;

  return (
    <div style={{ position: 'relative', width: w, height: h, background: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top visual */}
      <div style={{ position: 'relative', height: h * 0.48, overflow: 'hidden', flexShrink: 0 }}>
        {hasVisuals ? (
          <div style={{ position: 'absolute', inset: 0, background: C.bg2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: w*0.03, padding: w*0.05 }}>
            {angle.visuals.map((src, i) => (
              <div key={i} style={{ width: '90%', height: h*0.115, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
            ))}
          </div>
        ) : angle.id === 'social' ? (
          <div style={{ position: 'absolute', inset: 0, background: C.bg2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: w*0.09 }}>
            <OrangeBlob style={{ width: w*0.9, height: w*0.9, right: '-20%', top: '-10%', opacity: 0.3 }} />
            <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.2, color: C.accent, lineHeight: 0.9, marginBottom: w*0.03 }}>❝</div>
            <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.085, color: C.text, lineHeight: 1.2, letterSpacing: '-0.04em' }}>Enfin du beau<br/>et de l'efficace&nbsp;!</div>
          </div>
        ) : hasStat ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={angle.photo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} alt="" />
            <div style={{ position: 'absolute', inset: 0, background: `${C.bg}BB` }} />
            <OrangeBlob style={{ width: w*0.9, height: w*0.9, left: '5%', top: '5%', opacity: 0.5 }} />
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.38, lineHeight: 0.9, color: C.accent, letterSpacing: '-0.04em' }}>{angle.stat}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: w*0.052, color: C.text, marginTop: w*0.025, whiteSpace: 'pre-line' }}>{angle.statLabel}</div>
            </div>
          </div>
        ) : (
          <>
            <img src={angle.photo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${C.bg} 100%)` }} />
          </>
        )}
        <OrangeBlob style={{ width: w*0.5, height: w*0.5, right: -w*0.1, top: -w*0.1, opacity: 0.2 }} />
      </div>

      {/* Bottom text */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: `${w*0.07}px ${w*0.08}px ${w*0.09}px` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: w*0.035 }}>
          <TagPill label={angle.tag} C={C} size={w*0.033} />
          <Headline lines={angle.headline} C={C} size={w * 0.082} />
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: w*0.044, color: C.sub, lineHeight: 1.5 }}>
            {angle.subShort}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <CTAButton C={C} size={w*0.042} />
          <Logo color={C.muted} size={w*0.04} />
        </div>
      </div>
    </div>
  );
}

// ─── Layout: Story 9:16 ───────────────────────────────────────────

function StoryCreative({ angle, fmt, C }) {
  const { w, h } = fmt;
  const hasStat = !!angle.stat;
  const hasVisuals = !!angle.visuals;

  return (
    <div style={{ position: 'relative', width: w, height: h, background: C.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeBlob style={{ width: w*1.4, height: w*1.4, left: -w*0.3, top: h*0.25, opacity: 0.25 }} />
      <OrangeBlob style={{ width: w*0.8, height: w*0.8, right: -w*0.1, bottom: h*0.05, opacity: 0.18 }} />

      {/* Logo top */}
      <div style={{ padding: `${h*0.05}px ${w*0.08}px`, flexShrink: 0, zIndex: 2 }}>
        <Logo color={C.text} size={h*0.03} />
      </div>

      {/* Stat or visual — center */}
      {hasStat ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.42, lineHeight: 0.9, color: C.accent, letterSpacing: '-0.04em', textAlign: 'center' }}>{angle.stat}</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: w*0.055, color: C.sub, marginTop: w*0.03, whiteSpace: 'pre-line', textAlign: 'center' }}>{angle.statLabel}</div>
        </div>
      ) : hasVisuals ? (
        <div style={{ height: h*0.38, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: w*0.025, padding: `0 ${w*0.06}px`, alignItems: 'center', justifyContent: 'center' }}>
          {angle.visuals.map((src, i) => (
            <div key={i} style={{ width: '88%', height: h*0.1, borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            </div>
          ))}
        </div>
      ) : angle.id === 'social' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${w*0.1}px`, position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.25, color: C.accent, lineHeight: 0.9, marginBottom: w*0.04 }}>❝</div>
          <div style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.1, color: C.text, lineHeight: 1.2, letterSpacing: '-0.04em' }}>Enfin du beau et de l'efficace&nbsp;!</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: w*0.05, color: C.muted, marginTop: w*0.05 }}>— Vu dans la presse</div>
        </div>
      ) : (
        <div style={{ height: h*0.38, position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <img src={angle.photo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="" />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${C.bg} 0%, transparent 30%, ${C.bg} 100%)` }} />
        </div>
      )}

      {/* Bottom text block */}
      <div style={{ flexShrink: 0, padding: `${h*0.04}px ${w*0.08}px ${h*0.07}px`, display: 'flex', flexDirection: 'column', gap: h*0.025, zIndex: 2 }}>
        <TagPill label={angle.tag} C={C} size={w*0.038} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: h*0.01 }}>
          {angle.headline.map((l, i) => (
            <div key={i} style={{ fontFamily: 'Chillax, sans-serif', fontWeight: 500, fontSize: w*0.1, lineHeight: 1.1, color: C.text, letterSpacing: '-0.05em' }}>{l}</div>
          ))}
        </div>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: w*0.048, color: C.sub, lineHeight: 1.5, marginTop: h*0.005 }}>
          {angle.subShort}
        </div>
        <div style={{ marginTop: h*0.02 }}>
          <CTAButton C={C} size={w*0.048} />
        </div>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: w*0.038, color: C.muted, marginTop: h*0.01, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          lockimmo.fr
        </div>
      </div>
    </div>
  );
}

// ─── Main Creative dispatcher ──────────────────────────────────────

function Creative({ angleId, formatId, styleId }) {
  const angle  = ANGLES.find(a => a.id === angleId)  || ANGLES[0];
  const fmt    = FORMATS.find(f => f.id === formatId) || FORMATS[0];
  const C      = COLORS[styleId] || COLORS.dark;
  const ratio  = fmt.w / fmt.h;

  if (ratio > 1.5) return <LandscapeCreative angle={angle} fmt={fmt} C={C} />;
  if (ratio < 0.7) return <StoryCreative     angle={angle} fmt={fmt} C={C} />;
  if (fmt.id === 'portrait') return <PortraitCreative angle={angle} fmt={fmt} C={C} />;
  return <SquareCreative angle={angle} fmt={fmt} C={C} />;
}

// Export to window
Object.assign(window, { Creative, ANGLES, FORMATS, COLORS });
