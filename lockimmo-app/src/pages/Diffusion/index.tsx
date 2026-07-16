import React, { useState } from 'react';
import { C, F } from '../../tokens';

/* ─── Animations CSS (injectées une seule fois) ─── */
const FLOW_CSS = `
@keyframes diff-flow {
  0%   { transform: translateX(0px);   opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { transform: translateX(190px); opacity: 0; }
}
@keyframes diff-pulse {
  0%, 100% { box-shadow: 0 0 0 0   rgba(236,90,19,0.35); }
  50%      { box-shadow: 0 0 0 12px rgba(236,90,19,0);    }
}
@keyframes diff-live-dot {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
}
`;

/* ─── Données du bien envoyées à Leboncoin ─── */
const SYNC_FIELDS = [
  { icon: '🏷️', label: 'Titre',       value: 'T3 lumineux · 64 m²' },
  { icon: '📷', label: 'Photos',      value: '8 photos HD'           },
  { icon: '💰', label: 'Prix',        value: '1 250 € / mois'        },
  { icon: '📏', label: 'Surface',     value: '64 m² · 3 pièces'      },
  { icon: '📍', label: 'Localisation', value: 'Paris 9e — Opéra'     },
  { icon: '⚡', label: 'DPE',         value: 'C — 142 kWh/m²/an'     },
];

/* ─── Plateformes ─── */
type Status = 'online' | 'pending' | 'offline';

interface Platform {
  key:   string;
  name:  string;
  short: string;       // 2-3 letter logo
  color: string;       // brand color
  bg:    string;       // brand bg
  url:   string;
  default: Status;
  views: number;
  leads: number;
}

const PLATFORMS: Platform[] = [
  { key: 'lbc',  name: 'Leboncoin',   short: 'LBC',  color: '#EC5A13', bg: 'rgba(236,90,19,0.10)',   url: 'leboncoin.fr',   default: 'online',  views: 1247, leads: 14 },
  { key: 'lic',  name: 'Logic-Immo',  short: 'LI',   color: '#1E5BB0', bg: 'rgba(30,91,176,0.10)',   url: 'logic-immo.com', default: 'online',  views:  684, leads:  6 },
  { key: 'slg',  name: 'SeLoger',     short: 'SeL',  color: '#E1251B', bg: 'rgba(225,37,27,0.10)',   url: 'seloger.com',    default: 'online',  views:  923, leads: 11 },
  { key: 'pv',   name: 'ParuVendu',   short: 'PV',   color: '#0066A0', bg: 'rgba(0,102,160,0.10)',   url: 'paruvendu.fr',   default: 'pending', views:    0, leads:  0 },
  { key: 'pap',  name: 'PàP',         short: 'PàP',  color: '#D32027', bg: 'rgba(211,32,39,0.10)',   url: 'pap.fr',         default: 'offline', views:    0, leads:  0 },
];

/* ─── Status pill ─── */
const StatusPill: React.FC<{ status: Status }> = ({ status }) => {
  const map = {
    online:  { label: 'En ligne',    color: C.success, bg: C.successLight, dot: C.success },
    pending: { label: 'En attente',  color: C.accent,  bg: C.accentLight,  dot: C.accent  },
    offline: { label: 'Désactivé',   color: C.textMuted, bg: C.bgLight,    dot: C.textMuted },
  }[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 100,
      background: map.bg, color: map.color,
      fontSize: 11, fontWeight: 700, letterSpacing: '-0.01em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: map.dot }} />
      {map.label}
    </span>
  );
};

/* ─── Toggle ─── */
const Toggle: React.FC<{ on: boolean; onChange: () => void; color?: string }> = ({ on, onChange, color = C.accent }) => (
  <button
    onClick={onChange}
    style={{
      width: 38, height: 22, borderRadius: 100, border: 'none',
      background: on ? color : 'rgba(53,50,48,0.15)',
      padding: 2, transition: 'background 0.18s', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: on ? 'flex-end' : 'flex-start',
    }}
  >
    <span style={{
      width: 18, height: 18, borderRadius: '50%',
      background: C.white, boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
      transition: 'transform 0.18s',
    }} />
  </button>
);

