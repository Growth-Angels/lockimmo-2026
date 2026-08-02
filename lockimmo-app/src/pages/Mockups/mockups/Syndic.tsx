import React from 'react';
import { C, F } from '../../../tokens';
import { LockimmoLogo } from '../../../brand';

/**
 * Mockup statique — Logiciel de syndic de copropriété
 * Format 960×640. Aucune animation, aucune image externe.
 *
 * Récit : l'assemblée générale de la résidence « Les Tilleuls » s'est tenue
 * sans accroc — quorum atteint, résolutions votées, PV généré et diffusé,
 * documents archivés, rappels légaux respectés.
 */

const W = 960;
const H = 640;

const SIDEBAR_W = 188;
const MAIN_W = W - SIDEBAR_W;          // 772
const PAD = 22;
const INNER_W = MAIN_W - PAD * 2;      // 728

const COL_L = 452;
const COL_R = 264;
const GAP = 12;

const SHADOW = '0 2px 8px rgba(53,50,48,0.05)';

/* ── Jauge de quorum ── */
const GA_SIZE = 96;
const GA_R = 36;
const GA_C = 2 * Math.PI * GA_R;       // 226,19
const QUORUM = 0.7812;

/* ── Votes : tantièmes exprimés ── */
const TANTIEMES = 7812;

type Res = {
  n: string;
  titre: string;
  sub: string;
  pour: number;
  contre: number;
  abst: number;
  adoptee: boolean;
};

const RESOLUTIONS: Res[] = [
  { n: '1', titre: 'Approbation des comptes 2025', sub: 'Article 24 · exercice 2025',    pour: 7240, contre: 412,  abst: 160, adoptee: true },
  { n: '2', titre: 'Quitus au syndic',             sub: 'Article 24 · gestion 2025',     pour: 6980, contre: 620,  abst: 212, adoptee: true },
  { n: '3', titre: 'Budget prévisionnel 2027',     sub: 'Article 24 · 214 500 €',        pour: 6604, contre: 908,  abst: 300, adoptee: true },
  { n: '4', titre: 'Ravalement de façade',         sub: 'Article 25 · devis 186 000 €',  pour: 5890, contre: 1522, abst: 400, adoptee: true },
  { n: '5', titre: 'Bornes de recharge parking',   sub: 'Article 25 · 12 emplacements',  pour: 3120, contre: 4210, abst: 482, adoptee: false },
];

/* ── Icônes de navigation (traits, 24×24) ── */
const ICONS: Record<string, string> = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  building: 'M3 21h18M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16M9 7h2M9 11h2M9 15h2M15 21V10h4v11',
  ag: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5',
  euro: 'M18 6.5a7 7 0 100 11M4 10h9M4 14h9',
  wrench: 'M14.6 6.4a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9z',
  calc: 'M5 2h14v20H5zM8 6h8M8 10h1M12 10h1M16 10h1M8 14h1M12 14h1M16 14h1M8 18h5M16 18h1',
};

const NAV: [string, string][] = [
  ['grid', 'Tableau de bord'],
  ['building', 'Copropriétés'],
  ['ag', 'Assemblées générales'],
  ['file', 'Documents'],
  ['euro', 'Appels de fonds'],
  ['wrench', 'Travaux & sinistres'],
  ['calc', 'Comptabilité copro'],
];

