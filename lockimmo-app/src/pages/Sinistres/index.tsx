import React from 'react';
import { C, F } from '../../tokens';

/* ─── Data ─────────────────────────────────────────────────────────── */
const KPIS = [
  { label: 'Sinistres ouverts',       value: '8',     foot: '2 critiques · 6 en cours',  tone: 'warn',    icon: 'alert' },
  { label: 'Interventions planifiées', value: '12',    foot: 'Semaine du 1er juin',       tone: 'info',    icon: 'wrench' },
  { label: 'Alertes actives',          value: '3',     foot: 'Échéances < 7 jours',       tone: 'danger',  icon: 'bell' },
  { label: 'Délai moyen résolution',   value: '3,2 j', foot: '↓ 0,8 j vs mois dernier',   tone: 'success', icon: 'clock' },
] as const;

const TABS = ['Tous', 'Sinistres', 'Interventions', 'Alertes', 'Historique'] as const;

const TICKETS = [
  {
    type: 'sinistre', typeLabel: 'Sinistre',
    title: 'Fuite robinet salle de bain',
    property: '12 rue Lafayette · 75009',
    tenant: 'M. Dupont',
    priority: 'high',
    status: 'En cours',
    statusTone: 'warn',
    sla: '2 h restantes',
    slaTone: 'urgent',
    date: '29 mai · 09:42',
    assignee: 'PL',
  },
  {
    type: 'intervention', typeLabel: 'Intervention',
    title: 'Diagnostic chaudière annuel',
    property: '8 av. Foch · 75116',
    tenant: 'Mme Martin',
    priority: 'medium',
    status: 'Planifié',
    statusTone: 'info',
    sla: '1er juin · 14:00',
    slaTone: 'normal',
    date: 'Créé 26 mai',
    assignee: 'JM',
  },
  {
    type: 'sinistre', typeLabel: 'Sinistre',
    title: 'Vitre brisée fenêtre séjour',
    property: '24 bd Voltaire · 75011',
    tenant: 'Mme Leroy',
    priority: 'high',
    status: 'Devis reçu',
    statusTone: 'info',
    sla: '5 jours',
    slaTone: 'normal',
    date: '27 mai · 11:20',
    assignee: 'PL',
  },
  {
    type: 'alerte', typeLabel: 'Alerte',
    title: 'Visite annuelle ascenseur',
    property: '24 bd Voltaire · 75011',
    tenant: 'Copropriété',
    priority: 'medium',
    status: 'À planifier',
    statusTone: 'warn',
    sla: '5 juin',
    slaTone: 'urgent',
    date: 'Récurrent · annuel',
    assignee: 'SY',
  },
  {
    type: 'intervention', typeLabel: 'Intervention',
    title: 'Remplacement chauffe-eau',
    property: '3 rue de Rivoli · 75001',
    tenant: 'M. Bernard',
    priority: 'low',
    status: 'Terminé',
    statusTone: 'success',
    sla: 'Clos le 25 mai',
    slaTone: 'done',
    date: 'Devis 850 €',
    assignee: 'JM',
  },
  {
    type: 'sinistre', typeLabel: 'Sinistre',
    title: 'Dégât des eaux plafond cuisine',
    property: '18 rue Saint-Honoré · 75001',
    tenant: 'Mme Petit',
    priority: 'high',
    status: 'Expertise',
    statusTone: 'warn',
    sla: 'Dossier MAIF #4521',
    slaTone: 'normal',
    date: '24 mai · 16:08',
    assignee: 'PL',
  },
] as const;

const ALERTS = [
  { title: 'Visite annuelle ascenseur',         sub: '24 bd Voltaire',     date: '5 juin',   days: 9,  urgent: true  },
  { title: 'Contrôle chaudière obligatoire',    sub: '12 rue Lafayette',   date: '8 juin',   days: 12, urgent: true  },
  { title: 'Diagnostic électrique décennal',    sub: '8 av. Foch',         date: '22 juin',  days: 26, urgent: false },
  { title: 'Ramonage cheminée',                 sub: '3 rue de Rivoli',    date: '15 juil.', days: 49, urgent: false },
];

const INTERVENTIONS = [
  { date: '1er juin', time: '14:00', title: 'Diagnostic chaudière', vendor: 'Eiffage Énergie' },
  { date: '3 juin',   time: '09:30', title: 'Remplacement serrure', vendor: 'Locksmith Pro'    },
  { date: '5 juin',   time: '10:00', title: 'Contrôle ascenseur',   vendor: 'Otis Maintenance' },
];

