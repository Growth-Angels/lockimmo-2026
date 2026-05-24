/**
 * GestionPage — 1920 × 1080 · 30 fps · 8s (240f)
 * Redesign de la page Gestion LOCKimmo.
 * Même structure et infos que le logiciel actuel, esthétique design system 2026.
 *
 * Sections :
 *  1. Calendrier de travail  (6 actions)
 *  2. Comptabilité (4) + Mouvements locataires (3)
 *  3. Actions annuelles (3) + Comptes bancaires (2)
 *
 * Timeline :
 *  f  0–12   Shell BG + sidebar
 *  f  9–24   Topbar slide-down
 *  f 18–36   Nav items stagger
 *  f 36–50   Breadcrumb + titre
 *  f 50–65   Section 1 header
 *  f 60–80   6 cards stagger (3f chacune)
 *  f100–115  Section 2 header (Comptabilité)
 *  f110–135  Compta cards stagger
 *  f115–135  Mouvements header + cards
 *  f160–175  Section 3 header (Actions)
 *  f165–190  Actions cards + Comptes bancaires
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { A, C, F, R } from "../tokens";
import { FadeIn } from "../components/FadeIn";
import { SlideUp } from "../components/SlideUp";
import { ScaleIn } from "../components/ScaleIn";
import { SlideIn } from "../components/SlideIn";

// ─── Palette locale (complète le tokens.ts) ────────────────────
const P = {
  sidebar:    "#FFFFFF",
  sidebarBg:  "#FAFAF9",
  topbar:     "#353230",
  bg:         "#F3F0ED",
  card:       "#FFFFFF",
  border:     "rgba(53,50,48,0.08)",
  // Couleurs d'icônes par catégorie
  brand50:    "#FFF0E8", brand500:  "#FF8753",
  info50:     "#EEF4FF", info500:   "#3B7DF8",
  success50:  "#EDFBF4", success500:"#28A566",
  purple50:   "#F4EEFF", purple500: "#8B5CF6",
  error500:   "#E05252",
};

// ─── Icônes SVG ────────────────────────────────────────────────
const Ico: React.FC<{
  d: string | React.ReactNode;
  color?: string;
  s?: number;
}> = ({ d, color = P.brand500, s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none" style={{ color }}>
    {typeof d === "string" ? (
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ) : d}
  </svg>
);

// Icônes spécifiques
const IcoLoyers     = () => <Ico d="M4 3h14a1 1 0 011 1v15l-3-1.5L13 19l-2-1.5L9 19l-3 1.5V4a1 1 0 011-1zm3 5h8m-8 3h6m-6 3h4" />;
const IcoEncaiss    = () => <Ico d="M11 4v14m-5-5l5 5 5-5" />;
const IcoDepenses   = () => <Ico d="M11 18V4m-5 5l5-5 5 5" />;
const IcoRelances   = () => <Ico d="M11 3a8 8 0 11.01 16H11a8 8 0 010-16zm0 4v4l3 2M4.2 17.8l1.4-1.4" />;
const IcoPaiements  = () => <Ico d="M17 9H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2zm-5 4v2m-8-6V7a4 4 0 018 0v2" />;
const IcoTransferts = () => <Ico d="M4 9h14M4 14h14m-4-9l4 4-4 4M8 4l-4 5 4 4" />;
const IcoSynchro    = () => <Ico d="M3 12a9 9 0 1018 0A9 9 0 003 12zm5-3l4-3 4 3m-4-3v9" color={P.info500} />;
const IcoChecking   = () => <Ico d="M9 12l2 2 4-4m-7 8a9 9 0 110-18 9 9 0 010 18z" color={P.info500} />;
const IcoCompta     = () => <Ico d="M19 3H3a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2zM7 8h8M7 12h5" color={P.info500} />;
const IcoAudit      = () => <Ico d="M11 3a8 8 0 11.01 16H11A8 8 0 0111 3zm0 4v5l3 1.5" color={P.info500} />;
const IcoArrivee    = () => <Ico d="M16 11a4 4 0 11-8 0 4 4 0 018 0zm-8 4H5a2 2 0 00-2 2v1m18-1v-1a2 2 0 00-2-2h-3m-1-4l2-2 2 2" color={P.success500} />;
const IcoDernierL   = () => <Ico d="M4 4h16v16H4V4zm4 4h8m-8 4h5m3-4l2 2-2 2" color={P.success500} />;
const IcoSolde      = () => <Ico d="M3 6h18M3 12h18M3 18h12M15 14l3 3 3-3m-3 3V11" color={P.success500} />;
const IcoReg        = () => <Ico d="M4 6h2m0 0a4 4 0 008 0m-8 0H3m15 0h-2m2 0h1M4 12h2m0 0a4 4 0 008 0m-8 0H3m15 0h-2m2 0h1" color={P.purple500} />;
const IcoFiscal     = () => <Ico d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7l-6-4zm0 0v4h4m-8 5h5m-5 4h3" color={P.purple500} />;
const IcoTsfDepense = () => <Ico d="M4 16l4-4m0 0l4 4m-4-4v8M20 8l-4 4m0 0l-4-4m4 4V4" color={P.purple500} />;

// ─── Données ────────────────────────────────────────────────────
const CALENDRIER = [
  { icon: <IcoLoyers />,    label: "Loyers et\nfacturations",                  bg: P.brand50,   color: P.brand500 },
  { icon: <IcoEncaiss />,   label: "Encaissements",                            bg: P.brand50,   color: P.brand500 },
  { icon: <IcoDepenses />,  label: "Dépenses",                                 bg: P.brand50,   color: P.brand500 },
  { icon: <IcoRelances />,  label: "Suivi et\nrelances",                       bg: P.brand50,   color: P.brand500 },
  { icon: <IcoPaiements />, label: "Paiements\npropriétaires, CRG",            bg: P.brand50,   color: P.brand500 },
  { icon: <IcoTransferts />,label: "Transferts\nd'honoraires",                 bg: P.brand50,   color: P.brand500 },
];

const COMPTA = [
  { icon: <IcoSynchro />,  label: "Synchro\nbancaire",  bg: P.info50,  color: P.info500 },
  { icon: <IcoChecking />, label: "Checking",            bg: P.info50,  color: P.info500 },
  { icon: <IcoCompta />,   label: "Comptabilité",        bg: P.info50,  color: P.info500 },
  { icon: <IcoAudit />,    label: "Audit",               bg: P.info50,  color: P.info500 },
];

const MOUVEMENTS = [
  { icon: <IcoArrivee />,  label: "Arrivée de\nlocataire",   bg: P.success50, color: P.success500 },
  { icon: <IcoDernierL />, label: "Dernier\nloyer",          bg: P.success50, color: P.success500 },
  { icon: <IcoSolde />,    label: "Solde de\ntout compte",   bg: P.success50, color: P.success500 },
];

const ACTIONS = [
  { icon: <IcoReg />,        label: "Régularisations\nde charges",   bg: P.purple50, color: P.purple500 },
  { icon: <IcoFiscal />,     label: "Déclarations\nfiscales",        bg: P.purple50, color: P.purple500 },
  { icon: <IcoTsfDepense />, label: "Transfert\nde dépenses",        bg: P.purple50, color: P.purple500 },
];

const BANQUES = [
  { name: "BNP Paribas",      num: "512-000001", amount: "−46 153,54 €", neg: true  },
  { name: "Caisse d'épargne", num: "512-000002", amount: "−166,58 €",    neg: true  },
];

const NAV = [
  { label: "Tableau de bord",   active: false },
  { label: "Vos données",       active: false },
  { label: "Gestion",           active: true  },
  { label: "Mise en location",  active: false },
  { label: "Loc courte durée",  active: false },
  { label: "Éditions",          active: false },
  { label: "Communication",     active: false },
  { label: "Assistance",        active: false },
  { label: "Déconnexion",       active: false },
];

// ─── Helpers ────────────────────────────────────────────────────
const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/** Section header avec label + ligne de séparation */
const SectionHead: React.FC<{
  title: string;
  delay: number;
  frame: number;
}> = ({ title, delay, frame }) => {
  const p = ease(frame, delay, delay + 12);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 12}px)`, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontFamily: F.display,
            fontSize: 17,
            fontWeight: 600,
            color: C.textPrimary,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: P.border }} />
      </div>
    </div>
  );
};

/** Carte d'action */
const ActionCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  bg: string;
  color: string;
  delay: number;
  frame: number;
  width?: number;
}> = ({ icon, label, bg, color, delay, frame, width = 160 }) => {
  const p = ease(frame, delay, delay + A.enter);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px) scale(${0.96 + p * 0.04})`,
        width,
        flexShrink: 0,
        background: P.card,
        border: `1px solid ${P.border}`,
        borderRadius: R.card,
        padding: "18px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 1px 3px rgba(53,50,48,0.05)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: C.textPrimary,
          textAlign: "center",
          lineHeight: 1.4,
          whiteSpace: "pre-wrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ─── Composant principal ─────────────────────────────────────────
