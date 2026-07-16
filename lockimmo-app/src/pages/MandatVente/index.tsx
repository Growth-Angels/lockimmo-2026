import React from 'react';
import { C, F } from '../../tokens';

/* ─── Data ─────────────────────────────────────────────────────────── */

const STEPS = [
  { label: 'Descriptif',            icon: 'home',     done: true,  active: true  },
  { label: 'Diagnostics',           icon: 'shield',   done: true,  active: false },
  { label: 'Honoraires',            icon: 'percent',  done: true,  active: false },
  { label: 'Photos',                icon: 'image',    done: true,  active: false },
  { label: 'Documents',             icon: 'file',     done: false, active: false },
  { label: 'Informations vendeurs', icon: 'user',     done: false, active: false },
];

const PROPERTY_TYPES = [
  { label: 'Maison',          active: true  },
  { label: 'Appartement',     active: false },
  { label: 'Terrain',         active: false },
  { label: 'Local commercial', active: false },
];

const DPE_LETTERS = [
  { l: 'A', color: '#00A651' },
  { l: 'B', color: '#4CB748' },
  { l: 'C', color: '#C8D200' },
  { l: 'D', color: '#FFEE0F' },
  { l: 'E', color: '#FBA200' },
  { l: 'F', color: '#F37E20' },
  { l: 'G', color: '#ED1C24' },
];

const DOCUMENTS = [
  { name: 'Mandat de vente signé',           status: 'signed',  size: '180 ko · PDF' },
  { name: 'État des risques (ERP)',          status: 'signed',  size: '92 ko · PDF'  },
  { name: 'Titre de propriété',              status: 'signed',  size: '1,2 Mo · PDF' },
  { name: 'Règlement de copropriété',        status: 'missing', size: '—' },
  { name: 'Procès-verbaux AG (3 derniers)',  status: 'missing', size: '—' },
];

const PHOTOS = [
  { label: 'Salon',        emoji: '🛋️', cover: true  },
  { label: 'Cuisine',      emoji: '🍳' },
  { label: 'Chambre',      emoji: '🛏️' },
  { label: 'Salle de bain', emoji: '🛁' },
  { label: 'Jardin',       emoji: '🌳' },
];

/* ─── Helpers ──────────────────────────────────────────────────────── */
const fmtEur = (n: number) => n.toLocaleString('fr-FR') + ' €';

const PROPERTY = {
  type: 'Maison',
  title: 'Maison familiale avec jardin',
  surface: 145,
  rooms: 6,
  bedrooms: 4,
  bathrooms: 2,
  floors: 'R+1',
  year: 1998,
  city: '17 rue des Tilleuls · 33000 Bordeaux',
  price: 485000,
};

const COMMISSION_PCT = 4.5;
const COMMISSION_TTC = Math.round(PROPERTY.price * COMMISSION_PCT / 100);

/* ─── Sub-components ───────────────────────────────────────────────── */

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, ...style }}>
    {children}
  </div>
);

const SectionHeader: React.FC<{ num: number; title: string; sub?: string; right?: React.ReactNode }> = ({ num, title, sub, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
    <div style={{
      width: 26, height: 26, borderRadius: 8,
      background: '#FFF4EE', color: C.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.display, fontSize: 12, fontWeight: 600, letterSpacing: '-0.02em',
      flexShrink: 0,
    }}>{num}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 16, color: C.textPrimary, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#AAA09A', marginTop: 2 }}>{sub}</div>}
    </div>
    {right}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#AAA09A', marginBottom: 6 }}>
    {children}
  </div>
);

const Field: React.FC<{ label: string; value: string; flex?: number }> = ({ label, value, flex }) => (
  <div style={{ flex: flex ?? 1, minWidth: 0 }}>
    <Label>{label}</Label>
    <div style={{
      padding: '10px 12px', background: '#F3F0ED', borderRadius: 9,
      fontSize: 13, color: C.textPrimary, fontWeight: 500,
      border: '1px solid rgba(53,50,48,0.06)',
    }}>{value}</div>
  </div>
);

const Chip: React.FC<{ active?: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 13px', borderRadius: 100,
    background: active ? C.accent : '#F3F0ED',
    color: active ? '#fff' : '#6C6057',
    fontSize: 12.5, fontWeight: 600,
    border: active ? 'none' : '1px solid rgba(53,50,48,0.06)',
    cursor: 'pointer',
    boxShadow: active ? '0 2px 8px rgba(255,135,83,0.25)' : 'none',
  }}>{children}</div>
);