/* ─── Icons ────────────────────────────────────────────────────────── */
const Icon = {
  alert:  () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M7 1.5l6 11H1l6-11z"/><path d="M7 5.5v3M7 10v.5"/></svg>,
  wrench: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 1.5a3 3 0 00-2.5 4.7L1 11.7l1.3 1.3 5.5-5.5A3 3 0 1010 4.5"/></svg>,
  bell:   () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 5.5a4 4 0 018 0V8l1.5 1.5h-11L3 8V5.5z"/><path d="M5.5 11.5a1.5 1.5 0 003 0"/></svg>,
  clock:  () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="5"/><path d="M7 4v3l2 1.5"/></svg>,
};

const TYPE_STYLES: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  sinistre: {
    bg: 'rgba(224,82,82,0.10)', color: '#E05252',
    icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 1l5 9H1l5-9z"/><path d="M6 4.5v2.5M6 8.5v0.5"/></svg>,
  },
  intervention: {
    bg: 'rgba(59,125,248,0.10)', color: '#3B7DF8',
    icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1.5a2.5 2.5 0 00-2 4L1 10.5l1 1L7 6.5a2.5 2.5 0 100-5"/></svg>,
  },
  alerte: {
    bg: 'rgba(255,135,83,0.10)', color: C.accent,
    icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 4.5a3 3 0 016 0v2L10 7.5H2L3 6.5V4.5z"/></svg>,
  },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  warn:    { bg: '#FFF4EE', color: C.accent },
  info:    { bg: '#EEF4FF', color: '#3B7DF8' },
  success: { bg: '#EDFBF4', color: '#28A566' },
  danger:  { bg: '#FFF0F0', color: '#E05252' },
};

const PRIORITY_DOT: Record<string, string> = {
  high:   '#E05252',
  medium: C.accent,
  low:    '#AAA09A',
};

/* ─── Hover CSS for alerts ─────────────────────────────────────────── */
const ALERTS_CSS = `
@keyframes alert-badge-pop {
  0%   { transform: scale(1); }
  60%  { transform: scale(1.18); }
  100% { transform: scale(1.10); }
}
.alerts-item {
  transition: transform 0.24s cubic-bezier(0.34, 1.4, 0.64, 1),
              background 0.18s ease,
              box-shadow 0.24s ease,
              border-color 0.18s ease;
  position: relative;
  z-index: 1;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid transparent;
}
.alerts-item:hover {
  transform: scale(1.04);
  background: #FFF8F3;
  border-color: rgba(255,135,83,0.18);
  box-shadow: 0 10px 28px rgba(53,50,48,0.10), 0 2px 6px rgba(53,50,48,0.05);
  z-index: 2;
}
.alerts-item:hover .alerts-badge {
  animation: alert-badge-pop 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
}
.alerts-item:hover .alerts-arrow {
  transform: translateX(4px);
  color: #FF8753;
}
.alerts-arrow {
  transition: transform 0.22s ease, color 0.22s ease;
}
.alerts-badge {
  transform-origin: center;
}
`;

