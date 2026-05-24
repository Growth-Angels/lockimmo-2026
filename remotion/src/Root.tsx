/**
 * LOCKimmo — Remotion Root
 *
 * Toutes les compositions sont enregistrées ici.
 * Les polices sont chargées une seule fois au niveau module (hors composant).
 *
 * Usage :
 *   npm run dev                → Remotion Studio (prévisualisation interactive)
 *   npm run render:square      → Export MP4 1080×1080
 *   npm run render:vertical    → Export MP4 1080×1920
 *   npm run render:landscape   → Export MP4 1920×1080
 */

import React from "react";
import { Composition } from "remotion";
import { initFonts } from "./load-fonts";
import { SquareIntro } from "./compositions/SquareIntro";
import { VerticalStory } from "./compositions/VerticalStory";
import { LandscapeHero } from "./compositions/LandscapeHero";
import { GestionPage } from "./compositions/GestionPage";
import { COMPOSITIONS } from "./tokens";

// ── Chargement des polices (une seule fois, au niveau module) ──
initFonts();

export const RemotionRoot = () => {
  return (
    <>
      {/* ── Carré 1080×1080 — LinkedIn / Instagram feed ── */}
      <Composition
        id="SquareIntro"
        component={SquareIntro}
        durationInFrames={COMPOSITIONS.square.durationInFrames}
        fps={COMPOSITIONS.square.fps}
        width={COMPOSITIONS.square.width}
        height={COMPOSITIONS.square.height}
      />

      {/* ── Vertical 1080×1920 — Stories / Reels / TikTok ── */}
      <Composition
        id="VerticalStory"
        component={VerticalStory}
        durationInFrames={COMPOSITIONS.vertical.durationInFrames}
        fps={COMPOSITIONS.vertical.fps}
        width={COMPOSITIONS.vertical.width}
        height={COMPOSITIONS.vertical.height}
      />

      {/* ── Paysage 1920×1080 — YouTube / site / LinkedIn vidéo ── */}
      <Composition
        id="LandscapeHero"
        component={LandscapeHero}
        durationInFrames={COMPOSITIONS.landscape.durationInFrames}
        fps={COMPOSITIONS.landscape.fps}
        width={COMPOSITIONS.landscape.width}
        height={COMPOSITIONS.landscape.height}
      />

      {/* ── Gestion 1920×1080 — Redesign page Gestion · 8s ── */}
      <Composition
        id="GestionPage"
        component={GestionPage}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