/* ─── KPI card ─── */
const Kpi: React.FC<{ icon: string; value: string; label: string; trend?: string }> = ({ icon, value, label, trend }) => (
  <div style={{
    flex: 1, background: C.white, borderRadius: 12,
    border: `1px solid ${C.border}`, padding: 18,
    display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: C.accentLight, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: 18,
    }}>{icon}</div>
    <div>
      <div style={{
        fontFamily: F.display, fontSize: 28, fontWeight: 700,
        color: C.textPrimary, letterSpacing: '-0.03em', lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{label}</div>
    </div>
    {trend && (
      <div style={{ fontSize: 11, fontWeight: 700, color: C.success }}>↗ {trend}</div>
    )}
  </div>
);

/* ─── Page ─── */
export const Diffusion: React.FC = () => {
  const [states, setStates] = useState<Record<string, Status>>(
    Object.fromEntries(PLATFORMS.map(p => [p.key, p.default]))
  );

  const toggle = (key: string) => {
    setStates(s => ({
      ...s,
      [key]: s[key] === 'online' ? 'offline' : 'online',
    }));
  };

  const onlineCount = Object.values(states).filter(s => s === 'online').length;
  const totalViews  = PLATFORMS.filter(p => states[p.key] === 'online').reduce((acc, p) => acc + p.views, 0);
  const totalLeads  = PLATFORMS.filter(p => states[p.key] === 'online').reduce((acc, p) => acc + p.leads, 0);

  return (
    <div>
      {/* ─── Header ─── */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: F.body }}>
            Multi-diffusion vers des plateformes immobilières
          </h1>
          <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
            Publiez vos annonces en un clic sur les principales plateformes — suivez les performances en temps réel.
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 100, border: 'none',
          background: C.accent, color: C.white,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: F.body,
          boxShadow: '0 4px 14px rgba(255,135,83,0.30)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 109-9"/><path d="M12 7a5 5 0 105 5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          </svg>
          Diffuser sur toutes les plateformes
        </button>
      </div>

      {/* ─── KPI Row ─── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <Kpi icon="📡" value={`${onlineCount}/5`} label="Plateformes actives" />
        <Kpi icon="👁️" value={totalViews.toLocaleString('fr-FR')} label="Vues cette semaine" trend="+18,4 %" />
        <Kpi icon="📩" value={String(totalLeads)} label="Contacts reçus" trend="+6 vs. sem. dern." />
        <Kpi icon="🏠" value="4" label="Annonces en diffusion" />
      </div>

      {/* ─── Bien en cours de diffusion ─── */}
      <div style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.border}`, padding: 20,
        marginBottom: 20, display: 'flex', gap: 18, alignItems: 'center',
      }}>
        <div style={{
          width: 92, height: 72, borderRadius: 10,
          background: `linear-gradient(135deg, ${C.accentSoft}, ${C.accent})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, flexShrink: 0,
        }}>🏢</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
              padding: '3px 9px', borderRadius: 100,
              background: C.accentLight, color: C.accent, textTransform: 'uppercase',
            }}>Annonce active</span>
            <span style={{ fontSize: 11, color: C.textSecondary }}>Réf. WAIO-2026-0142</span>
          </div>
          <div style={{ fontFamily: F.display, fontSize: 20, fontWeight: 600, color: C.textPrimary, letterSpacing: '-0.02em' }}>
            Appartement T3 — 12 rue de la Paix, Paris 9e
          </div>
          <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>
            64 m² · 2 chambres · Loyer 1 250 € / mois · DPE C
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: C.accent, letterSpacing: '-0.03em' }}>
            1 250 € <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 400 }}>/mois</span>
          </div>
          <button style={{
            marginTop: 6, padding: '6px 14px', borderRadius: 100,
            background: 'transparent', border: `1px solid ${C.border}`,
            fontSize: 12, fontWeight: 600, color: C.textPrimary, cursor: 'pointer',
            fontFamily: F.body,
          }}>Voir le bien</button>
        </div>
      </div>

      {/* ─── Schéma de synchronisation animé ─── */}
      <style>{FLOW_CSS}</style>
      <div style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.border}`, overflow: 'hidden',
        marginBottom: 20,
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: C.success, flexShrink: 0,
            animation: 'diff-live-dot 1.6s ease-in-out infinite',
          }} />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Synchronisation en direct
          </h2>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
            padding: '3px 9px', borderRadius: 100, textTransform: 'uppercase',
            background: C.successLight, color: C.success,
          }}>LIVE</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: C.textSecondary }}>
            Dernière sync · il y a 4 min
          </span>
        </div>

        {/* Body : Source → Flow → Destination */}
        <div style={{
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: '1fr 200px 1fr',
          alignItems: 'center', gap: 24,
        }}>

          {/* ── SOURCE — Bien ── */}
          <div style={{
            background: C.bgLight, borderRadius: 12,
            border: `1px solid ${C.border}`, padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `linear-gradient(135deg, ${C.accentSoft}, ${C.accent})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>🏢</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>Apt T3 — rue de la Paix</div>
                <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>Réf. WAIO-2026-0142</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SYNC_FIELDS.map(f => (
                <div key={f.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 12, height: 24,
                }}>
                  <span style={{ fontSize: 13, width: 18, textAlign: 'center' }}>{f.icon}</span>
                  <span style={{ fontWeight: 600, color: C.textPrimary, width: 86 }}>{f.label}</span>
                  <span style={{ flex: 1, color: C.textSecondary, fontSize: 11.5 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FLOW — lignes pointillées + dots animés ── */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            paddingTop: 64, // aligne avec les rangées de gauche
          }}>
            {SYNC_FIELDS.map((f, i) => (
              <div key={f.label} style={{
                position: 'relative', height: 24,
                display: 'flex', alignItems: 'center',
              }}>
                {/* Ligne pointillée */}
                <div style={{
                  width: '100%', height: 0,
                  borderTop: `1.5px dashed ${C.accent}66`,
                }} />
                {/* Flèche fin de ligne */}
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
                  style={{ position: 'absolute', right: -2, top: '50%', marginTop: -4 }}>
                  <path d="M1 1l4 3-4 3" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* Dot animé (couleur Leboncoin) */}
                <div style={{
                  position: 'absolute', top: '50%', left: 0, marginTop: -5,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#EC5A13',
                  boxShadow: '0 0 10px rgba(236,90,19,0.55), 0 0 0 2px rgba(255,255,255,0.9)',
                  animation: 'diff-flow 2.4s cubic-bezier(0.45,0,0.25,1) infinite',
                  animationDelay: `${i * 0.32}s`,
                }} />
              </div>
            ))}

            {/* Label central "Sync en cours" */}
            <div style={{
              position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 100,
              background: C.white, border: `1px solid ${C.accent}33`,
              fontSize: 10, fontWeight: 700, color: C.accent,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              Sync en cours
            </div>
          </div>

          {/* ── DESTINATION — Leboncoin ── */}
          <div style={{
            background: 'linear-gradient(160deg, rgba(236,90,19,0.06) 0%, #FFF 60%)',
            borderRadius: 12,
            border: '1px solid rgba(236,90,19,0.20)',
            padding: '16px 18px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Glow décoratif */}
            <div style={{
              position: 'absolute', top: -30, right: -30,
              width: 120, height: 120, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(236,90,19,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid rgba(236,90,19,0.15)', position: 'relative' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 11,
                background: '#EC5A13', color: C.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em',
                flexShrink: 0,
                animation: 'diff-pulse 2.2s ease-out infinite',
              }}>LBC</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Leboncoin</div>
                <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>leboncoin.fr · API v2.4</div>
              </div>
              <span style={{
                marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 9px', borderRadius: 100,
                background: C.successLight, color: C.success,
                fontSize: 10, fontWeight: 700, letterSpacing: '-0.01em',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.success }} />
                En ligne
              </span>
            </div>

            {/* Confirmation sync */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: C.successLight,
              borderRadius: 8, marginBottom: 10,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: C.success, color: C.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, color: C.success, fontWeight: 700, lineHeight: 1.4 }}>
                Annonce mise à jour<br/>
                <span style={{ color: C.textSecondary, fontWeight: 500 }}>Il y a 4 min · 6 champs synchronisés</span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5, color: C.textSecondary }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13 }}>👁️</span>
                <span><strong style={{ color: C.textPrimary }}>1 247 vues</strong> cette semaine</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13 }}>📩</span>
                <span><strong style={{ color: C.textPrimary }}>14 contacts</strong> reçus</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13 }}>⭐</span>
                <span><strong style={{ color: C.textPrimary }}>Top 3 %</strong> des annonces du quartier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Plateformes ─── */}
      <div style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.border}`, overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0, flex: 1 }}>
            Plateformes connectées
          </h2>
          <span style={{ fontSize: 11, color: C.textSecondary }}>
            Dernière synchro · il y a 4 min
          </span>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2.2fr 1.2fr 1fr 1fr 1.4fr 0.8fr',
          padding: '10px 20px', background: C.bgLight,
          fontSize: 10, fontWeight: 700, color: C.textSecondary,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          borderBottom: `1px solid ${C.border}`, gap: 10,
        }}>
          <span>Plateforme</span>
          <span>Statut</span>
          <span>Vues</span>
          <span>Contacts</span>
          <span>Lien annonce</span>
          <span style={{ textAlign: 'right' }}>Diffuser</span>
        </div>

        {/* Rows */}
        {PLATFORMS.map((p, i) => {
          const status = states[p.key];
          const isOnline = status === 'online';
          return (
            <div key={p.key} style={{
              display: 'grid', gridTemplateColumns: '2.2fr 1.2fr 1fr 1fr 1.4fr 0.8fr',
              padding: '16px 20px', alignItems: 'center', gap: 10,
              borderBottom: i < PLATFORMS.length - 1 ? `1px solid ${C.border}` : 'none',
              opacity: status === 'offline' ? 0.55 : 1,
            }}>
              {/* Plateforme */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: p.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: p.color, fontWeight: 800, fontSize: 12,
                  letterSpacing: '-0.02em',
                  flexShrink: 0,
                }}>{p.short}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>{p.url}</div>
                </div>
              </div>

              {/* Statut */}
              <StatusPill status={status} />

              {/* Vues */}
              <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: isOnline ? C.textPrimary : C.textMuted, letterSpacing: '-0.02em' }}>
                {isOnline ? p.views.toLocaleString('fr-FR') : '—'}
              </div>

              {/* Contacts */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: F.display, fontSize: 16, fontWeight: 700,
                  color: isOnline ? C.textPrimary : C.textMuted, letterSpacing: '-0.02em',
                }}>{isOnline ? p.leads : '—'}</span>
                {isOnline && p.leads > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 6px',
                    borderRadius: 100, background: C.successLight, color: C.success,
                  }}>+{Math.max(1, Math.round(p.leads / 4))}</span>
                )}
              </div>

              {/* Lien */}
              {isOnline ? (
                <a style={{
                  fontSize: 12, color: p.color, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                }}>
                  Voir l'annonce
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                  </svg>
                </a>
              ) : (
                <span style={{ fontSize: 12, color: C.textMuted }}>—</span>
              )}

              {/* Toggle */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Toggle on={isOnline} onChange={() => toggle(p.key)} color={p.color} />
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{
          padding: '12px 20px', background: C.bgLight,
          display: 'flex', alignItems: 'center', gap: 10,
          borderTop: `1px solid ${C.border}`,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          <span style={{ fontSize: 12, color: C.textSecondary }}>
            Toutes les annonces sont mises à jour <strong style={{ color: C.textPrimary }}>automatiquement</strong> dès qu'un prix ou une photo change.
          </span>
          <button style={{
            marginLeft: 'auto', padding: '6px 14px', borderRadius: 100,
            background: C.white, border: `1px solid ${C.border}`,
            fontSize: 12, fontWeight: 600, color: C.textPrimary, cursor: 'pointer',
            fontFamily: F.body,
          }}>Configurer les règles de syndication</button>
        </div>
      </div>
    </div>
  );
};
