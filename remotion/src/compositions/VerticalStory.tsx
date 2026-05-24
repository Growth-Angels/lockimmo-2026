/**
 * VerticalStory — 1080 × 1920 · 30 fps · 6s (180f)
 * Format : Instagram Stories / Reels / TikTok
 *
 * Timeline :
 *  f  0–15   BG orange fade-in
 *  f 15–30   Label haut fade-in
 *  f 30–90   Compteur animé 0 → 1847
 *  f 80–100  Unité + label sous le nombre
 *  f100–120  Texte body slide-up
 *  f130–150  Séparateur + stats secondaires
 *  f155–175  CTA scale-in
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { A, C, F, FS, R } from "../tokens";
import { FadeIn } from "../components/FadeIn";
import { SlideUp } from "../components/SlideUp";
import { ScaleIn } from "../components/ScaleIn";

const formatNum = (n: number): string =>
  Math.round(n).toLocaleString("fr-FR").replace(/ /g, " ");

export const VerticalStory: React.FC = () => {
  const frame = useCurrentFrame();

  // BG fade-in
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Compteur animé
  const countValue = interpolate(frame, [30, 90], [0, 1847], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Stats secondaires slide-up à f130
  const secondaryStats = [
    { num: "99%", label: "Loyers collectés" },
    { num: "3×",  label: "Plus rapide" },
    { num: "0",   label: "Relances oubliées" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: C.white,
        fontFamily: F.body,
        overflow: "hidden",
      }}
    >
      {/* ── Fond orange ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${C.accent} 0%, #FF6B2B 100%)`,
          opacity: bgOpacity,
        }}
      />

      {/* ── Motif de fond (cercles) ── */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: `1px solid rgba(255,255,255,0.12)`,
          opacity: bgOpacity * 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: `1px solid rgba(255,255,255,0.08)`,
          opacity: bgOpacity * 0.6,
        }}
      />

      {/* ── Contenu ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 80px",
          gap: 0,
        }}
      >
        {/* Logo haut */}
        <FadeIn delay={15} duration={15} style={{ marginBottom: 80 }}>
          <div
            style={{
              fontFamily: F.display,
              fontSize: FS.lg,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "-0.5px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="4" y="9" width="10" height="7" rx="2" fill="white" />
                <path d="M6 9V7a3 3 0 016 0v2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            LOCKimmo
          </div>
        </FadeIn>

        {/* Label "Biens gérés" au-dessus du compteur */}
        <FadeIn delay={20} duration={15} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: FS.sm,
              fontWeight: 600,
              color: "rgba(255,255,255,0.65)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Biens gérés sur la plateforme
          </div>
        </FadeIn>

        {/* Compteur géant */}
        <div style={{ marginBottom: 16 }}>
          <span
            style={{
              fontFamily: F.display,
              fontSize: 160,
              fontWeight: 700,
              color: C.white,
              letterSpacing: "-6px",
              lineHeight: 1,
              display: "block",
              textAlign: "center",
            }}
          >
            {formatNum(countValue)}
          </span>
        </div>

        {/* Séparateur */}
        <FadeIn delay={85} duration={10} style={{ marginBottom: 48 }}>
          <div
            style={{
              width: 48,
              height: 3,
              background: "rgba(255,255,255,0.4)",
              borderRadius: 2,
            }}
          />
        </FadeIn>

        {/* Tagline */}
        <SlideUp delay={100} duration={A.enter} distance={20} style={{ marginBottom: 60, textAlign: "center" }}>
          <div
            style={{
              fontFamily: F.display,
              fontSize: FS["2xl"],
              fontWeight: 500,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.8px",
              lineHeight: 1.3,
              textAlign: "center",
            }}
          >
            Propriétaires qui font<br />confiance à LOCKimmo.
          </div>
        </SlideUp>

        {/* Stats secondaires */}
        <FadeIn delay={130} duration={20} style={{ width: "100%", marginBottom: 64 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            {secondaryStats.map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: R.card,
                  padding: "20px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: F.display,
                    fontSize: FS.xl,
                    fontWeight: 600,
                    color: C.white,
                    letterSpacing: "-1px",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: FS.xs,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    textAlign: "center",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <ScaleIn delay={155}>
          <div
            style={{
              padding: "22px 56px",
              background: C.white,
              borderRadius: R.btn,
              fontSize: FS.base,
              fontWeight: 600,
              color: C.accent,
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
