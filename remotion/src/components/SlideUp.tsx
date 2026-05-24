import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface SlideUpProps {
  /** Frame de début */
  delay?: number;
  /** Durée en frames (défaut : token A.enter = 9f) */
  duration?: number;
  /** Distance de déplacement en px (défaut : 24px) */
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * SlideUp — translateY +distance → 0 + fade
 * Entrée par défaut pour textes et blocs.
 * Easing : easeOut cubic (token "easeOut").
 */
export const SlideUp: React.FC<SlideUpProps> = ({
  delay = 0,
  duration = 9,
  distance = 24,
  children,
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * distance}px)`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
