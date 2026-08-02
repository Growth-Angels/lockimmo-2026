import React from 'react';
import { Link } from 'react-router-dom';
import { C, F } from '../../tokens';
import { MOCKUPS, type MockupDef } from './registry';

const MockupCard: React.FC<{ mockup: MockupDef }> = ({ mockup }) => {
  const { Component } = mockup;

  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 22,
    }}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              {mockup.title}
            </h2>
            <span style={{
              fontSize: 10.5, fontWeight: 700, color: C.textSecondary,
              background: C.bgApp, padding: '3px 9px', borderRadius: 20,
            }}>
              {mockup.width}×{mockup.height}
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: C.textSecondary, lineHeight: 1.55, margin: '0 0 10px' }}>
            {mockup.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {mockup.tags.map((t) => (
              <span key={t} style={{
                fontSize: 11, fontWeight: 600, color: C.textSecondary,
                border: `1px solid ${C.border}`, background: C.bgLight,
                padding: '4px 10px', borderRadius: 20,
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={`/capture/${mockup.id}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Ouvrir l'écran seul, sans interface — pour l'export en image"
          style={{
            display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0,
            padding: '8px 16px', borderRadius: 20,
            border: `1.5px solid ${C.border}`, background: 'none',
            color: C.textSecondary, fontSize: 12.5, fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Capturer
        </Link>
      </div>

      {/* Écran */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        background: C.bgLight, borderRadius: 12, padding: 20,
        overflowX: 'auto',
      }}>
        <div style={{ flexShrink: 0 }}>
          <Component />
        </div>
      </div>
    </div>
  );
};

export const Mockups: React.FC = () => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Mockups produit</h1>
      <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
        Écrans figuratifs illustrant chaque logiciel LOCKimmo — statiques, prêts à intégrer sur le site.
      </p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {MOCKUPS.map((m) => <MockupCard key={m.id} mockup={m} />)}
    </div>
  </div>
);