/* ─── Sub-components ───────────────────────────────────────────────── */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, ...style }}>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
export const Sinistres: React.FC = () => {
  return (
    <div>
      <style>{ALERTS_CSS}</style>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#AAA09A', marginBottom: 14 }}>
        Accueil <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: C.textPrimary, fontWeight: 500 }}>Sinistres & interventions</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'linear-gradient(135deg, #E05252, #FF8753)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, boxShadow: '0 4px 16px rgba(224,82,82,0.25)', flexShrink: 0,
        }}>🛠️</div>
        <div>
          <div style={{ marginBottom: 6 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#EDFBF4', color: '#28A566',
              fontSize: 11, fontWeight: 600,
              padding: '4px 10px', borderRadius: 100,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#28A566' }}/>
              Conforme aux exigences de la carte G
            </span>
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 28, color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Sinistres & interventions
          </div>
          <div style={{ fontSize: 13, color: '#AAA09A', marginTop: 2 }}>Demandes, interventions, alertes et historique du quotidien</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{
            padding: '9px 16px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.white,
            color: C.textPrimary, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 4.5h9M2 6.5h9M2 8.5h9"/></svg>
            Filtrer
          </button>
          <button style={{
            padding: '9px 16px', borderRadius: 9, border: 'none', background: C.accent,
            color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(255,135,83,0.3)',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M6.5 2v9M2 6.5h9"/></svg>
            Nouvelle demande
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {KPIS.map((k, i) => {
          const tone = STATUS_STYLES[k.tone];
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
                  background: tone.bg, color: tone.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconCmp />
                </div>
              </div>
              <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 26, letterSpacing: '-0.04em', color: C.textPrimary, lineHeight: 1 }}>
                {k.value}
              </div>
              <div style={{ fontSize: 11.5, color: '#6C6057' }}>{k.foot}</div>
            </div>
          );
        })}
      </div>

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14, alignItems: 'start' }}>

        {/* Ticket list */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '14px 18px 0', borderBottom: `1px solid ${C.border}` }}>
            {TABS.map((t, i) => (
              <button key={t} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '8px 14px', marginBottom: -1,
                fontSize: 13, fontWeight: i === 0 ? 600 : 500,
                color: i === 0 ? C.accent : '#6C6057',
                borderBottom: i === 0 ? `2px solid ${C.accent}` : '2px solid transparent',
                fontFamily: 'inherit',
              }}>{t}</button>
            ))}
            <div style={{ marginLeft: 'auto', paddingBottom: 8, fontSize: 11.5, color: '#AAA09A' }}>
              {TICKETS.length} demandes
            </div>
          </div>

          {/* Tickets */}
          <div>
            {TICKETS.map((t, i) => {
              const typeStyle = TYPE_STYLES[t.type];
              const statusStyle = STATUS_STYLES[t.statusTone];
              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr auto auto',
                  alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  borderBottom: i < TICKETS.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  {/* Type */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: typeStyle.bg, color: typeStyle.color,
                    padding: '4px 9px', borderRadius: 6,
                    fontSize: 11, fontWeight: 600, width: 'fit-content',
                  }}>
                    {typeStyle.icon}
                    {t.typeLabel}
                  </div>

                  {/* Title + property */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_DOT[t.priority], flexShrink: 0 }}/>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary }}>{t.title}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 2, paddingLeft: 15 }}>
                      {t.property} · {t.tenant} · {t.date}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: statusStyle.bg, color: statusStyle.color,
                    padding: '4px 10px', borderRadius: 6,
                    fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                  }}>{t.status}</div>

                  {/* SLA + assignee */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 11.5, fontWeight: 600,
                        color: t.slaTone === 'urgent' ? '#E05252' : t.slaTone === 'done' ? '#28A566' : C.textPrimary,
                        whiteSpace: 'nowrap',
                      }}>{t.sla}</div>
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#FFF0E8', color: C.accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10.5, fontWeight: 700, flexShrink: 0,
                    }}>{t.assignee}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 18px',
            background: '#FAFAF9',
            borderTop: `1px solid ${C.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 12, color: '#6C6057',
          }}>
            <span>Affichage de 6 demandes sur 23 actives</span>
            <a style={{ color: C.accent, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>Voir tout l'historique →</a>
          </div>
        </Card>

        {/* Right column: alerts + interventions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Alerts panel */}
          <Card>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 16, letterSpacing: '-0.03em', color: C.textPrimary }}>
                  Alertes & rappels
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: '#FFF0F0', color: '#E05252',
                  fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E05252' }}/>
                  2 urgentes
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#AAA09A', marginTop: 2 }}>Échéances réglementaires &amp; visites</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '0 -6px' }}>
              {ALERTS.map((a, i) => (
                <div key={i} className="alerts-item" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 8px',
                }}>
                  <div className="alerts-badge" style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: a.urgent ? '#FFF0F0' : '#FFF4EE',
                    color: a.urgent ? '#E05252' : C.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: F.display, fontSize: 13, fontWeight: 600,
                    flexShrink: 0, letterSpacing: '-0.02em',
                  }}>{a.days}j</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{a.title}</div>
                    <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 1 }}>{a.sub} · {a.date}</div>
                  </div>
                  <svg className="alerts-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ color: '#AAA09A' }}><path d="M5 3l4 4-4 4"/></svg>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming interventions */}
          <Card>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 16, letterSpacing: '-0.03em', color: C.textPrimary }}>
                Prochaines interventions
              </div>
              <div style={{ fontSize: 12, color: '#AAA09A', marginTop: 2 }}>Semaine du 1<sup>er</sup> juin</div>
            </div>

            {INTERVENTIONS.map((iv, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < INTERVENTIONS.length - 1 ? '1px solid rgba(53,50,48,0.06)' : 'none',
              }}>
                <div style={{
                  width: 44, textAlign: 'center', flexShrink: 0,
                  paddingRight: 12, borderRight: '1px solid rgba(53,50,48,0.08)',
                }}>
                  <div style={{ fontFamily: F.display, fontSize: 14, fontWeight: 500, color: C.textPrimary, letterSpacing: '-0.02em' }}>
                    {iv.date.replace(/\sjuin/, '')}
                  </div>
                  <div style={{ fontSize: 10, color: '#AAA09A', marginTop: 1 }}>{iv.time}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{iv.title}</div>
                  <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 1 }}>{iv.vendor}</div>
                </div>
              </div>
            ))}
          </Card>

        </div>

      </div>

    </div>
  );
};
