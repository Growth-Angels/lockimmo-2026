import React, { useEffect, useState } from 'react';
import { C, F } from '../../tokens';

/* ── CSS keyframes ── */
const CSS = `
@keyframes tr-modal-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.94); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
}
@keyframes tr-backdrop-in {
  from { opacity: 0; } to { opacity: 1; }
}

/* Particule qui traverse de gauche à droite */
@keyframes tr-particle {
  0%   { left: 4%;  opacity: 0; transform: scale(0.4) rotate(0deg);   }
  12%  {            opacity: 1;                                        }
  88%  {            opacity: 1;                                        }
  100% { left: 96%; opacity: 0; transform: scale(1.2) rotate(180deg); }
}

/* Ligne brute qui s'illumine */
@keyframes tr-row-glow {
  0%,100% { background: transparent;          color: #999; }
  40%,60% { background: rgba(255,135,83,0.1); color: #353230; }
}

/* Carte structurée qui apparaît */
@keyframes tr-card-in {
  from { opacity: 0; transform: translateX(14px); }
  to   { opacity: 1; transform: translateX(0);    }
}

/* Flèche centrale qui pulsate */
@keyframes tr-arrow {
  0%,100% { transform: translateX(0);   opacity: 0.5; }
  50%     { transform: translateX(5px); opacity: 1;   }
}

/* Barre de progression */
@keyframes tr-progress {
  0%   { width: 0%;   }
  12%  { width: 10%;  }
  30%  { width: 38%;  }
  50%  { width: 58%;  }
  70%  { width: 76%;  }
  90%  { width: 95%;  }
  100% { width: 100%; }
}

/* Confetti succès — léger scale */
@keyframes tr-success {
  0%  { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.06); }
  100%{ transform: scale(1);   opacity: 1; }
}

/* Row highlight delay helpers */
.tr-row-0 { animation: tr-row-glow 1.2s ease 0.2s both; }
.tr-row-1 { animation: tr-row-glow 1.2s ease 1.0s both; }
.tr-row-2 { animation: tr-row-glow 1.2s ease 1.8s both; }
.tr-row-3 { animation: tr-row-glow 1.2s ease 2.6s both; }
`;

/* ── Données brutes (colonnes serrées) ── */
const RAW = [
  ['NOM',         'ADRESSE',            'LOYER',    'DATE'   ],
  ['Dupont Martin','45 rue de la Paix', '1250,00',  '19/03/26'],
  ['martin.d@mail','apt 3B',            'EUR 1250', 'mars'   ],
  ['DUPONT M.',   'Rue de la Paix 45',  '1 250€',   '2026-03'],
  ['Réf:A4532',   'Paris 75001',        'mensuel',  'ok'     ],
];

/* ── Données structurées LOCKimmo ── */
const CARDS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    label: 'Bien',
    value: 'Apt. 3B · 45 rue de la Paix',
    sub: 'Paris 75001',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B7DF8" strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    label: 'Locataire',
    value: 'Martin Dupont',
    sub: 'martin.d@mail.com',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28A566" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    label: 'Loyer',
    value: '1 250 € / mois',
    sub: 'Paiement le 1er du mois',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
      </svg>
    ),
    label: 'Contrat',
    value: 'Bail signé ✓',
    sub: 'Entrée : 01/04/2026',
  },
];

const CARD_DELAYS = [800, 1600, 2400, 3200];

/* ── Composant principal ── */
interface Props { open: boolean; onClose: () => void; }

