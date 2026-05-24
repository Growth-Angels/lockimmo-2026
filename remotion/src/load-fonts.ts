/**
 * LOCKimmo — Chargement des polices
 *
 * - Chillax (Medium 500, SemiBold 600, Bold 700) : fichiers locaux dans public/fonts/
 * - Inter (Regular 400, SemiBold 600) : Google Fonts via @remotion/google-fonts
 *
 * Appeler initFonts() une seule fois dans Root.tsx, au niveau module (hors composant).
 */

import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const initFonts = (): void => {
  const handle = delayRender("Chargement des polices LOCKimmo…");

  // Inter via Google Fonts CDN (géré par @remotion/google-fonts)
  const { waitUntilDone } = loadInter("normal", {
    weights: ["400", "600"],
  });

  // Chillax via fichiers locaux (public/fonts/)
  const chillaxVariants: [string, string][] = [
    ["Chillax-Medium.ttf",   "500"],
    ["Chillax-SemiBold.ttf", "600"],
    ["Chillax-Bold.ttf",     "700"],
  ];

  const chillaxPromises = chillaxVariants.map(([file, weight]) => {
    const face = new FontFace(
      "Chillax",
      `url(${staticFile(`fonts/${file}`)})`,
      { weight, style: "normal" }
    );
    return face.load().then((loaded) => {
      (document.fonts as FontFaceSet & { add: (f: FontFace) => void }).add(loaded);
    });
  });

  Promise.all([waitUntilDone(), ...chillaxPromises])
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error("[loadFonts] Erreur :", err);
      continueRender(handle); // on continue quand même pour ne pas bloquer
    });
};
