import React from 'react';
import { C, F } from '../../tokens';

/* ─── Data ─────────────────────────────────────────────────────────── */
const KPIS = [
  { label: 'Encaissé · mai', value: '248 320 €', foot: <><span style={{ color: '#28A566', fontWeight: 600 }}>+ 4,2 %</span> vs avril</>, icon: 'trend' },
  { label: 'Lettrage auto',  value: '96 %',      foot: '142 sur 148 écritures',                                                       icon: 'check' },
  { label: 'Reversements proprio', value: '187 640 €', foot: '23 propriétaires · 5 juin',                                              icon: 'list' },
  { label: 'Honoraires perçus', value: '24 850 €', foot: 'Gestion 7 % · CRG prête',                                                    icon: 'clock' },
] as const;

const BANK_LINES = [
  { label: 'VIR DUPONT Marc',    sub: '29/05 · BNP ★4521',     amount: '+ 1 240 €', matched: true  },
  { label: 'PRLV SEPA MARTIN',   sub: '28/05 · SCI Welcome',   amount: '+ 980 €',   matched: true  },
  { label: 'VIR LEROY Sophie',   sub: '27/05 · Réf LOC00012',  amount: '+ 1 460 €', matched: true  },
  { label: 'VIR sans référence', sub: '27/05 · à affecter',    amount: '+ 720 €',   matched: false },
];

const QUITTANCES = [
  { label: 'Quittance · mai 2026', sub: 'DUPONT · 12 rue Lafayette',  amount: '1 240 €', matched: true },
  { label: 'Quittance · mai 2026', sub: 'MARTIN · 8 av. Foch',        amount: '980 €',   matched: true },
  { label: 'Quittance · mai 2026', sub: 'LEROY · 24 bd Voltaire',     amount: '1 460 €', matched: true },
  { label: 'À rapprocher manuellement', sub: '2 propositions IA',     amount: '—',       matched: false },
];

const REVERSEMENTS = [
  { init: 'DB', name: 'M. Berger',     sub: '3 lots · honoraires déduits', amount: '8 420 €',  status: 'programmé',    scheduled: true  },
  { init: 'SC', name: 'SCI Camélia',   sub: '5 lots · CRG mai',            amount: '14 760 €', status: 'programmé',    scheduled: true  },
  { init: 'ML', name: 'Mme Laurent',   sub: '2 lots · prélèvement',        amount: '3 180 €',  status: 'virement émis', scheduled: false },
  { init: 'JM', name: 'M. Moreau',     sub: '1 lot · loyer net',           amount: '1 060 €',  status: 'virement émis', scheduled: false },
];

/* ─── Icons ────────────────────────────────────────────────────────── */
const Icon = {
  trend: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 11l3-3 2 2 5-5M9 5h3v3"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 7l3 3 7-7"/></svg>,
  list:  () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 4h10M2 7h10M2 10h6"/><circle cx="11" cy="10" r="2"/></svg>,
  clock: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="5"/><path d="M7 4v3l2 1.5"/></svg>,
};

/* ─── Sub-components ───────────────────────────────────────────────── */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, ...style }}>
    {children}
  </div>
);

const LettrageRow: React.FC<{ label: string; sub: string; amount: string; matched: boolean; dimAmount?: boolean }> = ({ label, sub, amount, matched, dimAmount }) => (
  <div style={{
    background: matched ? '#FFF8F3' : C.white,
    border: `1px ${matched ? 'solid' : 'dashed'} ${matched ? '#FFD9C0' : 'rgba(53,50,48,0.15)'}`,
    borderRadius: 10, padding: '10px 12px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    minHeight: 54,
  }}>
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: matched ? C.textPrimary : '#6C6057' }}>{label}</div>
      <div style={{ fontSize: 11, color: '#AAA09A', marginTop: 2 }}>{sub}</div>
    </div>
    <div style={{
      fontFamily: F.display, fontWeight: 500, fontSize: 14,
      color: dimAmount ? '#AAA09A' : C.textPrimary,
      whiteSpace: 'nowrap', letterSpacing: '-0.02em',
    }}>{amount}</div>
  </div>
);

