import React from 'react';
import { C, F } from '../../tokens';

/* ─── Data ─────────────────────────────────────────────────────────── */

// Mockup 1
const FIRST_REMINDER = [
  { label: '5 jours avant',  active: false },
  { label: '3 jours avant',  active: true  },
  { label: '1 jour avant',   active: false },
  { label: 'Le jour J',      active: false },
];

const CHANNELS = [
  { label: 'Email',    active: true,  icon: 'mail' },
  { label: 'SMS',      active: true,  icon: 'sms'  },
  { label: 'WhatsApp', active: false, icon: 'wa'   },
];

const FOLLOWUP = [
  { label: '3 j',  active: false },
  { label: '5 j',  active: true  },
  { label: '7 j',  active: false },
  { label: '10 j', active: false },
];

const TONE = [
  { label: 'Courtois',  active: true  },
  { label: 'Ferme',     active: false },
  { label: 'Insistant', active: false },
];

// Mockup 2
const HAUSSE_LOTS = [
  { initials: 'MD', name: 'M. Dupont',     property: '12 rue Lafayette',     oldRent: 1240, newRent: 1252.76 },
  { initials: 'CM', name: 'Mme Martin',    property: '8 av. Foch',            oldRent: 980,  newRent: 990.09  },
  { initials: 'SL', name: 'Mme Leroy',     property: '24 bd Voltaire',        oldRent: 1460, newRent: 1475.04 },
];
const OLD_TOTAL = HAUSSE_LOTS.reduce((s, l) => s + l.oldRent, 0);
const NEW_TOTAL = HAUSSE_LOTS.reduce((s, l) => s + l.newRent, 0);

const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const fmtInt = (n: number) => Math.round(n).toLocaleString('fr-FR') + ' €';

/* ─── Sub-components ───────────────────────────────────────────────── */

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, ...style }}>
    {children}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#AAA09A', marginBottom: 8 }}>
    {children}
  </div>
);

const Chip: React.FC<{ active?: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 13px', borderRadius: 100,
    background: active ? C.accent : '#F3F0ED',
    color: active ? '#fff' : '#6C6057',
    fontSize: 12.5, fontWeight: 600,
    border: active ? 'none' : '1px solid rgba(53,50,48,0.06)',
    cursor: 'pointer',
    boxShadow: active ? '0 2px 8px rgba(255,135,83,0.25)' : 'none',
  }}>
    {children}
  </div>
);