export const TransferModal: React.FC<Props> = ({ open, onClose }) => {
  const [phase, setPhase] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) { setPhase(-1); setDone(false); return; }

    setPhase(0);
    const timers = CARD_DELAYS.map((delay, i) =>
      setTimeout(() => setPhase(i + 1), delay)
    );
    const doneTimer = setTimeout(() => setDone(true), 4400);
    return () => { timers.forEach(clearTimeout); clearTimeout(doneTimer); };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style>{CSS}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(30,24,20,0.45)',
        backdropFilter: 'blur(4px)',
        animation: 'tr-backdrop-in 0.2s ease both',
      }}/>

      {/* Card */}
      <div style={{
        position: 'fixed', left: '50%', top: '50%', zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        width: 560, borderRadius: 20,
        background: C.white,
        boxShadow: '0 24px 64px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        animation: 'tr-modal-in 0.36s cubic-bezier(0.34,1.4,0.64,1) both',
      }}>

        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: `linear-gradient(135deg, #2B2826, #3d342e)`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17,1 21,5 17,9"/>
              <path d="M3 11V9a4 4 0 014-4h14"/>
              <polyline points="7,23 3,19 7,15"/>
              <path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.display, fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: '-0.2px' }}>
              Demande de transfert
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              Import & structuration des données
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Corps — 3 colonnes */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 48px 1fr',
          gap: 0, padding: '18px 16px', background: '#FAFAF9', minHeight: 240,
        }}>

          {/* Colonne gauche : données brutes */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: C.textSecondary,
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.error }}/>
              Vos données actuelles
            </div>

            {/* Table CSV-like */}
            <div style={{
              fontFamily: 'monospace', fontSize: 10.5, lineHeight: 1.6,
              border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden',
              background: C.white,
            }}>
              {RAW.map((row, ri) => (
                <div key={ri} className={ri > 0 ? `tr-row-${ri - 1}` : undefined} style={{
                  display: 'grid', gridTemplateColumns: '1.1fr 1.4fr 0.9fr 0.8fr',
                  borderBottom: ri < RAW.length - 1 ? `1px solid ${C.border}` : 'none',
                  padding: ri === 0 ? '5px 8px' : '6px 8px',
                  background: ri === 0 ? '#F2F0EE' : undefined,
                  color: ri === 0 ? C.textSecondary : '#999',
                  fontWeight: ri === 0 ? 700 : 400,
                  fontSize: ri === 0 ? 9 : 10.5,
                  transition: 'background 0.3s, color 0.3s',
                }}>
                  {row.map((cell, ci) => (
                    <div key={ci} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 4 }}>
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Centre : flux de particules */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
            {/* Particules */}
            <div style={{ position: 'relative', width: 36, height: 60, overflow: 'visible' }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  position: 'absolute', top: `${15 + i * 12}px`,
                  width: 7, height: 7, borderRadius: '50%',
                  background: i % 2 === 0 ? C.accent : '#FFBA99',
                  animation: `tr-particle 1.6s ease-in-out ${i * 0.4}s infinite`,
                }}/>
              ))}
            </div>

            {/* Flèche */}
            <div style={{ animation: 'tr-arrow 1s ease-in-out infinite' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12,5 19,12 12,19"/>
              </svg>
            </div>
          </div>

          {/* Colonne droite : données structurées */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: C.textSecondary,
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#28A566' }}/>
              Données LOCKimmo
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CARDS.map((card, i) => (
                phase >= i + 1 ? (
                  <div key={i} style={{
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: 9, padding: '8px 10px',
                    display: 'flex', alignItems: 'center', gap: 9,
                    animation: 'tr-card-in 0.36s cubic-bezier(0.34,1.4,0.64,1) both',
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: C.bgLight,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{card.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: C.textSecondary, marginBottom: 1 }}>{card.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.value}</div>
                      <div style={{ fontSize: 10, color: C.textSecondary }}>{card.sub}</div>
                    </div>
                  </div>
                ) : (
                  /* Placeholder vide */
                  <div key={i} style={{
                    height: 50, borderRadius: 9,
                    background: 'rgba(0,0,0,0.04)',
                    border: `1px dashed ${C.border}`,
                  }}/>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Pied : barre de progression + état */}
        <div style={{ padding: '12px 16px 16px', borderTop: `1px solid ${C.border}`, background: C.white }}>
          {!done ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 12, color: C.textSecondary }}>
                  {phase > 0 ? `${phase} enregistrement${phase > 1 ? 's' : ''} structuré${phase > 1 ? 's' : ''}` : 'Analyse des données…'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{Math.round((phase / CARDS.length) * 100)} %</span>
              </div>
              <div style={{ height: 5, borderRadius: 4, background: C.accentLight, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, ${C.accent}, #FFB899)`,
                  animation: 'tr-progress 4.4s cubic-bezier(0.4,0,0.2,1) forwards',
                }}/>
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              animation: 'tr-success 0.4s ease both',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(40,165,102,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28A566" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#28A566' }}>
                Transfert réussi · 4 enregistrements importés dans LOCKimmo
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
