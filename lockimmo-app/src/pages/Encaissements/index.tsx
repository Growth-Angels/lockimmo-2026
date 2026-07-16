import React, { useState } from 'react';
import { C, F } from '../../tokens';

/* ─── CSS ───────────────────────────────────────────────────────────── */
const CSS = `
@keyframes enc-row-in {
  from { opacity:0; transform:translateX(10px); }
  to   { opacity:1; transform:translateX(0);    }
}
@keyframes enc-header-in {
  from { opacity:0; transform:translateY(-8px); }
  to   { opacity:1; transform:translateY(0);    }
}
@keyframes enc-live {
  0%,100% { opacity:1; } 50% { opacity:0.3; }
}
.enc-row:hover { background: rgba(255,135,83,0.04) !important; }
`;

/* ─── Fake data ─────────────────────────────────────────────────────── */
type Statut = 'rapproché' | 'encaissé' | 'en attente' | 'rejeté';
interface Entry {
  id:         string;
  date:       string;
  locataire:  string;
  bien:       string;
  motif:      string;
  montant:    number;
  statut:     Statut;
}

const ENTRIES: Entry[] = [
  { id:'ENC-2026-0389', date:'19/03/2026', locataire:'Martin Dupont',      bien:'Apt. 3B · Paris 75001',        motif:'Loyer mars 2026',                 montant:1250,  statut:'rapproché'  },
  { id:'ENC-2026-0387', date:'18/03/2026', locataire:'Sophie Laurent',     bien:'Studio · Lyon 69003',           motif:'Loyer mars 2026',                 montant:790,   statut:'rapproché'  },
  { id:'ENC-2026-0385', date:'17/03/2026', locataire:'Isabelle Durand',    bien:'T4 · Lyon 69006',               motif:'Loyer mars 2026',                 montant:1450,  statut:'encaissé'   },
  { id:'ENC-2026-0382', date:'16/03/2026', locataire:'Amélie Roux',        bien:'Maison · Bordeaux 33000',       motif:'Loyer mars 2026',                 montant:1800,  statut:'rapproché'  },
  { id:'ENC-2026-0380', date:'15/03/2026', locataire:'Thomas Martin',      bien:'Local comm. · Nantes 44000',    motif:'Loyer commercial mars 2026',      montant:2400,  statut:'encaissé'   },
  { id:'ENC-2026-0377', date:'14/03/2026', locataire:'Pierre Moreau',      bien:'T2 · Bordeaux 33800',           motif:'Loyer mars 2026',                 montant:920,   statut:'encaissé'   },
  { id:'ENC-2026-0375', date:'13/03/2026', locataire:'Jean Bernard',       bien:'Parking · Montpellier 34000',   motif:'Loyer parking mars 2026',         montant:220,   statut:'rapproché'  },
  { id:'ENC-2026-0371', date:'12/03/2026', locataire:'Claire Petit',       bien:'F3 · Nantes 44100',             motif:'Loyer mars 2026',                 montant:1100,  statut:'encaissé'   },
  { id:'ENC-2026-0368', date:'10/03/2026', locataire:'François Leclerc',   bien:'Studio · Paris 75018',          motif:'Loyer mars 2026',                 montant:680,   statut:'en attente' },
  { id:'ENC-2026-0362', date:'08/03/2026', locataire:'Nathalie Blanc',     bien:'Apt. 2B · Lyon 69007',          motif:'Loyer mars 2026',                 montant:870,   statut:'en attente' },
  { id:'ENC-2026-0355', date:'05/03/2026', locataire:'Paul Dubois',        bien:'T3 · Grenoble 38000',           motif:'Charges trimestrielles Q1 2026',  montant:348,   statut:'rapproché'  },
  { id:'ENC-2026-0348', date:'03/03/2026', locataire:'Marie Lambert',      bien:'Studio · Grenoble 38000',       motif:'Dépôt de garantie',               montant:1220,  statut:'rapproché'  },
  { id:'ENC-2026-0341', date:'01/03/2026', locataire:'Amélie Roux',        bien:'Maison · Bordeaux 33000',       motif:'Régularisation charges 2025',     montant:187,   statut:'encaissé'   },
  { id:'ENC-2026-0329', date:'28/02/2026', locataire:'Martin Dupont',      bien:'Apt. 3B · Paris 75001',        motif:'Loyer fév. 2026',                 montant:1250,  statut:'rapproché'  },
  { id:'ENC-2026-0317', date:'20/02/2026', locataire:'Isabelle Durand',    bien:'T4 · Lyon 69006',               motif:'Loyer fév. 2026',                 montant:1450,  statut:'rapproché'  },
  { id:'ENC-2026-0304', date:'15/02/2026', locataire:'Sophie Laurent',     bien:'Studio · Lyon 69003',           motif:'Loyer fév. 2026',                 montant:790,   statut:'rapproché'  },
  { id:'ENC-2026-0297', date:'12/02/2026', locataire:'Thomas Martin',      bien:'Local comm. · Nantes 44000',    motif:'Loyer commercial fév. 2026',      montant:2400,  statut:'rapproché'  },
  { id:'ENC-2026-0284', date:'05/02/2026', locataire:'Karim Benali',       bien:'T2 · Lyon 69008',               motif:'Loyer fév. 2026',                 montant:840,   statut:'rejeté'     },
];

