import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface FadeInProps {
  /** Frame de début de l'animation */
  delay?: number;
  /** Durée en frames (défaut : token A.enter = 9f) */
  duration?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * FadeIn — opacité 0 → 1
 * Mouvement le plus discret du vocabulaire LOCKimmo.
 */
export const FadeIn: React.FC<FadeInProps> = ({
  delay = 0,
  duration = 9,
  children,
  style,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return <div style={{ opacity, ...style }}>{children}</div>;
};
