import React from 'react';
import { C, F } from '../../../tokens';
import { LockimmoLogo, LockimmoMark } from '../../../brand';

/**
 * Mockup — Logiciel de gestion locative
 * Format 960×640. Aucune image externe.
 *
 * Deux rendus à partir de la même source :
 *  · <GestionLocative />          → rendu statique, strictement identique à l'origine
 *                                   (aucune balise <style>, aucune propriété `animation`).
 *  · <GestionLocative animated /> → le même écran, construit progressivement, en boucle 6 s.
 *
 * Convention de motion (identique à AiAutomation / LiveDashboard) : le décalage entre
 * éléments est encodé DANS les pourcentages des keyframes, jamais via un décalage de
 * démarrage, pour que tous partagent la même phase de boucle et se réinitialisent ensemble.
 *
 * Intention éditoriale : montrer un gestionnaire dont tout est sous contrôle —
 * occupation pleine, zéro impayé, quittances parties toutes seules, conformité 2026 acquise.
 */

const W = 960;
const H = 640;

/**
 * Injecte (ou non) une propriété `animation` — et, le cas échéant, les propriétés
 * strictement liées au motion (origine de transformation…). En statique : objet vide.
 */
type AnimFn = (value: string, extra?: React.CSSProperties) => React.CSSProperties;

const SIDEBAR_W = 196;
const TOPBAR_H = 60;
const PAD = 22;

const CONTENT_W = W - SIDEBAR_W - PAD * 2;   // 720
const COL_L = 420;
const COL_R = 284;
const GUTTER = 16;

const SHADOW = '0 2px 8px rgba(53,50,48,0.05)';

const cardStyle = (h: number, w?: number): React.CSSProperties => ({
  width: w,
  height: h,
  boxSizing: 'border-box',
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  boxShadow: SHADOW,
  padding: 16,
});

/* ───────────────────────── Primitives ───────────────────────── */

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({
  d, size = 14, color = C.textMuted, sw = 1.8,
}) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const CheckDot: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 14, style }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', background: C.success,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    ...style,
  }}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none"
      stroke={C.white} strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </div>
);

const Pill: React.FC<{
  text: string; color: string; bg: string; size?: number; style?: React.CSSProperties;
}> = ({
  text, color, bg, size = 8.5, style,
}) => (
  <span style={{
    display: 'inline-block', background: bg, color, borderRadius: 100,
    padding: '3px 8px', fontSize: size, fontWeight: 700, letterSpacing: '0.2px',
    whiteSpace: 'nowrap', lineHeight: '11px',
    ...style,
  }}>
    {text}
  </span>
);

