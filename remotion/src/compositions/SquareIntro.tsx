/**
 * SquareIntro — 1080 × 1080 · 30 fps · 5s (150f)
 * Format : LinkedIn feed / Instagram carré
 *
 * Timeline :
 *  f  0– 9  BG + logo icon fade-in
 *  f  9–24  Wordmark slide-up
 *  f 24–39  Tagline slide-up
 *  f 39–60  3 feature pills, stagger 7f chacun
 *  f 80–95  Stats row fade-in
 *  f110–130 CTA scale-in
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { A, C, F, FS, R } from "../tokens";
import { FadeIn } from "../components/FadeIn";
import { SlideUp } from "../components/SlideUp";
import { ScaleIn } from "../components/ScaleIn";

const PILLS = [
  "📄  Quittances automatiques",
  "🔔  Relances intelligentes",
  "📊  Comptabilité centralisée",
];

const STATS = [
  { num: "1 847", label: "Biens gérés" },
  { num: "99%",   label: "Loyers collectés" },
  { num: "3×",    label: "Plus rapide" },
];

export const SquareIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // Fond : white → bgLight
  const bgOpacity = interpolate(frame, [0, A.enter], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: C.bgLight,
        fontFamily: F.body,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
        gap: 0,
      }}
    >
      {/* Bande de fond blanche derrière tout (fade-in douce) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: 1 - bgOpacity,
          pointerEvents: "none",
        }}
      />

      {/* ── Contenu principal ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          width: "100%",
          maxWidth: 880,
        }}
      >
        {/* Logo icon + wordmark */}
        <FadeIn delay={0} duration={A.enter} style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: C.accent,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Icône verrou simplifié */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M10 18h16M18 10a6 6 0 00-6 6v2h12v-2a6 6 0 00-6-6z"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="8" y="18" width="20" height="14" rx="3" fill="white" opacity={0.9} />
            </svg>
          </div>
        </FadeIn>

        <SlideUp delay={A.enter} duration={A.enter} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontFamily: F.display,
              fontSize: FS["4xl"],
              fontWeight: 700,
              color: C.textPrimary,
              letterSpacing: "-1.92px",
              lineHeight: 1.05,
              textAlign: "center",
            }}
          >
            LOCKimmo
          </div>
        </SlideUp>

        {/* Tagline */}
        <SlideUp delay={A.enter * 2 + 6} duration={A.enter} style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: F.display,
              fontSize: FS["2xl"],
              fontWeight: 500,
              color: C.textSecondary,
              letterSpacing: "-0.8px",
              textAlign: "center",
            }}
          >
            La gestion locative clarifiée.
          </div>
        </SlideUp>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
            marginBottom: 56,
          }}
        >
          {PILLS.map((pill, i) => (
            <SlideUp
              key={pill}
              delay={39 + i * 7}
              duration={A.enter}
              distance={16}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 24px",
                  background: C.white,
                  border: `1px solid ${C.borderAlpha}`,
                  borderRadius: R.card,
                  fontSize: FS.base,
                  fontWeight: 600,
                  color: C.textPrimary,
                  boxShadow: "0 1px 4px rgba(53,50,48,0.06)",
                }}
              >
                {pill}
              </div>
            </SlideUp>
          ))}
        </div>

        {/* Stats row */}
        <FadeIn delay={80} duration={15} style={{ width: "100%", marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              border: `1px solid ${C.borderAlpha}`,
              borderRadius: R.card,
              overflow: "hidden",
              background: C.white,
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  padding: "20px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  borderRight:
                    i < STATS.length - 1 ? `1px solid ${C.borderAlpha}` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: F.display,
                    fontSize: FS.xl,
                    fontWeight: 600,
                    color: i === 2 ? C.accent : C.textPrimary,
                    letterSpacing: "-1.12px",
                  }}
                >
                  {stat.num}
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
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <ScaleIn delay={110}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 40px",
              background: C.accent,
              borderRadius: R.btn,
              fontSize: FS.sm + 2, // 16px
              fontWeight: 600,
              color: C.white,
              fontFamily: F.body,
              letterSpacing: "0.01em",
            }}
          >
            Démarrer gratuitement →
          </div>
        </ScaleIn>
      </div>
    </AbsoluteFill>
  );
};