const StepIcon: React.FC<{ kind: string }> = ({ kind }) => {
  const props = { width: 13, height: 13, viewBox: '0 0 13 13', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const };
  if (kind === 'home')    return <svg {...props}><path d="M2 6l4.5-4L11 6v5.5H2z"/><path d="M5 11.5V8h3v3.5"/></svg>;
  if (kind === 'shield')  return <svg {...props}><path d="M6.5 1.5l4 1.5v3.5c0 2.5-1.5 4.5-4 5.5-2.5-1-4-3-4-5.5V3z"/></svg>;
  if (kind === 'percent') return <svg {...props}><path d="M2 11l9-9"/><circle cx="3.5" cy="3.5" r="1.2"/><circle cx="9.5" cy="9.5" r="1.2"/></svg>;
  if (kind === 'image')   return <svg {...props}><rect x="1.5" y="2.5" width="10" height="8" rx="1"/><circle cx="4.5" cy="5" r="1"/><path d="M1.5 9l3-2 3 2 4-3"/></svg>;
  if (kind === 'file')    return <svg {...props}><path d="M3 1.5h5l3 3v7H3z"/><path d="M8 1.5v3h3"/></svg>;
  return <svg {...props}><circle cx="6.5" cy="4.5" r="2"/><path d="M2 11.5c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5"/></svg>;
};