const Icon: React.FC<{ d: string; size?: number; color: string; sw?: number }> = ({ d, size = 15, color, sw = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

const Check: React.FC<{ size?: number; color: string; sw?: number }> = ({ size = 12, color, sw = 2.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const NUM: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' };

const LABEL: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '1.1px',
  textTransform: 'uppercase',
  color: C.textMuted,
};

/* ── Participants (pastilles à initiales) ── */
const AVATARS: [string, string, string][] = [
  ['ML', C.accentSoft, '#9A4A21'],
  ['BF', C.infoLight, C.info],
  ['CD', C.purpleLight, C.purple],
  ['AR', C.successLight, C.success],
  ['JP', C.errorLight, C.error],
  ['TN', C.bgApp, C.textSecondary],
];

/* ── Mini-stats de participation ── */
const PARTS: [string, string][] = [
  ['21', 'Présents'],
  ['13', 'Pouvoirs'],
  ['9', 'En visio'],
];

/* ── Documents centralisés ── */
const DOCS: [string, string, string, string, string][] = [
  ['PDF', 'Convocation à l’AG',        'Envoyée le 22 mai · J-21',      C.errorLight, C.error],
  ['PDF', 'Procès-verbal d’assemblée', 'Signé le 12 juin · 6 pages',    C.errorLight, C.error],
  ['XLS', 'Budget prévisionnel 2027',       'Voté · 214 500 € · 68 lots',    C.successLight, C.success],
  ['PDF', 'Contrat entretien ascenseur',    'Échéance 31/12/2026',           C.infoLight, C.info],
];

/* ── Rappels automatiques ── */
const RAPPELS: [string, string, string, string, boolean][] = [
  ['Convocations envoyées (J-21)', '43 destinataires · 22 mai 2026', C.successLight, C.success, true],
  ['Relance appel de fonds T3',    'Programmée le 5 juillet 2026',   C.accentLight,  C.accent,  false],
  ['Appel fonds travaux ALUR',     'Échéance le 1er septembre 2026', C.infoLight,    C.info,    false],
];

const Card: React.FC<{ w: number; h: number; pad: number; children: React.ReactNode; bg?: string; border?: string }> = ({
  w, h, pad, children, bg, border,
}) => (
  <div style={{
    width: w, height: h, boxSizing: 'border-box', padding: pad,
    background: bg ?? C.white, borderRadius: 14,
    border: `1px solid ${border ?? C.border}`, boxShadow: SHADOW,
  }}>
    {children}
  </div>
);

const CardHead: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <>
    <div style={{ height: 18, fontFamily: F.display, fontSize: 13.5, fontWeight: 700, color: C.textPrimary, lineHeight: '18px' }}>
      {title}
    </div>
    <div style={{ height: 11, marginTop: 3, fontSize: 9.5, color: C.textMuted, lineHeight: '11px', ...NUM }}>
      {sub}
    </div>
  </>
);

export const Syndic: React.FC = () => (
  <div style={{
    width: W, height: H, position: 'relative', overflow: 'hidden',
    borderRadius: 18, fontFamily: F.body, background: C.bgApp,
  }}>

    {/* ═══════════ BARRE LATÉRALE ═══════════ */}
    <div style={{
      position: 'absolute', left: 0, top: 0, width: SIDEBAR_W, height: H,
      background: C.white, borderRight: `1px solid ${C.border}`,
      padding: '20px 16px', boxSizing: 'border-box',
    }}>
      <div style={{ height: 26, display: 'flex', alignItems: 'center' }}>
        <LockimmoLogo markSize={24} wordHeight={11} />
      </div>

      <div style={{ ...LABEL, marginTop: 24, height: 11, lineHeight: '11px' }}>Gestion</div>

      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map(([key, label]) => {
          const active = key === 'ag';
          return (
            <div key={key} style={{
              height: 32, borderRadius: 9, padding: '0 10px', boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', gap: 9,
              background: active ? C.accentLight : 'transparent',
            }}>
              <Icon d={ICONS[key]} color={active ? C.accent : C.textMuted} />
              <span style={{
                fontSize: 11.5, fontWeight: active ? 700 : 500,
                color: active ? C.accent : C.textSecondary,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ ...LABEL, marginTop: 20, height: 11, lineHeight: '11px' }}>Mes copropriétés</div>

      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {([
          ['Les Tilleuls', '68', C.accent, true],
          ['Le Clos Saint-Jean', '42', C.info, false],
          ['Villa Bergson', '24', C.purple, false],
        ] as [string, string, string, boolean][]).map(([nom, lots, dot, on]) => (
          <div key={nom} style={{
            height: 30, borderRadius: 8, padding: '0 10px', boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', gap: 8,
            background: on ? C.bgWarm : 'transparent',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
            <span style={{
              flex: 1, fontSize: 11, fontWeight: on ? 700 : 500,
              color: on ? C.textPrimary : C.textSecondary,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {nom}
            </span>
            <span style={{ fontSize: 9, color: C.textMuted, ...NUM }}>{lots}</span>
          </div>
        ))}
      </div>

      {/* Prochaine échéance */}
      <div style={{
        marginTop: 20, width: 156, height: 66, boxSizing: 'border-box',
        background: C.bgWarm, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10,
      }}>
        <div style={{ ...LABEL, fontSize: 8, height: 10, lineHeight: '10px' }}>Prochaine AG</div>
        <div style={{ marginTop: 5, fontSize: 11, fontWeight: 700, color: C.textPrimary, lineHeight: '14px' }}>
          Le Clos Saint-Jean
        </div>
        <div style={{ marginTop: 2, fontSize: 9, color: C.textMuted, lineHeight: '12px', ...NUM }}>
          4 sept. 2026 · 18 h 30
        </div>
      </div>

      {/* Gestionnaire */}
      <div style={{
        position: 'absolute', left: 16, bottom: 18, width: 156, height: 46,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: C.accent, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10.5, fontWeight: 700, color: C.white, letterSpacing: '0.3px',
        }}>
          SR
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, lineHeight: '14px' }}>Sophie Renard</div>
          <div style={{ fontSize: 9, color: C.textMuted, lineHeight: '12px' }}>Gestionnaire copropriété</div>
        </div>
      </div>
    </div>

    {/* ═══════════ ZONE PRINCIPALE ═══════════ */}
    <div style={{
      position: 'absolute', left: SIDEBAR_W, top: 0, width: MAIN_W, height: H,
      background: C.bgApp, padding: `20px ${PAD}px`, boxSizing: 'border-box',
    }}>

      {/* ── En-tête d'écran ── */}
      <div style={{
        height: 48, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ ...LABEL, height: 11, lineHeight: '11px' }}>
            Les Tilleuls · 12 rue des Tilleuls, 69006 Lyon · 68 lots
          </div>
          <div style={{
            marginTop: 3, fontFamily: F.display, fontSize: 20, fontWeight: 700,
            color: C.textPrimary, lineHeight: '24px',
          }}>
            Assemblée générale ordinaire
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            height: 30, display: 'flex', alignItems: 'center', gap: 7,
            background: C.successLight, border: `1px solid ${C.border}`,
            borderRadius: 100, padding: '0 12px',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: C.success, ...NUM }}>
              Séance clôturée à 20 h 14
            </span>
          </div>

          <div style={{
            height: 34, display: 'flex', alignItems: 'center', gap: 7,
            background: C.accent, borderRadius: 10, padding: '0 13px',
            boxShadow: '0 2px 8px rgba(255,135,83,0.28)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.white}
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: C.white }}>Exporter le PV</span>
          </div>
        </div>
      </div>

      {/* ── Corps : deux colonnes ── */}
      <div style={{ display: 'flex', gap: GAP, width: INNER_W, height: 538 }}>

        {/* ══ COLONNE GAUCHE ══ */}
        <div style={{ width: COL_L, display: 'flex', flexDirection: 'column', gap: GAP }}>

          {/* ── Point focal : quorum ── */}
          <Card w={COL_L} h={156} pad={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 124 }}>

              {/* Jauge */}
              <div style={{ position: 'relative', width: GA_SIZE, height: GA_SIZE, flexShrink: 0 }}>
                <svg width={GA_SIZE} height={GA_SIZE} style={{ display: 'block' }}>
                  <circle cx={GA_SIZE / 2} cy={GA_SIZE / 2} r={GA_R} fill="none" stroke={C.bgApp} strokeWidth="9" />
                  <circle
                    cx={GA_SIZE / 2} cy={GA_SIZE / 2} r={GA_R} fill="none"
                    stroke={C.accent} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={`${(GA_C * QUORUM).toFixed(1)} ${(GA_C * (1 - QUORUM)).toFixed(1)}`}
                    transform={`rotate(-90 ${GA_SIZE / 2} ${GA_SIZE / 2})`}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    fontFamily: F.display, fontSize: 24, fontWeight: 700,
                    color: C.textPrimary, lineHeight: '26px', ...NUM,
                  }}>
                    78%
                  </div>
                  <div style={{ ...LABEL, fontSize: 7.5, letterSpacing: '0.9px', marginTop: 1 }}>Tantièmes</div>
                </div>
              </div>

              {/* Détail */}
              <div style={{ width: 306 }}>
                <div style={{ height: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.textPrimary }}>
                    Quorum atteint
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: C.successLight, borderRadius: 100, padding: '3px 8px',
                  }}>
                    <Check size={9} color={C.success} sw={3} />
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: C.success, letterSpacing: '0.3px' }}>
                      Art. 25 validé
                    </span>
                  </span>
                </div>

                <div style={{ height: 15, fontSize: 11.5, color: C.textSecondary, lineHeight: '15px', ...NUM }}>
                  7 812 / 10 000 tantièmes représentés · 34 votants
                </div>

                {/* Mini-stats */}
                <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  {PARTS.map(([v, l]) => (
                    <div key={l} style={{
                      width: 98, height: 42, boxSizing: 'border-box',
                      background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 9,
                      padding: '6px 9px',
                    }}>
                      <div style={{
                        fontFamily: F.display, fontSize: 16, fontWeight: 700,
                        color: C.textPrimary, lineHeight: '18px', ...NUM,
                      }}>
                        {v}
                      </div>
                      <div style={{ ...LABEL, fontSize: 8, letterSpacing: '0.8px', lineHeight: '10px' }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* Copropriétaires */}
                <div style={{ marginTop: 8, height: 22, display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {AVATARS.map(([ini, bg, fg], i) => (
                      <div key={ini} style={{
                        width: 22, height: 22, borderRadius: '50%', boxSizing: 'border-box',
                        background: bg, border: `2px solid ${C.white}`,
                        marginLeft: i === 0 ? 0 : -6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, fontWeight: 700, color: fg, letterSpacing: '0.2px',
                      }}>
                        {ini}
                      </div>
                    ))}
                    <div style={{
                      height: 22, borderRadius: 100, boxSizing: 'border-box',
                      background: C.bgApp, border: `2px solid ${C.white}`, marginLeft: -6,
                      padding: '0 7px', display: 'flex', alignItems: 'center',
                      fontSize: 8.5, fontWeight: 700, color: C.textSecondary, ...NUM,
                    }}>
                      +37
                    </div>
                  </div>
                  <span style={{ marginLeft: 10, fontSize: 10, color: C.textMuted, ...NUM }}>
                    43 copropriétaires convoqués
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* ── Résolutions ── */}
          <Card w={COL_L} h={370} pad={16}>
            <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: F.display, fontSize: 14.5, fontWeight: 700, color: C.textPrimary }}>
                  Résolutions soumises au vote
                </span>
                <span style={{ fontSize: 10, color: C.textMuted, ...NUM }}>5 résolutions · 4 adoptées</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {([['Pour', C.success], ['Contre', C.error], ['Abst.', C.borderStrong]] as [string, string][]).map(([l, col]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: col, display: 'block' }} />
                    <span style={{ fontSize: 8.5, fontWeight: 600, color: C.textMuted }}>{l}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* En-tête de colonnes */}
            <div style={{ marginTop: 14, height: 12, padding: '0 11px', display: 'flex', alignItems: 'center' }}>
              <div style={{ ...LABEL, width: 202, fontSize: 8.5, lineHeight: '12px' }}>Résolution</div>
              <div style={{ ...LABEL, width: 122, fontSize: 8.5, lineHeight: '12px', paddingLeft: 12, boxSizing: 'border-box' }}>
                Répartition des voix
              </div>
              <div style={{ ...LABEL, width: 74, fontSize: 8.5, lineHeight: '12px', textAlign: 'right' }}>Résultat</div>
            </div>

            {/* Lignes */}
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RESOLUTIONS.map((r) => {
                const pct = Math.round((r.pour / TANTIEMES) * 100);
                return (
                  <div key={r.n} style={{
                    height: 46, boxSizing: 'border-box', padding: '0 10px',
                    background: C.white, border: `1px solid ${r.adoptee ? C.border : C.borderStrong}`,
                    borderRadius: 10, display: 'flex', alignItems: 'center',
                  }}>
                    {/* Intitulé */}
                    <div style={{ width: 202, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                        background: r.adoptee ? C.accentLight : C.errorLight,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10.5, fontWeight: 700, color: r.adoptee ? C.accent : C.error, ...NUM,
                      }}>
                        {r.n}
                      </div>
                      <div style={{ width: 170, minWidth: 0 }}>
                        <div style={{
                          fontSize: 12, fontWeight: 700, color: C.textPrimary, lineHeight: '15px',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {r.titre}
                        </div>
                        <div style={{
                          fontSize: 9.5, color: C.textMuted, lineHeight: '12px', ...NUM,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {r.sub}
                        </div>
                      </div>
                    </div>

                    {/* Barres de vote */}
                    <div style={{ width: 122, paddingLeft: 12, boxSizing: 'border-box' }}>
                      <div style={{
                        width: 110, height: 7, borderRadius: 4, overflow: 'hidden',
                        display: 'flex', background: C.bgApp,
                      }}>
                        <div style={{ width: `${(r.pour / TANTIEMES) * 100}%`, background: C.success }} />
                        <div style={{ width: `${(r.contre / TANTIEMES) * 100}%`, background: C.error }} />
                        <div style={{ width: `${(r.abst / TANTIEMES) * 100}%`, background: C.borderStrong }} />
                      </div>
                      <div style={{
                        marginTop: 4, fontSize: 8.5, fontWeight: 700,
                        color: r.adoptee ? C.success : C.error, ...NUM,
                      }}>
                        {pct} % des tantièmes
                      </div>
                    </div>

                    {/* Résultat */}
                    <div style={{ width: 74, display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: r.adoptee ? C.successLight : C.errorLight,
                        borderRadius: 7, padding: '4px 7px',
                        fontSize: 9, fontWeight: 700, color: r.adoptee ? C.success : C.error,
                      }}>
                        {r.adoptee && <Check size={8} color={C.success} sw={3.4} />}
                        {r.adoptee ? 'Adoptée' : 'Rejetée'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 6, height: 14, fontSize: 9.5, color: C.textMuted, lineHeight: '14px', ...NUM }}>
              Feuille de présence et PV signés par le président de séance et 2 scrutateurs · 0 contestation
            </div>
          </Card>
        </div>

        {/* ══ COLONNE DROITE ══ */}
        <div style={{ width: COL_R, display: 'flex', flexDirection: 'column', gap: GAP }}>

          {/* ── Documents centralisés ── */}
          <Card w={COL_R} h={232} pad={14}>
            <CardHead title="Documents centralisés" sub="Coffre-fort numérique · 128 pièces" />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DOCS.map(([ext, nom, meta, bg, fg]) => (
                <div key={nom} style={{ height: 34, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{
                    width: 24, height: 28, borderRadius: 5, background: bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 7, fontWeight: 700, color: fg, letterSpacing: '0.4px',
                  }}>
                    {ext}
                  </div>
                  <div style={{ width: 181, minWidth: 0 }}>
                    <div style={{
                      fontSize: 10.5, fontWeight: 700, color: C.textPrimary, lineHeight: '13px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {nom}
                    </div>
                    <div style={{
                      fontSize: 8.5, color: C.textMuted, lineHeight: '11px', ...NUM,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {meta}
                    </div>
                  </div>
                  <Check size={13} color={C.success} />
                </div>
              ))}
            </div>
          </Card>

          {/* ── Rappels automatiques ── */}
          <Card w={COL_R} h={178} pad={14}>
            <CardHead title="Rappels automatiques" sub="Délais légaux respectés" />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RAPPELS.map(([label, meta, bg, fg, done]) => (
                <div key={label} style={{ height: 30, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 6, background: bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done
                      ? <Check size={10} color={fg} sw={3} />
                      : <div style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />}
                  </div>
                  <div style={{ width: 209, minWidth: 0 }}>
                    <div style={{
                      fontSize: 10.5, fontWeight: 700, color: C.textPrimary, lineHeight: '13px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontSize: 9, color: C.textMuted, lineHeight: '12px', ...NUM,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {meta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ── PV généré automatiquement ── */}
          <Card w={COL_R} h={104} pad={14} bg={C.accentLight} border={C.accentSoft}>
            <div style={{ height: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: C.accent, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={10} color={C.white} sw={3.2} />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.textPrimary }}>
                PV généré automatiquement
              </span>
            </div>

            <div style={{ marginTop: 10, display: 'flex', gap: 12 }}>
              {([['43', 'Copropriétaires notifiés', C.textPrimary], ['0', 'Contestation', C.success]] as [string, string, string][]).map(([v, l, col]) => (
                <div key={l} style={{ width: 112 }}>
                  <div style={{
                    fontFamily: F.display, fontSize: 22, fontWeight: 700,
                    color: col, lineHeight: '26px', ...NUM,
                  }}>
                    {v}
                  </div>
                  <div style={{ ...LABEL, fontSize: 8.5, letterSpacing: '0.7px', lineHeight: '11px' }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
);
