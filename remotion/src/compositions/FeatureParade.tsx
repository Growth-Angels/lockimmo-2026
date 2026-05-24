/**
 * FeatureParade — 750 × 320 · 30 fps · 8s (240f)
 * Défile 6 fonctionnalités clés de LOCKimmo, une par une.
 *
 * Timeline :
 *  f   0–10   BG + shell fade-in
 *  f   0–40   Feature 1 (enter f0–10 · hold f10–30 · exit f30–40)
 *  f  40–80   Feature 2
 *  f  80–120  Feature 3
 *  f 120–160  Feature 4
 *  f 160–200  Feature 5
 *  f 200–240  Feature 6 (enter + hold, reste à l'écran)
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, F } from "../tokens";

/* ─── Data ──────────────────────────────────────────────────────── */

const FEATURES = [
  { label: "Quittances automatiques",  icon: "document" },
  { label: "Relances loyers impayés",  icon: "bell"     },
  { label: "Synchronisation bancaire", icon: "bank"     },
  { label: "Comptabilité temps réel",  icon: "chart"    },
  { label: "Paiements propriétaires", icon: "card"     },
  { label: "Déclarations fiscales",    icon: "tax"      },
] as const;

const FRAME_PER_FEATURE = 40; // 6 × 40f = 240f = 8s
const ENTER             = 10; // frames to slide in
const EXIT              = 10; // frames to slide out
const BG                = "#EDE9E5";

/* ─── Icons ─────────────────────────────────────────────────────── */

const FeatureIcon: React.FC<{
  type: string;
  size: number;
  color: string;
}> = ({ type, size, color }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" as const };

  if (type === "document") return (
    <svg {...p}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13h8M8 17h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  if (type === "bell") return (
    <svg {...p}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="5" r="3" fill={color} opacity="0.9" />
    </svg>
  );

  if (type === "bank") return (
    <svg {...p}>
      <path d="M3 22h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 22V12M10 22V12M14 22V12M18 22V12"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 12h16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 9l9-6 9 6"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (type === "chart") return (
    <svg {...p}>
      <polyline points="3,17 8,12 12,14 17,8 21,11"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  if (type === "card") return (
    <svg {...p}>
      <rect x="2" y="5" width="20" height="14" rx="2"
        stroke={color} strokeWidth="1.5" />
      <path d="M2 10h20" stroke={color} strokeWidth="1.5" />
      <rect x="5" y="14" width="5" height="2" rx="1" fill={color} opacity="0.8" />
    </svg>
  );

  if (type === "tax") return (
    <svg {...p}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke={color} strokeWidth="1.5" />
      <path d="M9 13h6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.5 11.5a2.5 2.5 0 100 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );

  return null;
};

/* ─── Composition ────────────────────────────────────────────────── */

export const FeatureParade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* Shell fade-in */
  const shellOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  /* Active feature */
  const activeIndex = Math.min(
    Math.floor(frame / FRAME_PER_FEATURE),
    FEATURES.length - 1
  );
  const localFrame = frame - activeIndex * FRAME_PER_FEATURE;
  const isLast     = activeIndex === FEATURES.length - 1;
  const feature    = FEATURES[activeIndex];

  // Diagonal 30° from vertical : enter top-right → center → exit bottom-left
  // At 30° from vertical : X = sin(30°) × d = 0.5 × d, Y = cos(30°) × d ≈ 0.866 × d
  const DIST = 260; // travel distance along the diagonal
  const DX   = Math.round(DIST * Math.sin((30 * Math.PI) / 180)); // ≈ 130
  const DY   = Math.round(DIST * Math.cos((30 * Math.PI) / 180)); // ≈ 225

  /* Enter : top-right → center */
  const enterProgress = localFrame <= ENTER
    ? interpolate(localFrame, [0, ENTER], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;

  /* Exit : center → bottom-left (skipped for last feature) */
  const exitProgress = !isLast && localFrame >= FRAME_PER_FEATURE - EXIT
    ? interpolate(
        localFrame,
        [FRAME_PER_FEATURE - EXIT, FRAME_PER_FEATURE],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic) }
      )
    : 0;

  // Enter comes from top-right (+DX, -DY), exit goes to bottom-left (-DX, +DY)
  const featureX = enterProgress * DX  - exitProgress * DX;
  const featureY = enterProgress * -DY + exitProgress * DY;

  // 3D rotation: enters rotated from the right (-35°), holds front-on, exits rotated to the left (+35°)
  const rotateY = enterProgress * -35 + exitProgress * 35;

  /* Opacity */
  const featureOpacity = interpolate(
    localFrame,
    isLast
      ? [0, ENTER, FRAME_PER_FEATURE]
      : [0, ENTER, FRAME_PER_FEATURE - EXIT, FRAME_PER_FEATURE],
    isLast ? [0, 1, 1] : [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  /* Icon spring scale (bounces in with each new feature) */
  const iconScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 140 },
    from: 0.72,
    to: 1,
  });


  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily: F.body,
        overflow: "hidden",
      }}
    >
      {/* Glow top-right */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -60,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,135,83,0.10) 0%, transparent 70%)",
          opacity: shellOpacity,
          pointerEvents: "none",
        }}
      />

      {/* ── Feature area (center) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `perspective(900px) translate(${featureX}px, ${featureY}px) rotateY(${rotateY}deg)`,
          opacity: featureOpacity,
        }}
      >
        {/* Icon bubble */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            background: "rgba(255,135,83,0.12)",
            border: "1px solid rgba(255,135,83,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            transform: `scale(${iconScale})`,
          }}
        >
          <FeatureIcon type={feature.icon} size={32} color={C.accent} />
        </div>

        {/* Feature label */}
        <div
          style={{
            fontFamily: F.display,
            fontSize: 34,
            fontWeight: 700,
            color: C.accent,
            letterSpacing: "-1px",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {feature.label}
        </div>
      </div>

      {/* ── Bottom : dots ── */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          opacity: shellOpacity,
        }}
      >
        {FEATURES.map((_, i) => (
          <div
            key={i}
            style={{
              width:        i === activeIndex ? 22 : 6,
              height:       6,
              borderRadius: 3,
              background:   i === activeIndex
                ? C.accent
                : "rgba(53,50,48,0.18)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