export const GestionPage: React.FC = () => {
  const frame = useCurrentFrame();

  // BG fade
  const bgP = ease(frame, 0, 12);

  return (
    <AbsoluteFill
      style={{
        background: P.bg,
        fontFamily: F.body,
        opacity: bgP,
        overflow: "hidden",
      }}
    >
      {/* ══════════ TOPBAR ══════════ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: P.topbar,
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          gap: 24,
          transform: `translateY(${interpolate(frame, [9, 24], [-60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}px)`,
          zIndex: 10,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="4" y="9" width="10" height="7" rx="2" fill="white" />
              <path d="M6 9V7a3 3 0 016 0v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: F.display, fontSize: 18, fontWeight: 600, color: "#fff", letterSpacing: "-0.4px" }}>LOCKimmo</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: C.accent, background: "rgba(255,135,83,0.15)", border: "1px solid rgba(255,135,83,0.3)", padding: "2px 7px", borderRadius: 100, letterSpacing: "0.08em", marginLeft: 2 }}>PRO</span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 440, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "rgba(255,255,255,0.35)" }}>
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Recherche…</span>
        </div>

        {/* Sub-label */}
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: -8 }}>WAIO_gestion</span>

        {/* Action icons */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          {["🏠", "✏️", "📋", "🔔", "⚙️"].map((icon, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
              {icon}
            </div>
          ))}
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Agence Welcome</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Léona</span>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", marginLeft: 4 }}>L</div>
        </div>
      </div>

      {/* ══════════ SIDEBAR ══════════ */}
      <SlideIn from="left" delay={9} duration={18} style={{
        position: "absolute",
        top: 60,
        left: 0,
        bottom: 0,
        width: 220,
        background: P.sidebar,
        borderRight: `1px solid ${P.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        zIndex: 5,
      }}>
        {NAV.map((item, i) => {
          const navP = ease(frame, 18 + i * 2.5, 30 + i * 2.5);
          return (
            <div
              key={item.label}
              style={{
                opacity: navP,
                transform: `translateX(${(1 - navP) * -12}px)`,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: item.active ? 600 : 400,
                color: item.active ? C.accent : C.textSecondary,
                background: item.active ? "rgba(255,135,83,0.08)" : "transparent",
                borderLeft: item.active ? `3px solid ${C.accent}` : "3px solid transparent",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {item.label}
            </div>
          );
        })}
      </SlideIn>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 220,
          right: 0,
          bottom: 0,
          padding: "28px 36px 28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          overflowY: "hidden",
        }}
      >
        {/* ── Breadcrumb + titre ── */}
        <FadeIn delay={36} duration={14} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(53,50,48,0.4)" }}>
            <span style={{ cursor: "pointer", color: C.accent }}>Accueil</span>
            <span>›</span>
            <span style={{ fontWeight: 600, color: C.textPrimary }}>Gestion</span>
          </div>
          <div style={{ fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.8px" }}>
            Gestion
          </div>
        </FadeIn>

        {/* ══ Section 1 : Calendrier de travail ══ */}
        <SectionHead title="Calendrier de travail" delay={50} frame={frame} />
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {CALENDRIER.map((card, i) => (
            <ActionCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              bg={card.bg}
              color={card.color}
              delay={60 + i * 3}
              frame={frame}
              width={Math.floor((1920 - 220 - 68) / 6) - 10}
            />
          ))}
        </div>

        {/* ══ Sections 2a + 2b côte à côte ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 22 }}>
          {/* Comptabilité */}
          <div>
            <SectionHead title="Comptabilité" delay={100} frame={frame} />
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              {COMPTA.map((card, i) => (
                <ActionCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  bg={card.bg}
                  color={card.color}
                  delay={110 + i * 3}
                  frame={frame}
                  width={148}
                />
              ))}
              {/* Encart synchro bancaire */}
              <FadeIn delay={118} duration={14}>
                <div style={{
                  flex: 1,
                  minWidth: 240,
                  background: P.card,
                  border: `1px solid ${P.border}`,
                  borderRadius: R.card,
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: "0 1px 3px rgba(53,50,48,0.05)",
                  alignSelf: "stretch",
                  justifyContent: "center",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(53,50,48,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Dernière synchro bancaire</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: P.info50, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 20, fontWeight: 700, color: P.info500 }}>31</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div style={{ fontSize: 11, color: C.textSecondary }}>Actions demandées par la banque</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: P.success500 }}>✓ Aucune action nécessaire</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Mouvements locataires */}
          <div style={{ minWidth: 380 }}>
            <SectionHead title="Mouvements locataires" delay={115} frame={frame} />
            <div style={{ display: "flex", gap: 10 }}>
              {MOUVEMENTS.map((card, i) => (
                <ActionCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  bg={card.bg}
                  color={card.color}
                  delay={120 + i * 3}
                  frame={frame}
                  width={116}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ══ Sections 3a + 3b côte à côte ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16 }}>
          {/* Actions annuelles */}
          <div>
            <SectionHead title="Actions annuelles" delay={160} frame={frame} />
            <div style={{ display: "flex", gap: 10 }}>
              {ACTIONS.map((card, i) => (
                <ActionCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  bg={card.bg}
                  color={card.color}
                  delay={165 + i * 3}
                  frame={frame}
                  width={148}
                />
              ))}
            </div>
          </div>

          {/* Comptes bancaires */}
          <div>
            <SectionHead title="Comptes bancaires" delay={160} frame={frame} />
            <div style={{ display: "flex", gap: 10 }}>
              {BANQUES.map((compte, i) => {
                const p = ease(frame, 165 + i * 6, 177 + i * 6);
                return (
                  <div
                    key={compte.name}
                    style={{
                      opacity: p,
                      transform: `translateY(${(1 - p) * 12}px)`,
                      background: P.card,
                      border: `1px solid ${P.border}`,
                      borderRadius: R.card,
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      boxShadow: "0 1px 3px rgba(53,50,48,0.05)",
                      flex: 1,
                    }}
                  >
                    {/* Bank icon */}
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: P.info500 }}>
                        <path d="M3 9l7-5 7 5M4 9v6h12V9M1 9h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="7" y="12" width="2" height="3" rx="0.5" fill="currentColor" />
                        <rect x="11" y="12" width="2" height="3" rx="0.5" fill="currentColor" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{compte.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(53,50,48,0.4)", marginTop: 2 }}>{compte.num}</div>
                    </div>
                    <div style={{
                      fontFamily: F.display,
                      fontSize: 15,
                      fontWeight: 600,
                      color: P.error500,
                      background: "rgba(224,82,82,0.08)",
                      border: "1px solid rgba(224,82,82,0.15)",
                      padding: "5px 12px",
                      borderRadius: R.pill,
                      letterSpacing: "-0.3px",
                    }}>
                      {compte.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