/* ─── Statut helpers ────────────────────────────────────────────────── */
const STATUT_CFG: Record<Statut, { label:string; bg:string; color:string }> = {
  'rapproché':  { label:'Rapproché',  bg:'rgba(59,125,248,0.10)',  color:'#3B7DF8' },
  'encaissé':   { label:'Encaissé',   bg:'rgba(40,165,102,0.10)',  color:'#28A566' },
  'en attente': { label:'En attente', bg:'rgba(255,135,83,0.12)',  color:C.accent  },
  'rejeté':     { label:'Rejeté',     bg:'rgba(224,82,82,0.10)',   color:'#E05252' },
};

/* ─── Summary stats ─────────────────────────────────────────────────── */
const totalRaproche = ENTRIES.filter(e=>e.statut==='rapproché').reduce((s,e)=>s+e.montant,0);
const totalEncaisse = ENTRIES.filter(e=>e.statut==='encaissé').reduce((s,e)=>s+e.montant,0);
const totalAttente  = ENTRIES.filter(e=>e.statut==='en attente').reduce((s,e)=>s+e.montant,0);
const totalRejete   = ENTRIES.filter(e=>e.statut==='rejeté').reduce((s,e)=>s+e.montant,0);

/* ─── Format helpers ────────────────────────────────────────────────── */
const fmt = (n:number) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 })+' €';

type FilterStatut = 'tous' | Statut;

