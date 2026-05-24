/**
 * LandscapeHero — 1920 × 1080 · 30 fps · 6s (180f)
 * Format : YouTube / site / LinkedIn paysage
 *
 * Layout split : texte gauche | visuel dashboard droit
 *
 * Timeline :
 *  f  0– 9   BG fade-in
 *  f  9–24   Logo + eyebrow slide-in depuis gauche
 *  f 20–42   H1 ligne 1 slide-up
 *  f 28–50   H1 ligne 2 slide-up (stagger 8f)
 *  f 50–68   Body text fade-in
 *  f 68–86   Feature check 1 slide-up
 *  f 71–89   Feature check 2 slide-up  (stagger 3f)
 *  f 74–92   Feature check 3 slide-up  (stagger 3f)
 *  f 96–116  CTA button scale-in
 *  f 15–40   Dashboard right slide-in depuis droite
 *  f 50–70   KPI cards fade-in (stagger)
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { A, C, F, FS, R } from "../tokens";
import { FadeIn } from "../components/FadeIn";
import { SlideUp } from "../components/SlideUp";
import { ScaleIn } from "../components/ScaleIn";
import { SlideIn } from "../components/SlideIn";

const FEATURES = [
  "Quittances générées et envoyées automatiquement",
  "Relances de loyers impayés sans intervention manuelle",
  "Comptabilité et reporting en temps réel",
];

const KPIS = [
  { num: "1 847", label: "Biens gérés", color: C.textPrimary },
  { num: "99%",   label: "Loyers collectés", color: C.textPrimary },
  { num: "3×",    label: "Plus rapide", color: C.accent },
];

const LOYERS = [
  { name: "Apt. 3 — Rue de la Paix", amount: "+1 250 €", status: "success" },
  { name: "Studio — Bd Haussmann",   amount: "+890 €",   status: "success" },
  { name: "T2 — Avenue Foch",        amount: "Relance",   status: "pending" },
  { name: "Maison — Vincennes",      amount: "+1 780 €", status: "success" },
];

export const LandscapeHero: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, A.enter], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: C.bgLight,
        fontFamily: F.body,
        overflow: "hidden",
      }}
    >
      {/* BG white → bgLight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: 1 - bgOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Décoration : cercle orange flou top-right */}
      <div
        style={{
          position: "absolute",
          top: -300,
          right: -200,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,135,83,0.09) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ─── Layout principal ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
        }}
      >
        {/* ── Colonne gauche : texte ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 80px 80px 120px",
            gap: 0,
          }}
        >
          {/* Logo + eyebrow */}
          <SlideIn from="left" delay={9} duration={15} style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: C.accent,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" fill="white" />
                  <path d="M8 11V8a4 4 0 018 0v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: F.display,
                    fontSize: FS.lg,
                    fontWeight: 600,
                    color: C.textPrimary,
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                  }}
                >
                  LOCKimmo
                </div>
                <div
                  style={{
                    fontSize: FS.xs,
                    fontWeight: 600,
                    color: C.accent,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginTop: 4,
                  }}
                >
                  Plateforme de gestion locative
                </div>
              </div>
            </div>
          </SlideIn>

          {/* H1 */}
          <div style={{ marginBottom: 32 }}>
            <SlideUp delay={20} duration={A.enter} distance={28}>
              <div
                style={{
                  fontFamily: F.display,
                  fontSize: FS["4xl"],
                  fontWeight: 700,
                  color: C.textPrimary,
                  letterSpacing: "-1.92px",
                  lineHeight: 1.08,
                }}
              >
                Gérez vos biens.
              </div>
            </SlideUp>
            <SlideUp delay={28} duration={A.enter} distance={28}>
              <div
                style={{
                  fontFamily: F.display,
                  fontSize: FS["4xl"],
                  fontWeight: 700,
                  color: C.accent,
                  letterSpacing: "-1.92px",
                  lineHeight: 1.08,
                }}
              >
                Sans friction.
              </div>
            </SlideUp>
          </div>

          {/* Body */}
          <FadeIn delay={50} duration={18} style={{ marginBottom: 36 }}>
            <div
              style={{
                fontSize: FS.base,
                color: C.textSecondary,
                lineHeight: 1.7,
                maxWidth: 520,
              }}
            >
              Automatisez le cycle complet de vos locations — de la quittance
              à la clôture comptable — sans jamais perdre le fil.
            </div>
          </FadeIn>

          {/* Feature checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 48 }}>
            {FEATURES.map((feat, i) => (
              <SlideUp key={feat} delay={68 + i * A.stagger} duration={A.enter} distance={14}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: FS.sm + 1, // 15px
                    color: C.textPrimary,
                    fontWeight: 500,
                  }}
                >
                  {/* Check icon */}
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(40,165,102,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2.5 5.5L4.5 7.5L8.5 3" stroke="#28A566" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  {feat}
                </div>
              </SlideUp>
            ))}
          </div>

          {/* CTA */}
          <ScaleIn delay={96}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "18px 36px",
                  background: C.accent,
                  borderRadius: R.btn,
                  fontSize: FS.base,
                  fontWeight: 600,
                  color: C.white,
                  fontFamily: F.body,
                }}
              >
                Démarrer gratuitement →
              </div>
              <div
                style={{
                  fontSize: FS.sm,
                  color: C.textSecondary,
                  fontWeight: 500,
                }}
              >
                14j d'essai · Sans CB
              </div>
            </div>
          </ScaleIn>
        </div>

        {/* ── Colonne droite : Dashboard mockup ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 80px 64px 40px",
          }}
        >
          <SlideIn from="right" delay={15} duration={20} style={{ width: "100%", maxWidth: 680 }}>
            {/* Card principale dashboard */}
            <div
              style={{
                background: C.white,
                borderRadius: 20,
                border: `1px solid ${C.borderAlpha}`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
                overflow: "hidden",
              }}
            >
              {/* Header dashboard */}
              <div
                style={{
                  padding: "20px 28px",
                  borderBottom: `1px solid ${C.borderAlpha}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontSize: FS.sm + 1,
                    fontWeight: 700,
                    color: C.textPrimary,
                  }}
                >
                  Tableau de bord · Juin 2026
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    background: "rgba(40,165,102,0.1)",
                    color: "#28A566",
                    fontSize: FS.xs,
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: R.pill,
                  }}
                >
                  ✓ Tout à jour
                </div>
              </div>

              {/* KPI row */}
              <FadeIn delay={50} duration={20}>
                <div
                  style={{
                    display: "flex",
                    borderBottom: `1px solid ${C.borderAlpha}`,
                  }}
                >
                  {KPIS.map((kpi, i) => (
                    <div
                      key={kpi.label}
                      style={{
                        flex: 1,
                        padding: "20px 0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        borderRight:
                          i < KPIS.length - 1
                            ? `1px solid ${C.borderAlpha}`
                            : "none",
                        background:
                          i === 2 ? "rgba(255,135,83,0.04)" : "transparent",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: F.display,
                          fontSize: FS.xl,
                          fontWeight: 600,
                          color: kpi.color,
                          letterSpacing: "-1px",
                        }}
                      >
                        {kpi.num}
                      </div>
                      <div
                        style={{
                          fontSize: FS.xs,
                          fontWeight: 600,
                          color: C.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Liste de loyers */}
              <div style={{ padding: "16px 0" }}>
                {LOYERS.map((loyer, i) => {
                  const rowDelay = 60 + i * 5;
                  return (
                    <FadeIn key={loyer.name} delay={rowDelay} duration={12}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 28px",
                        }}
                      >
                        {/* Dot */}
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background:
                              loyer.status === "success" ? "#28A566" : C.accent,
                            flexShrink: 0,
                          }}
                        />
                        {/* Nom bien */}
                        <div
                          style={{
                            flex: 1,
                            fontSize: FS.sm + 1,
                            color: C.textPrimary,
                            fontWeight: 500,
                          }}
                        >
                          {loyer.name}
                        </div>
                        {/* Montant */}
                        <div
                          style={{
                            fontFamily: F.display,
                            fontSize: FS.sm + 1,
                            fontWeight: 500,
                            color:
                              loyer.status === "success" ? "#28A566" : C.accent,
                          }}
                        >
                          {loyer.amount}
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>

              {/* Footer total */}
              <FadeIn delay={90} duration={15}>
                <div
                  style={{
                    margin: "0 20px 20px",
                    padding: "16px 20px",
                    background: "rgba(40,165,102,0.08)",
                    borderRadius: R.card,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontSize: FS.sm, color: "#28A566", fontWeight: 600 }}>
                    5 020 € collectés sur 6 270 € attendus
                  </div>
                  <div
                    style={{
                      fontSize: FS.xs,
                      color: C.accent,
                      fontWeight: 700,
                      padding: "4px 10px",
                      background: "rgba(255,135,83,0.1)",
                      borderRadius: R.pill,
                    }}
                  >
                    1 relance en cours
                  </div>
                </div>
              </FadeIn>
            </div>
          </SlideIn>
        </div>
      </div>
    </AbsoluteFill>
  );
};
