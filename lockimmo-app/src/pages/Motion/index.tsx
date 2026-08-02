import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { C, F } from '../../tokens';
import { MOTIONS, type MotionDef } from './registry';

const MotionCard: React.FC<{ motion: MotionDef }> = ({ motion }) => {
  // Remonter le composant via `key` relance la boucle depuis le début.
  const [runId, setRunId] = useState(0);
  const { Component } = motion;

  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 22,
    }}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              {motion.title}
            </h2>
            <span style={{
              fontSize: 10.5, fontWeight: 700, color: C.textSecondary,
              background: C.bgApp, padding: '3px 9px', borderRadius: 20,
            }}>
              {motion.ratio} · {motion.width}×{motion.height}
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>
            {motion.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Link
            to={`/capture/${motion.id}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir la scène seule, sans interface — pour l'enregistrement d'écran"
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 20,
              border: `1.5px solid ${C.border}`, background: 'none',
              color: C.textSecondary, fontSize: 12.5, fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Capturer
          </Link>

          <button
            onClick={() => setRunId((n) => n + 1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 20,
              border: `1.5px solid ${C.accent}`, background: 'none',
              color: C.accent, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Rejouer
          </button>
        </div>
      </div>

      {/* Scène */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        background: C.bgLight, borderRadius: 12, padding: 24,
        overflowX: 'auto',
      }}>
        {/* flexShrink: 0 — la scène doit garder ses dimensions exactes, jamais être écrasée */}
        <div style={{ flexShrink: 0 }}>
          <Component key={runId} />
        </div>
      </div>
    </div>
  );
};

export const Motion: React.FC = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Motion</h1>
      <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
        Animations symboliques illustrant les actions clés de LOCKimmo — format mockup, prêtes à filmer.
      </p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {MOTIONS.map((m) => <MotionCard key={m.id} motion={m} />)}
    </div>
  </div>
);