/* ═══════════════════════════════════════════════════════════════════ */
export const Encaissements: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatut>('tous');
  const [search, setSearch] = useState('');

  const visible = ENTRIES.filter(e => {
    const matchStatut = filter === 'tous' || e.statut === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || e.locataire.toLowerCase().includes(q)
      || e.bien.toLowerCase().includes(q)
      || e.motif.toLowerCase().includes(q)
      || e.id.toLowerCase().includes(q);
    return matchStatut && matchSearch;
  });

  return (
    <div>
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div style={{marginBottom:20,display:'flex',alignItems:'flex-start',justifyContent:'space-between',animation:'enc-header-in 0.4s ease both'}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,color:C.textPrimary,margin:0}}>Encaissements</h1>
          <p style={{fontSize:13,color:C.textSecondary,marginTop:4,margin:0}}>
            Journal des encaissements · Fév–Mars 2026
          </p>
        </div>
        <button style={{display:'flex',alignItems:'center',gap:7,padding:'9px 18px',borderRadius:20,border:'none',background:C.accent,color:'white',fontSize:13,fontWeight:600,cursor:'pointer',boxShadow:'0 4px 14px rgba(255,135,83,0.3)'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exporter OFX
        </button>
      </div>

      {/* ── Bank card + KPIs ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:14,marginBottom:18}}>

        {/* Bank card */}
        <div style={{
          background:'linear-gradient(135deg,#1C2E4A,#2B4172)',
          borderRadius:14, padding:'18px 20px',
          gridColumn:'span 1',
          position:'relative', overflow:'hidden',
        }}>
          {/* Subtle circle deco */}
          <div style={{position:'absolute',top:-30,right:-30,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>
          <div style={{position:'absolute',bottom:-20,right:10,width:60,height:60,borderRadius:'50%',background:'rgba(255,255,255,0.04)'}}/>

          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
            <div style={{width:28,height:28,borderRadius:7,background:'rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </div>
            <span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.75)',letterSpacing:'0.04em',lineHeight:1.3}}>
              Banque Populaire<br/>Auvergne-Rhône-Alpes
            </span>
          </div>

          <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.45)',letterSpacing:'0.12em',marginBottom:10}}>
            FR76 1310 6008 •••• •••• ••• 47
          </div>

          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:9,color:'rgba(255,255,255,0.45)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>Solde disponible</div>
              <div style={{fontFamily:F.display,fontSize:22,fontWeight:700,color:'white',letterSpacing:'-0.3px'}}>
                {(84320).toLocaleString('fr-FR')} €
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:4}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'#28A566',animation:'enc-live 1.8s ease-in-out infinite'}}/>
              <span style={{fontSize:9,color:'rgba(255,255,255,0.4)'}}>Sync. 19/03 · 14:32</span>
            </div>
          </div>
        </div>

        {/* KPI — Rapproché */}
        <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:'18px 20px'}}>
          <div style={{fontSize:10,fontWeight:700,color:C.textSecondary,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:8}}>Rapproché</div>
          <div style={{fontFamily:F.display,fontSize:22,fontWeight:700,color:'#3B7DF8',letterSpacing:'-0.3px',lineHeight:1.1}}>
            {(totalRaproche).toLocaleString('fr-FR')} €
          </div>
          <div style={{marginTop:8,fontSize:11,color:C.textSecondary}}>
            {ENTRIES.filter(e=>e.statut==='rapproché').length} écritures
          </div>
        </div>

        {/* KPI — Encaissé */}
        <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:'18px 20px'}}>
          <div style={{fontSize:10,fontWeight:700,color:C.textSecondary,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:8}}>Encaissé</div>
          <div style={{fontFamily:F.display,fontSize:22,fontWeight:700,color:'#28A566',letterSpacing:'-0.3px',lineHeight:1.1}}>
            {(totalEncaisse).toLocaleString('fr-FR')} €
          </div>
          <div style={{marginTop:8,fontSize:11,color:C.textSecondary}}>
            {ENTRIES.filter(e=>e.statut==='encaissé').length} écritures
          </div>
        </div>

        {/* KPI — En attente / Rejeté */}
        <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:'18px 20px'}}>
          <div style={{fontSize:10,fontWeight:700,color:C.textSecondary,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:8}}>En attente · Rejeté</div>
          <div style={{fontFamily:F.display,fontSize:22,fontWeight:700,color:C.accent,letterSpacing:'-0.3px',lineHeight:1.1}}>
            {(totalAttente+totalRejete).toLocaleString('fr-FR')} €
          </div>
          <div style={{marginTop:8,fontSize:11,color:'#E05252'}}>
            {ENTRIES.filter(e=>e.statut==='en attente'||e.statut==='rejeté').length} à traiter
          </div>
        </div>
      </div>

      {/* ── Table card ── */}
      <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,overflow:'hidden'}}>

        {/* Toolbar */}
        <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          {/* Search */}
          <div style={{display:'flex',alignItems:'center',gap:8,background:C.bgLight,borderRadius:10,padding:'8px 12px',flex:'0 0 240px'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Locataire, bien, référence…"
              style={{border:'none',background:'none',fontSize:12,color:C.textPrimary,outline:'none',width:'100%'}}
            />
          </div>

          {/* Status filters */}
          <div style={{display:'flex',gap:6}}>
            {(['tous','rapproché','encaissé','en attente','rejeté'] as FilterStatut[]).map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                padding:'6px 12px',borderRadius:20,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,
                background: filter===f ? (f==='tous'?C.textPrimary:STATUT_CFG[f as Statut]?.color||C.textPrimary) : C.bgLight,
                color: filter===f ? 'white' : C.textSecondary,
                transition:'all 0.15s',
              }}>
                {f==='tous'?'Tous':STATUT_CFG[f as Statut]?.label}
              </button>
            ))}
          </div>

          <div style={{marginLeft:'auto',fontSize:11,color:C.textSecondary,fontWeight:500}}>
            {visible.length} écriture{visible.length>1?'s':''}
          </div>
        </div>

        {/* Table header */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'120px 140px 1fr 180px 130px 110px',
          padding:'10px 20px',
          background:'#FAFAF9',
          borderBottom:`1px solid ${C.border}`,
        }}>
          {['Date','Référence','Locataire · Bien','Motif','Montant','Statut'].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:700,color:C.textSecondary,letterSpacing:'0.06em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:4}}>
              {h}
              {h==='Montant'&&<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div>
          {visible.length === 0 && (
            <div style={{padding:'40px 20px',textAlign:'center',color:C.textSecondary,fontSize:13}}>
              Aucune écriture trouvée
            </div>
          )}
          {visible.map((e,i)=>{
            const s = STATUT_CFG[e.statut];
            const isRejete = e.statut === 'rejeté';
            return (
              <div key={e.id} className="enc-row" style={{
                display:'grid',
                gridTemplateColumns:'120px 140px 1fr 180px 130px 110px',
                padding:'13px 20px',
                borderBottom: i < visible.length-1 ? `1px solid ${C.border}` : 'none',
                alignItems:'center',
                cursor:'default',
                animation:`enc-row-in 0.3s ease ${Math.min(i*0.04,0.4)}s both`,
                transition:'background 0.12s',
              }}>
                {/* Date */}
                <div style={{fontSize:12,color:C.textSecondary,fontVariantNumeric:'tabular-nums'}}>
                  {e.date}
                </div>

                {/* Référence */}
                <div style={{fontSize:10.5,fontFamily:'monospace',color:C.textSecondary,letterSpacing:'0.04em'}}>
                  {e.id}
                </div>

                {/* Locataire + Bien */}
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:isRejete?C.textSecondary:C.textPrimary,marginBottom:2}}>
                    {e.locataire}
                  </div>
                  <div style={{fontSize:11,color:C.textSecondary,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:260}}>
                    {e.bien}
                  </div>
                </div>

                {/* Motif */}
                <div style={{fontSize:11.5,color:C.textSecondary,paddingRight:8,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {e.motif}
                </div>

                {/* Montant */}
                <div style={{
                  fontSize:13,fontWeight:700,
                  fontVariantNumeric:'tabular-nums',
                  color:isRejete?C.textSecondary:C.textPrimary,
                  textDecoration:isRejete?'line-through':'none',
                  letterSpacing:'-0.2px',
                }}>
                  +{fmt(e.montant)}
                </div>

                {/* Statut badge */}
                <div style={{
                  display:'inline-flex',alignItems:'center',gap:5,
                  background:s.bg, color:s.color,
                  padding:'4px 10px',borderRadius:20,
                  fontSize:10.5,fontWeight:700,width:'fit-content',
                }}>
                  <div style={{width:5,height:5,borderRadius:'50%',background:s.color,flexShrink:0}}/>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total row */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'120px 140px 1fr 180px 130px 110px',
          padding:'13px 20px',
          background:'#FAFAF9',
          borderTop:`2px solid ${C.border}`,
          alignItems:'center',
        }}>
          <div style={{fontSize:11,fontWeight:700,color:C.textSecondary,gridColumn:'span 4',letterSpacing:'0.04em',textTransform:'uppercase'}}>
            Total · {visible.length} écriture{visible.length>1?'s':''}
          </div>
          <div style={{fontFamily:F.display,fontSize:15,fontWeight:700,color:C.textPrimary,letterSpacing:'-0.3px'}}>
            +{fmt(visible.reduce((s,e)=>s+e.montant,0))}
          </div>
          <div/>
        </div>
      </div>

      {/* Footer note */}
      <div style={{marginTop:12,display:'flex',alignItems:'center',gap:6,paddingLeft:4}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textSecondary} strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style={{fontSize:11,color:C.textSecondary}}>
          Données importées via EBICS · Banque Populaire Auvergne-Rhône-Alpes · Dernière synchronisation le 19/03/2026 à 14:32
        </span>
      </div>
    </div>
  );
};
