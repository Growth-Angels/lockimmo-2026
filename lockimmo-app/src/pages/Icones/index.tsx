import React, { useState } from 'react';
import { C } from '../../tokens';
import { Icon, ICON_NAMES, downloadIconPng } from '../../icons';

/** Libellé lisible pour chaque icône du menu. */
const ICON_LABELS: Record<string, string> = {
  grid: 'Tableau de bord',
  'bar-chart': 'Loyers & finances',
  'credit-card': 'Encaissements',
  book: 'Comptabilité',
  'alert-triangle': 'Sinistres',
  zap: 'Automatisations',
  'file-signature': 'Mandat vente',
  inbox: 'Demandes clients',
  database: 'Vos données',
  settings: 'Gestion',
  home: 'Mise en location',
  clock: 'Loc. courte durée',
  'file-text': 'Éditions',
  'message-circle': 'Communication',
  broadcast: 'Diffusion',
  shapes: 'Icônes',
  'help-circle': 'Assistance',
  'log-out': 'Déconnexion',
};

const CSS = `
.icon-card {
  transition: transform .15s, box-shadow .15s, border-color .15s;
  cursor: pointer;
}
.icon-card:hover {
  border-color: ${C.accent};
  box-shadow: 0 8px 24px rgba(255,135,83,0.16);
  transform: translateY(-3px);
}
.icon-card:hover .icon-tile { background: ${C.accent}; }
.icon-card:hover .icon-tile svg { stroke: #fff; }
.icon-card:active { transform: translateY(-1px); }
.icon-dl {
  opacity: 0;
  transition: opacity .15s;
}
.icon-card:hover .icon-dl { opacity: 1; }
`;

export const Icones: React.FC = () => {
  const [flashed, setFlashed] = useState<string | null>(null);

  const handleDownload = (name: string) => {
    downloadIconPng(name, 128);
    setFlashed(name);
    window.setTimeout(() => setFlashed((cur) => (cur === name ? null : cur)), 1400);
  };

  return (
    <div>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Bibliothèque d'icônes</h1>
          <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>
            Toutes les icônes utilisées dans le menu de l'application. Cliquez sur une icône pour la télécharger en PNG&nbsp;128×128&nbsp;px.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', borderRadius: 20,
          background: C.accentLight, color: C.accent,
          fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          <Icon name="shapes" size={15} />
          {ICON_NAMES.length} icônes
        </div>
      </div>

      {/* Grille */}
      <div style={{
        marginTop: 24,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))',
        gap: 16,
      }}>
        {ICON_NAMES.map((name) => (
          <div
            key={name}
            className="icon-card"
            onClick={() => handleDownload(name)}
            title={`Télécharger « ${ICON_LABELS[name] ?? name} » en 128×128 px`}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: '22px 14px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              position: 'relative',
            }}
          >
            <div className="icon-tile" style={{
              width: 64, height: 64, borderRadius: 16,
              background: C.accentLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s',
            }}>
              <Icon name={name} size={32} color={C.accent} strokeWidth={1.6} />
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, textAlign: 'center', lineHeight: 1.3 }}>
              {ICON_LABELS[name] ?? name}
            </div>
            <code style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 11, color: C.textSecondary,
              background: '#F4F1EE', padding: '2px 7px', borderRadius: 6,
            }}>
              {name}
            </code>

            <div className="icon-dl" style={{
              marginTop: 2,
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 600,
              color: flashed === name ? '#28A566' : C.accent,
            }}>
              {flashed === name ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#28A566" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Téléchargée !
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PNG 128px
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