const Toggle: React.FC<{ on?: boolean }> = ({ on }) => (
  <div style={{
    width: 34, height: 20, borderRadius: 100,
    background: on ? C.accent : '#DDD8D4',
    position: 'relative', flexShrink: 0,
    transition: 'background 0.18s',
  }}>
    <div style={{
      position: 'absolute', top: 2, left: on ? 16 : 2,
      width: 16, height: 16, borderRadius: '50%',
      background: '#fff', transition: 'left 0.18s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    }}/>
  </div>
);

/* ─── Mock channel icons ───────────────────────────────────────────── */
const ChannelIcon = ({ kind }: { kind: string }) => {
  if (kind === 'mail') return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1.5" y="2.5" width="10" height="8" rx="1"/><path d="M1.5 4l5 3 5-3"/></svg>;
  if (kind === 'sms') return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 2.5h9a1 1 0 011 1V8a1 1 0 01-1 1H7l-3 2.5V9H2.5a1 1 0 01-1-1V3.5a1 1 0 011-1z"/></svg>;
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="5"/><path d="M3.5 6.5c0 1.5 1.5 3 3 3 .5 0 1.5 0 2-.5"/></svg>;
};

/* ═══════════════════════════════════════════════════════════════════ */
export const AutomatisationsLoyers: React.FC = () => {
  return (
    <div>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#AAA09A', marginBottom: 14 }}>
        Accueil <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: C.textPrimary, fontWeight: 500 }}>Automatisations loyers</span>
      </div>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `linear-gradient(135deg, ${C.accent}, #FFBD86)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, boxShadow: '0 4px 16px rgba(255,135,83,0.3)', flexShrink: 0,
        }}>⚡</div>
        <div>
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 28, color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Automatisations loyers
          </div>
          <div style={{ fontSize: 13, color: '#AAA09A', marginTop: 2 }}>Rappels programmés &amp; indexation IRL annuelle</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ═══════════════════════════════════════════════════════════
            MOCKUP 1 — PROGRAMMER LE RAPPEL DE LOYER
            ═══════════════════════════════════════════════════════════ */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>

          {/* Mockup header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#FFF4EE', color: C.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M4 7a5 5 0 0110 0v4l1.5 2h-13L4 11V7z"/><path d="M7 15a2 2 0 004 0"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 18, color: C.textPrimary, letterSpacing: '-0.03em' }}>
                Programmer le rappel de loyer
              </div>
              <div style={{ fontSize: 12.5, color: '#AAA09A', marginTop: 2 }}>Définissez quand et comment vos locataires sont relancés</div>
            </div>
            <div style={{
              marginLeft: 'auto',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#EDFBF4', color: '#28A566',
              fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#28A566' }}/>
              Actif sur 23 lots
            </div>
          </div>

          {/* Mockup body: 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 0 }}>

            {/* Left: form */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>

              <div>
                <FieldLabel>Premier rappel envoyé</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {FIRST_REMINDER.map(o => <Chip key={o.label} active={o.active}>{o.label}</Chip>)}
                </div>
              </div>

              <div>
                <FieldLabel>Canaux d'envoi</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {CHANNELS.map(c => (
                    <Chip key={c.label} active={c.active}>
                      <ChannelIcon kind={c.icon}/>
                      {c.label}
                      {c.active && (
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M2 5.5l2.5 2.5L9 3"/></svg>
                      )}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Si impayé, relancer après</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {FOLLOWUP.map(o => <Chip key={o.label} active={o.active}>{o.label}</Chip>)}
                </div>
              </div>

              <div>
                <FieldLabel>Ton du message</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {TONE.map(o => <Chip key={o.label} active={o.active}>{o.label}</Chip>)}
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', background: '#FAFAF9',
                border: `1px solid ${C.border}`, borderRadius: 10,
              }}>
                <Toggle on/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>Envoyer automatiquement</div>
                  <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 1 }}>Pas besoin de validation manuelle</div>
                </div>
              </div>

              <button style={{
                padding: '12px 18px', borderRadius: 10, border: 'none',
                background: C.accent, color: '#fff',
                fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255,135,83,0.32)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                width: 'fit-content',
              }}>
                Appliquer à tous les locataires (23)
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 6.5h7M7 3l3.5 3.5L7 10"/></svg>
              </button>
            </div>

            {/* Right: message preview */}
            <div style={{ padding: 24, background: '#FAFAF9', borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 14 }}>

              <FieldLabel>Aperçu du message</FieldLabel>

              {/* Phone-like preview */}
              <div style={{
                background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14,
                padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
                boxShadow: '0 8px 24px rgba(53,50,48,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#FFF0E8', color: C.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                  }}>LI</div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: C.textPrimary }}>Agence Welcome</div>
                    <div style={{ fontSize: 10.5, color: '#AAA09A' }}>via LOCKimmo · auto</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 10, color: '#AAA09A' }}>il y a 3 j</div>
                </div>

                <div style={{ height: 1, background: C.border }}/>

                <div style={{ fontSize: 13, color: C.textPrimary, lineHeight: 1.55 }}>
                  <strong>Bonjour M. Dupont,</strong><br/>
                  Pour rappel, votre loyer de mai (<strong>1 240 €</strong>) est dû le <strong>1<sup>er</sup> juin</strong>.<br/><br/>
                  Vous pouvez régler par virement (RIB joint) ou via votre espace locataire.<br/><br/>
                  Bien à vous,<br/>
                  L'équipe Agence Welcome
                </div>

                <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                  <span style={{ fontSize: 10.5, color: '#AAA09A', background: '#F3F0ED', padding: '2px 7px', borderRadius: 4 }}>📎 RIB.pdf</span>
                  <span style={{ fontSize: 10.5, color: '#AAA09A', background: '#F3F0ED', padding: '2px 7px', borderRadius: 4 }}>📎 Quittance.pdf</span>
                </div>
              </div>

              {/* Calendar mini */}
              <div style={{
                background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: 14,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}>Juin 2026</span>
                  <span style={{ fontSize: 10.5, color: C.accent, fontWeight: 600 }}>3 rappels prévus</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {['L','M','M','J','V','S','D'].map((d, i) => (
                    <div key={i} style={{ fontSize: 9, fontWeight: 700, color: '#AAA09A', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
                  ))}
                  {Array.from({ length: 30 }, (_, i) => {
                    const day = i + 1;
                    const isReminder = day === 28 || day === 29;
                    const isDueDate = day === 1;
                    return (
                      <div key={i} style={{
                        height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: isReminder || isDueDate ? 700 : 500,
                        color: isDueDate ? '#fff' : isReminder ? C.accent : '#6C6057',
                        background: isDueDate ? C.accent : isReminder ? '#FFF0E8' : 'transparent',
                        borderRadius: 6,
                        border: isReminder ? `1px solid ${C.accent}` : 'none',
                      }}>{day}</div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 12, paddingTop: 4, fontSize: 10.5, color: '#6C6057' }}>
                  <span><span style={{ display:'inline-block', width: 7, height: 7, borderRadius: 2, background: C.accent, marginRight: 5, verticalAlign: 'middle' }}/>Rappel</span>
                  <span><span style={{ display:'inline-block', width: 7, height: 7, borderRadius: 2, background: '#FFF0E8', border: `1px solid ${C.accent}`, marginRight: 5, verticalAlign: 'middle' }}/>Échéance</span>
                </div>
              </div>

            </div>

          </div>
        </Card>

        {/* ═══════════════════════════════════════════════════════════
            MOCKUP 2 — HAUSSE DE LOYER AUTOMATIQUE
            ═══════════════════════════════════════════════════════════ */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>

          {/* Mockup header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#EDFBF4', color: '#28A566',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M3 13l4-4 3 3 5-5M11 4h4v4"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 18, color: C.textPrimary, letterSpacing: '-0.03em' }}>
                Appliquer la hausse de loyer automatique
              </div>
              <div style={{ fontSize: 12.5, color: '#AAA09A', marginTop: 2 }}>Indexation sur l'IRL · 3 lots éligibles</div>
            </div>
            <div style={{
              marginLeft: 'auto',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#EEF4FF', color: '#3B7DF8',
              fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              IRL T1 2026
            </div>
          </div>

          {/* Body 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 0 }}>

            {/* Left: IRL info */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div style={{
                background: 'linear-gradient(135deg, #FFF8F3, #FFF4EE)',
                border: `1px solid ${C.border}`, borderRadius: 12, padding: 18,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FieldLabel>Indice IRL · T1 2026</FieldLabel>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: '#EDFBF4', color: '#28A566',
                    fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                  }}>
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 6l2.5-2.5L7 6"/></svg>
                    + 1,03 %
                  </span>
                </div>
                <div style={{
                  fontFamily: F.display, fontWeight: 500, fontSize: 38,
                  color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1,
                }}>143,52</div>
                <div style={{ fontSize: 12, color: '#6C6057' }}>
                  vs <strong>142,06</strong> en T1 2025 (publié INSEE · 13/04/2026)
                </div>
              </div>

              <div>
                <FieldLabel>Date d'effet</FieldLabel>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', background: '#F3F0ED', borderRadius: 10,
                  border: `1px solid ${C.border}`,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={C.accent} strokeWidth="1.7" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M5 1.5v3M11 1.5v3M2 7h12"/></svg>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary }}>1<sup>er</sup> juin 2026</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#AAA09A' }}>dans 5 jours</span>
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', background: '#FAFAF9',
                border: `1px solid ${C.border}`, borderRadius: 10,
              }}>
                <Toggle on/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>Notifier les locataires</div>
                  <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 1 }}>Avenant + courrier d'information</div>
                </div>
              </div>

              <button style={{
                padding: '12px 18px', borderRadius: 10, border: 'none',
                background: C.accent, color: '#fff',
                fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255,135,83,0.32)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                width: '100%',
              }}>
                Appliquer la hausse (3 lots)
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M2.5 6.5l3 3 6-7"/></svg>
              </button>

              <div style={{ fontSize: 11, color: '#AAA09A', lineHeight: 1.55 }}>
                Conforme aux articles 17-1 et 17-2 de la loi du 6 juillet 1989. Hausse limitée à la variation IRL.
              </div>
            </div>

            {/* Right: lots preview */}
            <div style={{ padding: 24, background: '#FAFAF9', borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 12 }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FieldLabel>Aperçu des nouveaux loyers</FieldLabel>
                <span style={{ fontSize: 11, color: C.accent, fontWeight: 600, cursor: 'pointer' }}>Voir le détail →</span>
              </div>

              {/* Lots list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {HAUSSE_LOTS.map((l, i) => {
                  const delta = l.newRent - l.oldRent;
                  return (
                    <div key={i} style={{
                      background: '#fff', borderRadius: 12, padding: '12px 14px',
                      border: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: '#FFF0E8', color: C.accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, flexShrink: 0,
                      }}>{l.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{l.name}</div>
                        <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 1 }}>{l.property}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                        <span style={{ color: '#AAA09A', textDecoration: 'line-through' }}>{fmtInt(l.oldRent)}</span>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#AAA09A" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6.5h7M7 3l3.5 3.5L7 10"/></svg>
                        <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 15, color: C.textPrimary, letterSpacing: '-0.02em' }}>{fmt(l.newRent)}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: '#28A566',
                          background: '#EDFBF4', padding: '2px 7px', borderRadius: 6,
                        }}>+ {fmt(delta).replace(' €', ' €')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div style={{
                background: '#fff', borderRadius: 12, padding: '14px 16px',
                border: `1px dashed ${C.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#AAA09A' }}>
                    Total mensuel
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6C6057', marginTop: 2 }}>
                    <span style={{ textDecoration: 'line-through', color: '#AAA09A' }}>{fmtInt(OLD_TOTAL)}</span>
                    {' → '}
                    <strong style={{ color: C.textPrimary }}>{fmt(NEW_TOTAL)}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, color: '#28A566', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    + {fmt(NEW_TOTAL - OLD_TOTAL)}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#AAA09A', marginTop: 4 }}>par mois · soit + {fmtInt((NEW_TOTAL - OLD_TOTAL) * 12)} / an</div>
                </div>
              </div>

            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
