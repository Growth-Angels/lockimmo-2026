import React from 'react';
import { C, F } from '../../tokens';

/* ───────────────────────────── BLOC 1 — Générateur de baux ───────────────────────────── */
const GenerateurBaux: React.FC = () => (
  <FeatureCard
    title="Générateur de baux"
    desc="Pré-rempli depuis vos fiches biens et locataires. PDF conforme en un clic."
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <FormRow label="Bien" value="3 rue de la Paix — Apt. 4" icon="🏠" />
      <FormRow label="Locataire" value="Sophie Martin" icon="👤" />
      <div style={{ display: 'flex', gap: 10 }}>
        <FormRow label="Début" value="01/06/2026" icon="📅" flex />
        <FormRow label="Durée" value="3 ans" icon="⏱️" flex />
      </div>
      <button style={cta}>Générer le bail PDF →</button>
    </div>
  </FeatureCard>
);

/* ───────────────────────────── BLOC 2 — Fiches de biens complètes ────────────────────── */
const FichesBiens: React.FC = () => {
  const biens = [
    { adr: '3 rue de la Paix',    type: 'T3 · 64 m²',   loyer: '1 250 €', status: 'Loué',   color: C.success },
    { adr: '12 bd Haussmann',     type: 'Studio · 28 m²', loyer: '890 €',   status: 'Loué',   color: C.success },
    { adr: '7 av. Foch',          type: 'T2 · 42 m²',   loyer: '1 100 €', status: 'Vacant', color: C.accent  },
    { adr: '21 rue Lafayette',    type: 'T4 · 85 m²',   loyer: '1 780 €', status: 'Loué',   color: C.success },
  ];
  return (
    <FeatureCard
      title="Fiches de biens complètes"
      desc="Adresse, surface, locataire, loyer, diagnostics — tout en une vue."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {biens.map(b => (
          <div key={b.adr} style={{
            background: C.bgLight, borderRadius: 10, padding: '12px 14px',
            border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{b.adr}</div>
              <div style={{
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100,
                background: b.color === C.success ? C.successLight : C.accentLight,
                color: b.color,
              }}>{b.status}</div>
            </div>
            <div style={{ fontSize: 11, color: C.textSecondary }}>{b.type}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginTop: 2 }}>{b.loyer}<span style={{ color: C.textSecondary, fontWeight: 400, fontSize: 11 }}> /mois</span></div>
          </div>
        ))}
      </div>
    </FeatureCard>
  );
};

/* ───────────────────────────── BLOC 3 — Suivi des locataires ─────────────────────────── */
const SuiviLocataires: React.FC = () => {
  const rows = [
    { name: 'Sophie Martin',     bien: 'Apt. 4 — Paix',     loyer: '1 250 €', dot: C.success, etat: 'À jour'        },
    { name: 'Lucas Dubois',      bien: 'Studio Haussmann',  loyer: '890 €',   dot: C.success, etat: 'À jour'        },
    { name: 'Camille Leblanc',   bien: 'T4 Lafayette',      loyer: '1 780 €', dot: C.error,   etat: 'Retard J+8'    },
    { name: 'Antoine Garnier',   bien: 'T2 Foch',           loyer: '1 100 €', dot: C.accent,  etat: 'Préavis'        },
  ];
  return (
    <FeatureCard
      title="Suivi des locataires"
      desc="État des paiements, préavis, contacts — tout l'historique par locataire."
    >
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.2fr', gap: 0,
          padding: '10px 14px', background: C.bgLight,
          fontSize: 10, fontWeight: 700, color: C.textSecondary,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <span>Locataire</span><span>Bien</span><span>Loyer</span><span>État</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.name} style={{
            display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.2fr', gap: 0,
            padding: '12px 14px', fontSize: 12,
            borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none',
            alignItems: 'center',
          }}>
            <span style={{ fontWeight: 700, color: C.textPrimary }}>{r.name}</span>
            <span style={{ color: C.textSecondary }}>{r.bien}</span>
            <span style={{ fontWeight: 600, color: C.textPrimary }}>{r.loyer}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: r.dot }}>{r.etat}</span>
            </span>
          </div>
        ))}
      </div>
    </FeatureCard>
  );
};

