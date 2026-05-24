import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { A } from "../tokens";

interface ScaleInProps {
  /** Frame de début */
  delay?: number;
  /** Config spring : { damping, stiffness } */
  springConfig?: { damping: number; stiffness: number };
  /** Échelle de départ (défaut : 0.92) */
  from?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * ScaleIn — scale from → 1 + fade, avec rebond léger (spring doux).
 * Idéal pour CTAs, boutons, badges, cartes.
 */
export const ScaleIn: React.FC<ScaleInProps> = ({
  delay = 0,
  springConfig = A.spring,
  from = 0.92,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: springConfig,
  });

  const scale   = interpolate(progress, [0, 1], [from,  1]);
  const opacity = interpolate(Math.min(progress, 1), [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