/* ═══════════════════════════════════════════════════════════════════ */
export const MandatVente: React.FC = () => {
  return (
    <div>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#AAA09A', marginBottom: 14 }}>
        Accueil <span style={{ opacity: 0.4 }}>›</span>
        Transactions <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: C.textPrimary, fontWeight: 500 }}>Nouveau mandat de vente</span>
      </div>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `linear-gradient(135deg, ${C.accent}, #FFBD86)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, boxShadow: '0 4px 16px rgba(255,135,83,0.3)', flexShrink: 0,
        }}>📄</div>
        <div>
          <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: 28, color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Nouveau mandat de vente
          </div>
          <div style={{ fontSize: 13, color: '#AAA09A', marginTop: 2 }}>
            Réf. M-2026-0124 · créé le 27 mai · auto-sauvegarde activée
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{
            padding: '9px 16px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.white,
            color: C.textPrimary, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M2.5 1.5h6l2.5 2.5v7h-9z"/><path d="M3.5 1.5v3h5"/></svg>
            Brouillon
          </button>
          <button style={{
            padding: '9px 16px', borderRadius: 9, border: 'none', background: C.accent,
            color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(255,135,83,0.3)',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1.5 6.5l3 3 7-7"/></svg>
            Publier le mandat
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 14,
        padding: '14px 18px', marginBottom: 18,
        display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto',
      }}>
        {STEPS.map((s, i) => {
          const isActive = s.active;
          const isDone = s.done && !s.active;
          return (
            <React.Fragment key={s.label}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', borderRadius: 8,
                background: isActive ? '#FFF4EE' : 'transparent',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: isDone ? '#EDFBF4' : isActive ? C.accent : '#F3F0ED',
                  color: isDone ? '#28A566' : isActive ? '#fff' : '#AAA09A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: isDone ? '1px solid #28A566' : 'none',
                }}>
                  {isDone ? (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 5.5l2.5 2.5L9 2"/></svg>
                  ) : (
                    <StepIcon kind={s.icon}/>
                  )}
                </div>
                <span style={{
                  fontSize: 12.5,
                  fontWeight: isActive ? 700 : isDone ? 600 : 500,
                  color: isActive ? C.accent : isDone ? C.textPrimary : '#AAA09A',
                  whiteSpace: 'nowrap',
                }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: '#DDD8D4', minWidth: 16 }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Row 1: Descriptif (big) + Diagnostics */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Descriptif */}
        <Card>
          <SectionHeader
            num={1}
            title="Descriptif du bien"
            sub="Caractéristiques principales et adresse"
            right={
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#EDFBF4', color: '#28A566',
                fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 4.5l2 2L7 2"/></svg>
                Complété
              </span>
            }
          />

          <div style={{ marginBottom: 16 }}>
            <Label>Type de bien</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PROPERTY_TYPES.map(p => <Chip key={p.label} active={p.active}>{p.label}</Chip>)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <Field label="Titre de l'annonce" value={PROPERTY.title} flex={2}/>
            <Field label="Prix de vente" value={fmtEur(PROPERTY.price)} flex={1}/>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <Field label="Surface" value={`${PROPERTY.surface} m²`}/>
            <Field label="Pièces" value={`${PROPERTY.rooms}`}/>
            <Field label="Chambres" value={`${PROPERTY.bedrooms}`}/>
            <Field label="SDB" value={`${PROPERTY.bathrooms}`}/>
            <Field label="Étages" value={PROPERTY.floors}/>
            <Field label="Année" value={`${PROPERTY.year}`}/>
          </div>

          <div style={{ marginBottom: 14 }}>
            <Label>Adresse</Label>
            <div style={{
              padding: '10px 12px', background: '#F3F0ED', borderRadius: 9,
              fontSize: 13, color: C.textPrimary, fontWeight: 500,
              border: '1px solid rgba(53,50,48,0.06)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.accent} strokeWidth="1.7" strokeLinecap="round"><path d="M7 12.5S2 8.5 2 5.5a5 5 0 0110 0c0 3-5 7-5 7z"/><circle cx="7" cy="5.5" r="1.5"/></svg>
              {PROPERTY.city}
            </div>
          </div>

          <div>
            <Label>Description publique</Label>
            <div style={{
              padding: '12px 14px', background: '#FAFAF9', borderRadius: 9,
              fontSize: 13, color: '#6C6057', lineHeight: 1.55,
              border: '1px solid rgba(53,50,48,0.06)',
            }}>
              Splendide maison familiale de <strong>145 m²</strong> sur un terrain arboré de 380 m². Au calme dans un quartier recherché de Bordeaux, à 5 min des écoles. Comprend un séjour traversant, une cuisine équipée ouverte, 4 chambres dont une suite parentale, 2 salles de bain, garage et terrasse plein sud…
            </div>
          </div>
        </Card>

        {/* Diagnostics */}
        <Card>
          <SectionHeader num={2} title="Diagnostics" sub="DPE · GES · valides jusqu'en 2034"/>

          <Label>Étiquette énergie · DPE</Label>
          <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
            {DPE_LETTERS.map(d => {
              const active = d.l === 'B';
              return (
                <div key={d.l} style={{
                  flex: 1, height: active ? 38 : 28,
                  background: d.color, color: active ? '#fff' : 'rgba(255,255,255,0.85)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: F.display, fontWeight: 600, fontSize: active ? 17 : 12,
                  borderRadius: 4,
                  opacity: active ? 1 : 0.5,
                  border: active ? '2px solid #353230' : 'none',
                  letterSpacing: '-0.02em',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}>
                  {d.l}
                  {active && (
                    <span style={{
                      position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)',
                      fontSize: 10, fontWeight: 700, color: C.textPrimary, whiteSpace: 'nowrap',
                    }}>92 kWh/m²·an</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, marginBottom: 8 }}>
            <Label>Gaz à effet de serre · GES</Label>
            <div style={{ display: 'flex', gap: 2 }}>
              {DPE_LETTERS.map(d => {
                const active = d.l === 'A';
                return (
                  <div key={d.l} style={{
                    flex: 1, height: active ? 32 : 22,
                    background: d.color, color: active ? '#fff' : 'rgba(255,255,255,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: F.display, fontWeight: 600, fontSize: active ? 14 : 11,
                    borderRadius: 4,
                    opacity: active ? 1 : 0.5,
                    border: active ? '2px solid #353230' : 'none',
                    letterSpacing: '-0.02em',
                  }}>{d.l}</div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: '#AAA09A', marginTop: 8 }}>3 kg CO₂eq/m²·an · diagnostic du 14/03/2024</div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${C.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Amiante', 'Plomb', 'Termites', 'État des risques', 'Électricité', 'Gaz'].map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6C6057' }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#28A566" strokeWidth="2" strokeLinecap="round"><path d="M2 5.5l2.5 2.5L9 2"/></svg>
                {d}
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Row 2: Honoraires + Vendeurs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Honoraires */}
        <Card>
          <SectionHeader num={3} title="Honoraires" sub="À la charge du vendeur"/>

          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            padding: '16px 18px', background: 'linear-gradient(135deg, #FFF8F3, #FFF4EE)',
            borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 14,
          }}>
            <div>
              <Label>Commission TTC</Label>
              <div style={{ fontFamily: F.display, fontSize: 32, fontWeight: 500, color: C.textPrimary, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {fmtEur(COMMISSION_TTC)}
              </div>
            </div>
            <div style={{
              fontFamily: F.display, fontSize: 22, fontWeight: 500,
              color: C.accent, letterSpacing: '-0.03em',
              background: '#fff', padding: '8px 14px', borderRadius: 10,
              border: `1px solid ${C.border}`,
            }}>{COMMISSION_PCT.toString().replace('.', ',')} %</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: '#6C6057' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Prix de vente net</span>
              <span style={{ fontWeight: 600, color: C.textPrimary }}>{fmtEur(PROPERTY.price - COMMISSION_TTC)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Honoraires TTC ({COMMISSION_PCT}%)</span>
              <span style={{ fontWeight: 600, color: C.textPrimary }}>{fmtEur(COMMISSION_TTC)}</span>
            </div>
            <div style={{ height: 1, background: C.border, margin: '4px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>Prix de vente affiché</span>
              <span style={{ fontFamily: F.display, fontWeight: 500, fontSize: 15, color: C.textPrimary }}>{fmtEur(PROPERTY.price)}</span>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
            <Chip active>À charge vendeur</Chip>
            <Chip>À charge acquéreur</Chip>
            <Chip>Partagé</Chip>
          </div>
        </Card>

        {/* Vendeurs */}
        <Card>
          <SectionHeader
            num={6}
            title="Informations vendeurs"
            sub="2 vendeurs · indivision"
            right={
              <button style={{
                padding: '5px 11px', borderRadius: 7, border: `1px solid ${C.border}`,
                background: C.white, color: C.accent,
                fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5.5 2v7M2 5.5h7"/></svg>
                Ajouter
              </button>
            }
          />

          {[
            { initials: 'PD', name: 'Patrick Durand',  role: 'Vendeur principal', email: 'p.durand@email.fr',  phone: '06 12 34 56 78', share: '50%' },
            { initials: 'MD', name: 'Martine Durand',  role: 'Co-vendeur',         email: 'm.durand@email.fr',  phone: '06 87 65 43 21', share: '50%' },
          ].map((v, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(53,50,48,0.06)' : 'none',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFF0E8, #FFE4D4)',
                color: C.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>{v.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{v.name}</span>
                  <span style={{ fontSize: 10, color: C.accent, background: '#FFF4EE', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>{v.share}</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#AAA09A', marginTop: 1 }}>
                  {v.role} · {v.email} · {v.phone}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#AAA09A" strokeWidth="1.6" strokeLinecap="round"><path d="M5 3l4 4-4 4"/></svg>
            </div>
          ))}

          <div style={{
            marginTop: 12, padding: '10px 12px',
            background: '#FFF8F3', border: `1px dashed ${C.accent}`,
            borderRadius: 9, fontSize: 11.5, color: '#6C6057', lineHeight: 1.5,
          }}>
            <strong style={{ color: C.textPrimary }}>Régime matrimonial :</strong> communauté de biens · vérifié via titre de propriété
          </div>
        </Card>
      </div>

      {/* Row 3: Photos */}
      <Card style={{ marginBottom: 14 }}>
        <SectionHeader
          num={4}
          title="Photos du bien"
          sub="5 photos · 1ère définie comme cover"
          right={
            <button style={{
              padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`,
              background: C.white, color: C.textPrimary,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M6 2v8M2 6h8"/></svg>
              Ajouter photos
            </button>
          }
        />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10, height: 240 }}>
          {PHOTOS.map((p, i) => (
            <div key={i} style={{
              gridColumn: i === 0 ? 'span 1' : 'span 1',
              gridRow:    i === 0 ? 'span 2' : 'span 1',
              background: `linear-gradient(135deg, ${['#FFD9C0', '#D4F4E4', '#DCEEFF', '#E8DEFF', '#FFE0CC'][i]}, #fff)`,
              borderRadius: 12, position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${C.border}`,
              cursor: 'pointer',
            }}>
              <span style={{ fontSize: i === 0 ? 56 : 28 }}>{p.emoji}</span>
              <div style={{
                position: 'absolute', bottom: 8, left: 8,
                background: 'rgba(14,12,11,0.7)', backdropFilter: 'blur(8px)',
                color: '#fff', fontSize: 10.5, fontWeight: 600,
                padding: '3px 8px', borderRadius: 6,
              }}>{p.label}</div>
              {p.cover && (
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  background: C.accent, color: '#fff',
                  fontSize: 9.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 6,
                }}>Cover</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Row 4: Documents */}
      <Card>
        <SectionHeader
          num={5}
          title="Documents annexes"
          sub="3 reçus · 2 manquants"
          right={
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#FFF0F0', color: '#E05252',
              fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E05252' }}/>
              2 à fournir
            </span>
          }
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {DOCUMENTS.map((d, i) => {
            const signed = d.status === 'signed';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '11px 13px', borderRadius: 10,
                background: signed ? '#FAFAF9' : '#FFF8F3',
                border: `1px ${signed ? 'solid' : 'dashed'} ${signed ? C.border : 'rgba(255,135,83,0.35)'}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: signed ? '#EDFBF4' : '#FFF0E8',
                  color: signed ? '#28A566' : C.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M3 1.5h6l3 3v10H3z"/><path d="M9 1.5v3h3"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: '#AAA09A', marginTop: 1 }}>{d.size}</div>
                </div>
                {signed ? (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: '#28A566',
                    background: '#EDFBF4', padding: '3px 8px', borderRadius: 6,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>OK</span>
                ) : (
                  <button style={{
                    padding: '5px 10px', borderRadius: 7, border: 'none',
                    background: C.accent, color: '#fff',
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M5 1v6M2 5l3 3 3-3"/></svg>
                    Importer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};
