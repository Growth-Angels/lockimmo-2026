import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface SlideInProps {
  /** Direction d'entrée */
  from?: "left" | "right";
  /** Frame de début */
  delay?: number;
  /** Durée en frames */
  duration?: number;
  /** Distance en px */
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * SlideIn — translate horizontal + fade.
 * Utilisé pour les layouts split (LandscapeHero).
 */
export const SlideIn: React.FC<SlideInProps> = ({
  from = "left",
  delay = 0,
  duration = 15,
  distance = 40,
  children,
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const dir   = from === "left" ? -1 : 1;
  const tx    = (1 - progress) * distance * dir;

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateX(${tx}px)`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