/* ───────────────────────────── BLOC 4 — Historique des documents ─────────────────────── */
const HistoriqueDocuments: React.FC = () => {
  const docs = [
    { type: 'PDF', name: 'Bail — Sophie Martin',           date: '01/06/2026', size: '184 Ko', color: C.error  },
    { type: 'PDF', name: 'Quittance — Mai 2026',           date: '03/05/2026', size: '42 Ko',  color: C.error  },
    { type: 'DOC', name: 'État des lieux — Apt. 4',        date: '28/05/2026', size: '1,2 Mo', color: C.blue   },
    { type: 'PDF', name: 'Diagnostic DPE — Lafayette',     date: '12/04/2026', size: '320 Ko', color: C.error  },
    { type: 'XLS', name: 'Récap charges 2025',             date: '10/01/2026', size: '88 Ko',  color: C.success },
  ];
  return (
    <FeatureCard
      title="Historique des documents"
      desc="Tous les baux, quittances, états des lieux et diagnostics — datés et signés."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {docs.map(d => (
          <div key={d.name} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', background: C.bgLight,
            borderRadius: 10, border: `1px solid ${C.border}`,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6,
              background: d.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 800, letterSpacing: '0.02em',
              flexShrink: 0,
            }}>{d.type}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{d.name}</div>
              <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>{d.date} · {d.size}</div>
            </div>
            <span style={{ fontSize: 11, color: C.textSecondary, cursor: 'pointer' }}>Télécharger</span>
          </div>
        ))}
      </div>
    </FeatureCard>
  );
};

/* ───────────────────────────── BLOC 5 — Archivage automatique ────────────────────────── */
const ArchivageAuto: React.FC = () => {
  const folders = [
    { name: 'Baux signés',       count: 142, color: C.accent  },
    { name: 'Quittances 2026',   count: 587, color: C.success },
    { name: 'États des lieux',   count:  84, color: C.blue    },
    { name: 'Diagnostics',       count:  46, color: C.purple  },
  ];
  return (
    <FeatureCard
      title="Archivage automatique"
      desc="Chaque document signé est rangé, daté et conservé 10 ans automatiquement."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {folders.map(f => (
          <div key={f.name} style={{
            background: C.bgLight, borderRadius: 10, padding: '14px 16px',
            border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `${f.color}1F`, color: f.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{f.name}</div>
              <div style={{ fontSize: 11, color: C.textSecondary }}>{f.count} documents</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 14, padding: '10px 14px',
        background: C.successLight, borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 12, color: C.success, fontWeight: 600,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        859 documents archivés automatiquement ce mois-ci
      </div>
    </FeatureCard>
  );
};

/* ───────────────────────────── Sous-composants partagés ──────────────────────────────── */
const FeatureCard: React.FC<{ title: string; desc: string; children: React.ReactNode }> = ({ title, desc, children }) => (
  <section style={{
    background: C.white, borderRadius: 20,
    padding: 28, border: `1px solid ${C.border}`,
    display: 'flex', flexDirection: 'column', gap: 16,
  }}>
    <div>
      <h3 style={{
        fontFamily: F.display, fontSize: 24, fontWeight: 600,
        color: C.textPrimary, letterSpacing: '-0.02em', margin: '0 0 6px',
      }}>{title}</h3>
      <p style={{ fontSize: 14, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>{desc}</p>
    </div>
    {children}
  </section>
);

const FormRow: React.FC<{ label: string; value: string; icon: string; flex?: boolean }> = ({ label, value, icon, flex }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', background: C.bgLight,
    borderRadius: 10, border: `1px solid ${C.border}`,
    flex: flex ? 1 : undefined,
  }}>
    <span style={{ fontSize: 16 }}>{icon}</span>
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginTop: 1 }}>{value}</div>
    </div>
  </div>
);

const cta: React.CSSProperties = {
  background: C.accent, color: '#fff', border: 'none',
  padding: '12px 20px', borderRadius: 100,
  fontSize: 13, fontWeight: 700, cursor: 'pointer',
  fontFamily: F.body, marginTop: 4, alignSelf: 'flex-start',
};

/* ───────────────────────────── Page ─────────────────────────────────────────────────── */
export const PitchGestion: React.FC = () => {
  return (
    <div>
      {/* ─── Pitch header (capture) ─── */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 16px',
        background: 'rgba(40,165,102,0.10)',
        border: '1px solid rgba(40,165,102,0.18)',
        borderRadius: 100, marginBottom: 20,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.success }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: C.success, letterSpacing: '-0.01em' }}>
          Conforme aux exigences de la carte G
        </span>
      </div>
      <h1 style={{
        fontFamily: F.display, fontSize: 38, fontWeight: 600,
        color: C.textPrimary, letterSpacing: '-0.035em',
        lineHeight: 1.1, margin: '0 0 12px',
      }}>
        Centralisez toute votre gestion<br />locative dans un seul outil
      </h1>
      <p style={{
        fontSize: 15, color: C.textSecondary, lineHeight: 1.55,
        margin: '0 0 28px', fontWeight: 400, maxWidth: 640,
      }}>
        Retrouvez toutes les informations importantes dans un seul outil.
      </p>

      {/* ─── 5 blocs fonctionnels ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <GenerateurBaux />
        <FichesBiens />
        <SuiviLocataires />
        <HistoriqueDocuments />
        <ArchivageAuto />
      </div>
    </div>
  );
};
