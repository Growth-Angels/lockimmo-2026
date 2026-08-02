import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { C } from '../../tokens';
import { MOTIONS } from './registry';

/**
 * Page de capture : affiche UNE seule scène, seule au centre d'une page nue
 * (ni sidebar, ni topbar, ni carte). Pensée pour l'enregistrement d'écran —
 * la scène est rendue à sa taille exacte, sans mise à l'échelle.
 *
 * URL   : /capture/<id>          (ex. /capture/ai-automation)
 * Options :
 *   ?bare=1   coins carrés + fond identique à la scène (aucune bordure visible)
 *   ?grid=1   repères d'alignement aux angles, pour caler la zone de capture
 */
export const MotionSolo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const bare = params.get('bare') === '1';
  const grid = params.get('grid') === '1';

  const motion = MOTIONS.find((m) => m.id === id);

  if (!motion) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.bgPage, color: C.textSecondary, fontSize: 14, padding: 24, textAlign: 'center',
      }}>
        <div>
          <div style={{ fontWeight: 700, color: C.textPrimary, marginBottom: 10 }}>Motion introuvable</div>
          <div style={{ marginBottom: 14 }}>Identifiants disponibles :</div>
          {MOTIONS.map((m) => (
            <div key={m.id} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5 }}>
              /capture/{m.id}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { Component } = motion;

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: bare ? C.bgApp : C.bgPage,
    }}>
      <div style={{
        position: 'relative',
        width: motion.width, height: motion.height,
        flexShrink: 0,
        borderRadius: bare ? 0 : 18,
        overflow: 'hidden',
      }}>
        <Component />

        {/* Repères d'angle — aident à caler la sélection de capture au pixel près */}
        {grid && [
          { top: 0, left: 0 }, { top: 0, right: 0 },
          { bottom: 0, left: 0 }, { bottom: 0, right: 0 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos, width: 14, height: 14,
            border: `2px solid ${C.accent}`, pointerEvents: 'none',
            borderTopWidth: 'top' in pos ? 2 : 0,
            borderBottomWidth: 'bottom' in pos ? 2 : 0,
            borderLeftWidth: 'left' in pos ? 2 : 0,
            borderRightWidth: 'right' in pos ? 2 : 0,
          }} />
        ))}
      </div>
    </div>
  );
};