const Connector: React.FC<{ dashed?: boolean }> = ({ dashed }) => {
  if (dashed) {
    return (
      <div style={{
        width: '100%', height: 2,
        backgroundImage: 'linear-gradient(to right, rgba(53,50,48,0.15) 50%, transparent 50%)',
        backgroundSize: '6px 2px',
      }}/>
    );
  }
  return (
    <div style={{ position: 'relative', width: '100%', height: 2 }}>
      <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, borderRadius: '50%', background: C.accent }}/>
      <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, borderRadius: '50%', background: C.accent }}/>
      <div style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        left: 4, right: 4, height: 2,
        background: `linear-gradient(90deg, ${C.accent}, #FFBD86)`,
      }}/>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 22, height: 22, borderRadius: '50%', background: C.accent,
        boxShadow: '0 2px 6px rgba(255,135,83,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
        zIndex: 2,
      }}>
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4.5l3 3L10 1"/></svg>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
export const Comptabilite: React.FC = () => {
  return (
    <div>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#AAA09A', marginBottom: 14 }}>
        Accueil <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: C.textPrimary, fontWeight: 500 }}>Comptabilité</span>
      </div>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `linear-gradient(135deg, ${C.accent}, #FFBD86)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, boxShadow: '0 4px 16px rgba(255,135,83,0.3)', flexShrink: 0,
        }}>📊</div>
        <div>
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 28, color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Comptabilité locative
          </div>
          <div style={{ fontSize: 13, color: '#AAA09A', marginTop: 2 }}>Période · Mai 2026 · Agence Welcome</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{
            padding: '9px 16px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.white,
            color: C.textPrimary, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6.5 1v8M3 5.5l3.5 3.5L10 5.5M1.5 11.5h10"/></svg>
            Export FEC
          </button>
          <button style={{
            padding: '9px 16px', borderRadius: 9, border: 'none', background: C.accent,
            color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(255,135,83,0.3)',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1.5 6.5l3 3 7-7"/></svg>
            Lettrer
          </button>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {KPIS.map((k, i) => {
          const IconCmp = Icon[k.icon];
          return (
            <div key={i} style={{
              background: C.white, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#AAA09A' }}>
                  {k.label}
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: '#FFF4EE', color: C.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconCmp />
                </div>
              </div>
              <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, letterSpacing: '-0.04em', color: C.textPrimary, lineHeight: 1 }}>
                {k.value}
              </div>
              <div style={{ fontSize: 11.5, color: '#6C6057', display: 'flex', alignItems: 'center', gap: 5 }}>
                {k.foot}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Lettrage + Reversements ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14, alignItems: 'start', marginBottom: 18 }}>

        {/* Lettrage card */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 16, letterSpacing: '-0.03em', color: C.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                Lettrage automatique
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#EDFBF4', color: '#28A566', borderRadius: 100,
                  padding: '3px 9px', fontSize: 11, fontWeight: 600,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#28A566' }}/>
                  6 nouveaux rapprochements
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#AAA09A', marginTop: 4 }}>Banque ↔ quittances · synchro 09:42</div>
            </div>
          </div>

          {/* 2 cols + connectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: 0, alignItems: 'stretch' }}>

            {/* Bank */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#AAA09A', paddingBottom: 6 }}>
                Mouvements bancaires
              </div>
              {BANK_LINES.map((l, i) => (
                <LettrageRow key={i} {...l} dimAmount={!l.matched}/>
              ))}
            </div>

            {/* Connectors */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 28, flexShrink: 0 }}/>
              <div style={{ flex: 1, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Connector/></div>
              <div style={{ flex: 1, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}><Connector/></div>
              <div style={{ flex: 1, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}><Connector/></div>
              <div style={{ flex: 1, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}><Connector dashed/></div>
            </div>

            {/* Quittances */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#AAA09A', paddingBottom: 6 }}>
                Quittances · loyers dus
              </div>
              {QUITTANCES.map((q, i) => (
                <LettrageRow key={i} {...q} dimAmount={!q.matched}/>
              ))}
            </div>

          </div>

          <div style={{
            marginTop: 14, paddingTop: 14, borderTop: '1px dashed rgba(53,50,48,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 12.5, color: '#6C6057',
          }}>
            <div>Économisé ce mois · <b style={{ color: C.textPrimary, fontWeight: 600 }}>4 h 20</b> de saisie manuelle</div>
            <div style={{ color: C.accent, fontWeight: 600, cursor: 'pointer' }}>Voir les 142 rapprochements →</div>
          </div>
        </Card>

        {/* Reversements */}
        <Card>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 16, letterSpacing: '-0.03em', color: C.textPrimary }}>
              Reversements propriétaires
            </div>
            <div style={{ fontSize: 12, color: '#AAA09A', marginTop: 4 }}>Prochain virement · 5 juin</div>
          </div>

          {REVERSEMENTS.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: i < REVERSEMENTS.length - 1 ? '1px solid rgba(53,50,48,0.06)' : 'none',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: '#FFF0E8', color: C.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 12, flexShrink: 0,
              }}>{r.init}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{r.name}</div>
                <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 1 }}>{r.sub}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 15, color: C.textPrimary, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  {r.amount}
                </div>
                <div style={{
                  fontSize: 10.5, marginTop: 2,
                  color: r.scheduled ? C.accent : '#AAA09A',
                  fontWeight: r.scheduled ? 600 : 400,
                }}>{r.status}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* ── Bottom: Régul + Export ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        <Card style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #FFF0E8, #FFE4D4)', color: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="16" height="16" rx="2"/><path d="M3 8h16M8 3v16"/><circle cx="14" cy="14" r="2"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 15, color: C.textPrimary, letterSpacing: '-0.02em' }}>
              Régularisation des charges 2025
            </div>
            <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 3 }}>12 lots sur 24 prêts · provisions vs réelles calculées</div>
            <div style={{ marginTop: 8, width: '100%', height: 6, borderRadius: 3, background: '#F3F0ED', overflow: 'hidden' }}>
              <div style={{ width: '50%', height: '100%', background: `linear-gradient(90deg, ${C.accent}, #FFBD86)` }}/>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1 }}>12/24</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#AAA09A' }}>en cours</div>
          </div>
        </Card>

        <Card style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #FFF0E8, #FFE4D4)', color: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 14v3a2 2 0 002 2h10a2 2 0 002-2v-3M11 3v11M6 9l5 5 5-5"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 15, color: C.textPrimary, letterSpacing: '-0.02em' }}>
              Export comptable
            </div>
            <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 3 }}>FEC · Sage · Cegid · CSV · prêt à transmettre</div>
            <div style={{ marginTop: 8, width: '100%', height: 6, borderRadius: 3, background: '#F3F0ED', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(90deg, ${C.accent}, #FFBD86)` }}/>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1 }}>4</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#AAA09A' }}>formats</div>
          </div>
        </Card>

      </div>
    </div>
  );
};