const CardTitle: React.FC<{ left: string; right?: string }> = ({ left, right }) => (
  <div style={{
    height: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <span style={{ fontFamily: F.display, fontSize: 12.5, fontWeight: 700, color: C.textPrimary }}>
      {left}
    </span>
    {right && (
      <span style={{
        fontSize: 9.5, fontWeight: 500, color: C.textMuted, fontVariantNumeric: 'tabular-nums',
      }}>
        {right}
      </span>
    )}
  </div>
);

/* ───────────────────────── Barre latérale ───────────────────────── */

const NAV: [string, string, boolean][] = [
  ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z', 'Synthèse', true],
  ['M3 21h18M5 21V7l7-4 7 4v14M9 10h2M13 10h2M9 14h2M13 14h2', 'Lots & immeubles', false],
  ['M6 2h9l5 5v15H6zM15 2v5h5M9 13h7M9 17h5', 'Baux', false],
  ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9', 'Locataires', false],
  ['M5 3h14v18l-3-2-2 2-2-2-2 2-3-2zM9 8h6M9 12h4', 'Quittances', false],
  ['M5 2h14v20H5zM8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01', 'Comptabilité', false],
  ['M13 2 3 14h8l-1 8 10-12h-8z', 'Facturation élec.', false],
  ['M21 12a9 9 0 1 1-3-6.7M21 3v6h-6', 'Automatisations', false],
];

const NavItem: React.FC<{ d: string; label: string; active: boolean }> = ({ d, label, active }) => (
  <div style={{
    height: 30, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10,
    padding: '0 10px', borderRadius: 8,
    background: active ? C.white : 'transparent',
    border: `1px solid ${active ? C.border : 'transparent'}`,
    boxShadow: active ? SHADOW : 'none',
  }}>
    <Icon d={d} color={active ? C.accent : C.textMuted} sw={active ? 2 : 1.7} />
    <span style={{
      fontSize: 11.5, fontWeight: active ? 700 : 500,
      color: active ? C.textPrimary : C.textSecondary, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  </div>
);

const Sidebar: React.FC = () => (
  <div style={{
    width: SIDEBAR_W, height: H, boxSizing: 'border-box', flexShrink: 0,
    background: C.bgWarm, borderRight: `1px solid ${C.border}`,
    padding: '18px 16px', display: 'flex', flexDirection: 'column',
  }}>
    <LockimmoLogo markSize={26} wordHeight={12} color={C.textPrimary} gap={9} />

    {/* Sélecteur de portefeuille */}
    <div style={{
      marginTop: 18, height: 46, boxSizing: 'border-box',
      background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: SHADOW,
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 7, background: C.accentLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon d="M3 21h18M5 21V8l7-4 7 4v13M10 12h4M10 16h4" size={13} color={C.accent} sw={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: C.textPrimary, lineHeight: '13px' }}>
          SCI Bellevue
        </div>
        <div style={{
          fontSize: 8.5, color: C.textMuted, lineHeight: '11px', fontVariantNumeric: 'tabular-nums',
        }}>
          24 lots · 3 immeubles
        </div>
      </div>
      <Icon d="m6 9 6 6 6-6" size={11} color={C.textMuted} sw={2} />
    </div>

    <div style={{
      marginTop: 20, marginBottom: 8, height: 12, fontSize: 8.5, fontWeight: 700,
      letterSpacing: '1.2px', color: C.textMuted, lineHeight: '12px',
    }}>
      PILOTAGE
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {NAV.map(([d, label, active]) => (
        <NavItem key={label} d={d} label={label} active={active} />
      ))}
    </div>

    {/* Prochaine échéance */}
    <div style={{
      marginTop: 22, height: 100, boxSizing: 'border-box',
      background: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
      boxShadow: SHADOW, padding: 12,
    }}>
      <div style={{
        fontSize: 8, fontWeight: 700, letterSpacing: '1px', color: C.textMuted, lineHeight: '11px',
      }}>
        PROCHAINE ÉCHÉANCE
      </div>
      <div style={{
        marginTop: 6, fontFamily: F.display, fontSize: 11.5, fontWeight: 700,
        color: C.textPrimary, lineHeight: '14px',
      }}>
        Quittances de juillet
      </div>
      <div style={{
        marginTop: 3, fontSize: 9, color: C.textSecondary, lineHeight: '12px',
        fontVariantNumeric: 'tabular-nums',
      }}>
        Envoi automatique le 01/07
      </div>
      <div style={{ marginTop: 9 }}>
        <Pill text="PROGRAMMÉ · 24 LOTS" color={C.success} bg={C.successLight} size={8} />
      </div>
    </div>

    {/* Utilisateur */}
    <div style={{
      marginTop: 'auto', height: 48, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', gap: 9,
      borderTop: `1px solid ${C.border}`, paddingTop: 12,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: C.accentLight, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, color: C.accent,
      }}>
        CV
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: C.textPrimary, lineHeight: '13px' }}>
          Claire Vasseur
        </div>
        <div style={{ fontSize: 8.5, color: C.textMuted, lineHeight: '11px' }}>
          Gestionnaire · Mandat n°412
        </div>
      </div>
    </div>
  </div>
);

/* ───────────────────────── Barre supérieure ───────────────────────── */

const TopBar: React.FC = () => (
  <div style={{
    height: TOPBAR_H, boxSizing: 'border-box', flexShrink: 0,
    background: C.white, borderBottom: `1px solid ${C.border}`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 22px',
  }}>
    <div>
      <div style={{ fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.textPrimary, lineHeight: '21px' }}>
        Gestion locative
      </div>
      <div style={{
        fontSize: 10, color: C.textMuted, lineHeight: '13px', marginTop: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        Synthèse · Juin 2026 · Mise à jour il y a 4 min
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 178, height: 32, boxSizing: 'border-box', background: C.bgApp,
        border: `1px solid ${C.border}`, borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 7, padding: '0 10px',
      }}>
        <Icon d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3" size={13} color={C.textMuted} />
        <span style={{ fontSize: 10.5, color: C.textMuted }}>Rechercher un bail…</span>
      </div>
      <div style={{
        height: 32, boxSizing: 'border-box', background: C.accent, borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 7, padding: '0 13px',
      }}>
        <Icon d="M12 5v14M5 12h14" size={13} color={C.white} sw={2.4} />
        <span style={{ fontSize: 11, fontWeight: 700, color: C.white }}>Nouvelle quittance</span>
      </div>
    </div>
  </div>
);

/* ───────────────────────── KPI ───────────────────────── */

type Kpi = { label: string; value: string; sub: string };

const KPIS: Kpi[] = [
  { label: "TAUX D'OCCUPATION", value: '100 %', sub: '24 lots sur 24 occupés' },
  { label: 'LOYERS ENCAISSÉS', value: '98,5 %', sub: '↗ +2,3 pts vs mai' },
  { label: 'IMPAYÉS', value: '0 €', sub: 'Aucun retard en cours' },
  { label: 'REVENUS 2026', value: '271 400 €', sub: '↗ +6,2 % vs 2025' },
];

const KpiCard: React.FC<{ k: Kpi; i: number; anim: AnimFn }> = ({ k, i, anim }) => (
  <div style={{
    flex: 1, height: 92, boxSizing: 'border-box',
    background: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
    boxShadow: SHADOW, padding: '12px 14px',
    ...anim(`gl-kpi-${i} 6s cubic-bezier(.2,.8,.3,1) 0s infinite both`),
  }}>
    <div style={{
      fontSize: 8.5, fontWeight: 700, letterSpacing: '1.1px', color: C.textMuted,
      lineHeight: '12px', whiteSpace: 'nowrap',
    }}>
      {k.label}
    </div>
    <div style={{
      marginTop: 4, fontFamily: F.display, fontSize: 26, fontWeight: 700,
      color: C.textPrimary, lineHeight: '30px', fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    }}>
      {k.value}
    </div>
    <div style={{
      marginTop: 5, display: 'flex', alignItems: 'center', gap: 5, height: 13,
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.success, flexShrink: 0 }} />
      <span style={{
        fontSize: 9.5, fontWeight: 600, color: C.success, lineHeight: '13px',
        fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
      }}>
        {k.sub}
      </span>
    </div>
  </div>
);

/* ───────────────────────── Graphique d'encaissements ───────────────────────── */

const SVG_W = COL_L - 32;   // 388
const SVG_H = 110;
const BASE_Y = 88;
const SLOT = SVG_W / 6;
const BAR_W = 34;

/** [mois, hauteur de barre, mois courant] */
const BARS: [string, number, boolean][] = [
  ['JAN', 34, false], ['FÉV', 40, false], ['MAR', 48, false],
  ['AVR', 54, false], ['MAI', 64, false], ['JUIN', 72, true],
];

const EncaissementsCard: React.FC<{ anim: AnimFn }> = ({ anim }) => (
  <div style={{ ...cardStyle(210, COL_L) }}>
    <CardTitle left="Encaissements" right="6 derniers mois" />

    <div style={{
      marginTop: 10, height: 34, display: 'flex', alignItems: 'flex-end', gap: 10,
      ...anim('gl-enc-head 6s cubic-bezier(.2,.8,.3,1) 0s infinite both'),
    }}>
      <span style={{
        fontFamily: F.display, fontSize: 30, fontWeight: 700, color: C.textPrimary,
        lineHeight: '32px', fontVariantNumeric: 'tabular-nums',
      }}>
        46 820 €
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, background: C.successLight,
        borderRadius: 100, padding: '3px 8px', marginBottom: 4,
      }}>
        <span style={{ fontSize: 8, color: C.success, lineHeight: '11px' }}>▲</span>
        <span style={{
          fontSize: 9.5, fontWeight: 700, color: C.success, lineHeight: '11px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          +6,2 % vs N-1
        </span>
      </span>
      <span style={{
        fontSize: 9.5, color: C.textMuted, marginBottom: 5, lineHeight: '12px',
      }}>
        encaissés en juin
      </span>
    </div>

    <svg width={SVG_W} height={SVG_H} style={{ display: 'block', marginTop: 8 }}>
      {[22, 44, 66].map((y) => (
        <line key={y} x1="0" y1={y} x2={SVG_W} y2={y} stroke={C.border} strokeWidth="1" />
      ))}
      <line x1="0" y1={BASE_Y} x2={SVG_W} y2={BASE_Y} stroke={C.borderStrong} strokeWidth="1" />

      {BARS.map(([m, h, cur], i) => {
        const x = i * SLOT + (SLOT - BAR_W) / 2;
        return (
          <g key={m}>
            <rect
              x={x} y={BASE_Y - h} width={BAR_W} height={h} rx="5"
              fill={cur ? C.accent : C.accentSoft}
              style={anim(
                `gl-bar-${i} 6s cubic-bezier(.2,.85,.3,1) 0s infinite both`,
                { transformBox: 'fill-box', transformOrigin: 'bottom' },
              )}
            />
            <text
              x={x + BAR_W / 2} y={BASE_Y + 16} textAnchor="middle"
              fontSize="8.5" fontWeight={cur ? 700 : 600}
              fill={cur ? C.accent : C.textMuted} letterSpacing="0.5"
            >
              {m}
            </text>
          </g>
        );
      })}

      <text
        x={5 * SLOT + SLOT / 2} y={BASE_Y - 72 - 6} textAnchor="middle"
        fontSize="9" fontWeight="700" fill={C.accent}
        style={{
          fontVariantNumeric: 'tabular-nums',
          ...anim('gl-bar-label 6s cubic-bezier(.2,.8,.3,1) 0s infinite both'),
        }}
      >
        46 820 €
      </text>
    </svg>
  </div>
);

/* ───────────────────────── Automatisations ───────────────────────── */

const AUTOS: [string, string][] = [
  ['Quittances envoyées', '24'],
  ['Appels de loyer émis', '15'],
  ['Révisions IRL appliquées', '8'],
];

const AutomationsCard: React.FC<{ anim: AnimFn }> = ({ anim }) => (
  <div style={{ ...cardStyle(210, COL_R) }}>
    <div style={{ height: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
      <LockimmoMark size={20} radius={6} />
      <span style={{
        fontFamily: F.display, fontSize: 12.5, fontWeight: 700, color: C.textPrimary, flex: 1,
      }}>
        Automatisations
      </span>
      <Pill text="ACTIVES" color={C.success} bg={C.successLight} size={8} />
    </div>

    <div style={{
      marginTop: 12, height: 42, display: 'flex', alignItems: 'center', gap: 11,
      ...anim('gl-auto-num 6s cubic-bezier(.2,.8,.3,1) 0s infinite both'),
    }}>
      <span style={{
        fontFamily: F.display, fontSize: 34, fontWeight: 700, color: C.accent,
        lineHeight: '36px', fontVariantNumeric: 'tabular-nums',
      }}>
        47
      </span>
      <span style={{ fontSize: 10.5, color: C.textSecondary, lineHeight: '14px' }}>
        tâches réalisées sans vous<br />ce mois-ci
      </span>
    </div>

    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {AUTOS.map(([label, n], i) => (
        <div key={label} style={{
          height: 26, boxSizing: 'border-box', background: C.bgLight,
          border: `1px solid ${C.border}`, borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
          ...anim(`gl-auto-${i} 6s cubic-bezier(.2,.8,.3,1) 0s infinite both`),
        }}>
          <CheckDot
            size={12}
            style={anim(`gl-auto-dot-${i} 6s cubic-bezier(.2,.8,.3,1) 0s infinite both`)}
          />
          <span style={{ fontSize: 10.5, color: C.textSecondary, flex: 1, whiteSpace: 'nowrap' }}>
            {label}
          </span>
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: C.textPrimary,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {n}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ───────────────────────── Baux ───────────────────────── */

type Bail = {
  tag: string; lot: string; detail: string;
  tenant: string; bail: string; rent: string;
  status: string; color: string; bg: string;
};

const BAUX: Bail[] = [
  {
    tag: 'B', lot: 'Lot B12', detail: '3 pièces · 62 m² · DPE C',
    tenant: 'Camille Rousseau', bail: 'Bail 3 ans · 01/09/2024', rent: '1 240 €',
    status: 'Quittance envoyée', color: C.success, bg: C.successLight,
  },
  {
    tag: 'A', lot: 'Lot A04', detail: '2 pièces · 41 m² · DPE B',
    tenant: 'Thomas Nguyen', bail: 'Bail 3 ans · 15/03/2025', rent: '890 €',
    status: 'À jour', color: C.success, bg: C.successLight,
  },
  {
    tag: 'C', lot: 'Lot C21', detail: 'Studio · 24 m² · DPE C',
    tenant: 'Léa Bonnet', bail: 'Bail meublé · 01/01/2026', rent: '615 €',
    status: 'Quittance envoyée', color: C.success, bg: C.successLight,
  },
  {
    tag: 'B', lot: 'Lot B07', detail: '4 pièces · 85 m² · DPE B',
    tenant: 'Famille Moreau', bail: 'Bail 3 ans · 01/06/2023', rent: '1 480 €',
    status: 'IRL appliqué', color: C.info, bg: C.infoLight,
  },
];

const COLS = { lot: 130, tenant: 104, rent: 62, status: 92 };

const BauxCard: React.FC<{ anim: AnimFn }> = ({ anim }) => (
  <div style={{ ...cardStyle(202, COL_L) }}>
    <CardTitle left="Baux & quittances" right="24 baux actifs · 0 impayé" />

    <div style={{
      marginTop: 10, height: 14, display: 'flex', alignItems: 'center',
      fontSize: 8, fontWeight: 700, letterSpacing: '1px', color: C.textMuted,
    }}>
      <div style={{ width: COLS.lot }}>LOT</div>
      <div style={{ width: COLS.tenant }}>LOCATAIRE</div>
      <div style={{ width: COLS.rent, textAlign: 'right' }}>LOYER</div>
      <div style={{ width: COLS.status, textAlign: 'right' }}>STATUT</div>
    </div>

    {BAUX.map((b, i) => (
      <div key={b.lot} style={{
        height: 32, display: 'flex', alignItems: 'center',
        borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
        ...anim(`gl-bail-${i} 6s cubic-bezier(.2,.8,.3,1) 0s infinite both`),
      }}>
        <div style={{ width: COLS.lot, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7, background: C.accentLight, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: C.accent,
          }}>
            {b.tag}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: C.textPrimary, lineHeight: '13px' }}>
              {b.lot}
            </div>
            <div style={{
              fontSize: 8.5, color: C.textMuted, lineHeight: '11px',
              fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
            }}>
              {b.detail}
            </div>
          </div>
        </div>

        <div style={{ width: COLS.tenant }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: C.textPrimary, lineHeight: '13px' }}>
            {b.tenant}
          </div>
          <div style={{
            fontSize: 8.5, color: C.textMuted, lineHeight: '11px',
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>
            {b.bail}
          </div>
        </div>

        <div style={{ width: COLS.rent, textAlign: 'right' }}>
          <div style={{
            fontSize: 11.5, fontWeight: 700, color: C.textPrimary, lineHeight: '13px',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {b.rent}
          </div>
          <div style={{ fontSize: 8.5, color: C.textMuted, lineHeight: '11px' }}>/ mois</div>
        </div>

        <div style={{ width: COLS.status, display: 'flex', justifyContent: 'flex-end' }}>
          <Pill
            text={b.status} color={b.color} bg={b.bg}
            style={anim(`gl-bail-badge-${i} 6s cubic-bezier(.2,.8,.3,1) 0s infinite both`)}
          />
        </div>
      </div>
    ))}
  </div>
);

/* ───────────────────────── Conformité ───────────────────────── */

const CONFORMITE: string[] = [
  'Factur-X · flux e-reporting validé',
  'Charges 2025 · régularisées',
  'Déclaration 2072 · prête à transmettre',
];

const ConformiteCard: React.FC<{ anim: AnimFn }> = ({ anim }) => (
  <div style={{ ...cardStyle(202, COL_R) }}>
    <CardTitle left="Conformité" right="Exercice 2026" />

    <div style={{
      marginTop: 10, height: 52, boxSizing: 'border-box',
      background: C.successLight, borderRadius: 10, padding: '0 12px',
      display: 'flex', alignItems: 'center', gap: 10,
      ...anim('gl-conf-band 6s cubic-bezier(.2,.8,.3,1) 0s infinite both'),
    }}>
      <CheckDot size={22} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.textPrimary, lineHeight: '15px' }}>
          Facturation électronique
        </div>
        <div style={{
          fontSize: 9.5, fontWeight: 600, color: C.success, lineHeight: '13px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          Conforme · échéance sept. 2026
        </div>
      </div>
    </div>

    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {CONFORMITE.map((t, i) => (
        <div key={t} style={{
          height: 22, display: 'flex', alignItems: 'center', gap: 8,
          ...anim(`gl-conf-${i} 6s cubic-bezier(.2,.8,.3,1) 0s infinite both`),
        }}>
          <CheckDot
            size={13}
            style={anim(`gl-conf-dot-${i} 6s cubic-bezier(.2,.8,.3,1) 0s infinite both`)}
          />
          <span style={{
            fontSize: 10, color: C.textSecondary, lineHeight: '13px',
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>
            {t}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ───────────────────────── Motion (mode `animated`) ─────────────────────────
 *
 * Cycle de 6 s, en pourcentages. Le décalage entre éléments est encodé DANS les
 * keyframes — aucun décalage de démarrage : toutes les animations partagent la même
 * durée (6s), le même delay (0s), `infinite` et `both`. À `t = 0` comme à RESET,
 * tous les éléments animés sont à leur état initial (invisibles), donc la boucle
 * repart proprement sans reliquat du cycle précédent.
 *
 *   02 → 19   les 4 cartes KPI, l'une après l'autre
 *   17 → 40   Encaissements : en-tête chiffré, puis les 6 barres en décalé
 *   40 → 45   étiquette de valeur au-dessus de la barre de juin (accent)
 *   42 → 59   Automatisations : le « 47 », puis les 3 lignes qui se cochent
 *   57 → 73   Baux & quittances : 4 lignes en cascade + badge de statut
 *   67 → 84   Conformité : bandeau vert, puis les 3 items qui se cochent
 *   84 → 86   maintien de l'écran complet
 *   86 → 93   réinitialisation simultanée
 *   93 → 100  état initial, prêt à reboucler
 */

const HOLD = 86;   // % — fin du maintien
const RESET = 93;  // % — tout est revenu à l'état initial

const KPI_START = 2, KPI_STEP = 3.5, KPI_DUR = 6;
const ENC_HEAD = 17, ENC_HEAD_DUR = 6;
const BAR_START = 20, BAR_STEP = 2.5, BAR_DUR = 7;
const BAR_LABEL = 40, BAR_LABEL_DUR = 5;
const AUTO_NUM = 42, AUTO_NUM_DUR = 6;
const AUTO_START = 47, AUTO_STEP = 3, AUTO_DUR = 6;
const BAIL_START = 57, BAIL_STEP = 2.5, BAIL_DUR = 6;
const BADGE_OFFSET = 4, BADGE_DUR = 4.5;
const CONF_BAND = 67, CONF_BAND_DUR = 6;
const CONF_START = 72, CONF_STEP = 2.5, CONF_DUR = 5;
const DOT_OFFSET = 1.5; // décalage de la pastille de coche après sa ligne

/** Fondu + montée de quelques px. */
const riseKf = (name: string, s: number, dur: number, dy = 8) => `
@keyframes ${name} {
  0%, ${s}%       { opacity: 0; transform: translateY(${dy}px); }
  ${s + dur}%     { opacity: 1; transform: translateY(0); }
  ${HOLD}%        { opacity: 1; transform: translateY(0); }
  ${RESET}%, 100% { opacity: 0; transform: translateY(${dy}px); }
}`;

/** Fondu + léger agrandissement (badges de statut). */
const popKf = (name: string, s: number, dur: number) => `
@keyframes ${name} {
  0%, ${s}%       { opacity: 0; transform: scale(.82); }
  ${s + dur}%     { opacity: 1; transform: scale(1); }
  ${HOLD}%        { opacity: 1; transform: scale(1); }
  ${RESET}%, 100% { opacity: 0; transform: scale(.82); }
}`;

/** Coche verte : apparition avec un léger rebond. */
const bounceKf = (name: string, s: number) => `
@keyframes ${name} {
  0%, ${s}%       { opacity: 0; transform: scale(.2); }
  ${s + 3}%       { opacity: 1; transform: scale(1.28); }
  ${s + 5.5}%     { opacity: 1; transform: scale(1); }
  ${HOLD}%        { opacity: 1; transform: scale(1); }
  ${RESET}%, 100% { opacity: 0; transform: scale(.2); }
}`;

/** Barre d'histogramme : pousse depuis la ligne de base. */
const growKf = (name: string, s: number, dur: number) => `
@keyframes ${name} {
  0%, ${s}%       { transform: scaleY(0); }
  ${s + dur}%     { transform: scaleY(1); }
  ${HOLD}%        { transform: scaleY(1); }
  ${RESET}%, 100% { transform: scaleY(0); }
}`;

const CSS = [
  ...KPIS.map((_, i) => riseKf(`gl-kpi-${i}`, KPI_START + i * KPI_STEP, KPI_DUR, 10)),

  riseKf('gl-enc-head', ENC_HEAD, ENC_HEAD_DUR, 6),
  ...BARS.map((_, i) => growKf(`gl-bar-${i}`, BAR_START + i * BAR_STEP, BAR_DUR)),
  riseKf('gl-bar-label', BAR_LABEL, BAR_LABEL_DUR, 5),

  riseKf('gl-auto-num', AUTO_NUM, AUTO_NUM_DUR, 8),
  ...AUTOS.map((_, i) => riseKf(`gl-auto-${i}`, AUTO_START + i * AUTO_STEP, AUTO_DUR)),
  ...AUTOS.map((_, i) => bounceKf(`gl-auto-dot-${i}`, AUTO_START + i * AUTO_STEP + DOT_OFFSET)),

  ...BAUX.map((_, i) => riseKf(`gl-bail-${i}`, BAIL_START + i * BAIL_STEP, BAIL_DUR)),
  ...BAUX.map((_, i) => popKf(`gl-bail-badge-${i}`, BAIL_START + i * BAIL_STEP + BADGE_OFFSET, BADGE_DUR)),

  riseKf('gl-conf-band', CONF_BAND, CONF_BAND_DUR),
  ...CONFORMITE.map((_, i) => riseKf(`gl-conf-${i}`, CONF_START + i * CONF_STEP, CONF_DUR, 6)),
  ...CONFORMITE.map((_, i) => bounceKf(`gl-conf-dot-${i}`, CONF_START + i * CONF_STEP + DOT_OFFSET)),
].join('');

/* ───────────────────────── Écran ───────────────────────── */

export const GestionLocative: React.FC<{ animated?: boolean }> = ({ animated = false }) => {
  const anim: AnimFn = (value, extra) => (animated ? { animation: value, ...extra } : {});

  return (
    <div style={{
      width: W, height: H, position: 'relative', overflow: 'hidden',
      borderRadius: 18, fontFamily: F.body, background: C.white, display: 'flex',
    }}>
      {animated && <style>{CSS}</style>}

      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />

        <div style={{
          flex: 1, boxSizing: 'border-box', background: C.bgApp, padding: PAD,
          display: 'flex', flexDirection: 'column', gap: GUTTER,
        }}>
          {/* Bandeau de KPI */}
          <div style={{ display: 'flex', gap: 14, width: CONTENT_W }}>
            {KPIS.map((k, i) => <KpiCard key={k.label} k={k} i={i} anim={anim} />)}
          </div>

          {/* Encaissements + automatisations */}
          <div style={{ display: 'flex', gap: GUTTER, width: CONTENT_W }}>
            <EncaissementsCard anim={anim} />
            <AutomationsCard anim={anim} />
          </div>

          {/* Baux + conformité */}
          <div style={{ display: 'flex', gap: GUTTER, width: CONTENT_W }}>
            <BauxCard anim={anim} />
            <ConformiteCard anim={anim} />
          </div>
        </div>
      </div>
    </div>
  );
};
