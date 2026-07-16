import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { C, F } from '../../tokens';

/* ─── Data ─────────────────────────────────────────────────────────── */
const MONTHS  = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const REVENUES = [18400,19200,21800,20100,22600,23400,21900,22800,24200,23800,25100,26400];
const LOYERS   = [17800,18600,21000,19400,21800,22600,21100,22000,23400,22900,24200,25500];

const KPI_TARGETS = [
  { label:'Revenus annuels',      value:269700, fmt:(v:number)=>`${(v/1000).toFixed(0)}k €`, color:C.accent,  trend:'+8.4 %',  up:true  },
  { label:"Taux d'encaissement",  value:96.8,   fmt:(v:number)=>`${v.toFixed(1)} %`,          color:'#28A566', trend:'+0.3 pt', up:true  },
  { label:'Loyers impayés',       value:1250,   fmt:(v:number)=>`${Math.round(v)} €`,         color:'#E05252', trend:'+2.1 %',  up:false },
  { label:'Rendement moyen',      value:6.4,    fmt:(v:number)=>`${v.toFixed(1)} %`,          color:'#3B7DF8', trend:'+0.2 pt', up:true  },
];

/* Quarterly */
const QUARTERS = ['T1','T2','T3','T4'];
const Q_LOYERS = [59400, 66100, 68900, 75300];
const Q_NET    = [52900, 58900, 62000, 67900];
const Q_MAX    = 82000;

/* Donut — charges breakdown */
const DONUT_R      = 42;
const DONUT_CIRCUM = 2 * Math.PI * DONUT_R; // ≈ 263.9
const DONUT_SEGS = [
  { pct:22, cumPct:0,  color:C.accent,  label:'Frais gestion',  value:'1 804 €' },
  { pct:18, cumPct:22, color:'#3B7DF8', label:'Assurance',       value:'1 476 €' },
  { pct:32, cumPct:40, color:'#8B5CF6', label:'Entretien',       value:'2 624 €' },
  { pct:28, cumPct:72, color:'#28A566', label:'Charges copro',   value:'2 296 €' },
];

/* Top biens */
const TOP_BIENS = [
  { label:'Apt. 3B · Paris',       yield:7.2, rev:1250 },
  { label:'Studio · Lyon',          yield:6.8, rev:790  },
  { label:'Maison · Bordeaux',      yield:6.1, rev:1100 },
  { label:'Local comm. · Nantes',   yield:5.8, rev:1800 },
  { label:'Parking · Montpellier',  yield:5.2, rev:220  },
];
const YIELD_MAX = 8;

/* Cashflow sparkline */
const CF_MONTHS = ['Jul','Aoû','Sep','Oct','Nov','Déc'];
const CF_VALUES = [21200, 22100, 20800, 23400, 24200, 25100];
const CF_TARGET = 22500;

const Y_TICKS = [16000, 19000, 22000, 25000, 28000];

/* ─── SVG line chart geometry ───────────────────────────────────────── */
const CW = 660, CH = 220;
const PL = 52, PR = 16, PT = 32, PB = 36;
const MIN_V = 14000, MAX_V = 30000;
const CHART_W = CW - PL - PR, CHART_H = CH - PT - PB;

const toX = (i:number) => PL + (i/(MONTHS.length-1))*CHART_W;
const toY = (v:number) => PT + (1-(v-MIN_V)/(MAX_V-MIN_V))*CHART_H;

const revPts:[number,number][] = REVENUES.map((v,i)=>[toX(i),toY(v)]);
const loyPts:[number,number][] = LOYERS.map((v,i)=>[toX(i),toY(v)]);

function smoothPath(pts:[number,number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i=1;i<pts.length;i++){
    const p0=pts[Math.max(0,i-2)],p1=pts[i-1],p2=pts[i],p3=pts[Math.min(pts.length-1,i+1)];
    const cp1x=p1[0]+(p2[0]-p0[0])/6, cp1y=p1[1]+(p2[1]-p0[1])/6;
    const cp2x=p2[0]-(p3[0]-p1[0])/6, cp2y=p2[1]-(p3[1]-p1[1])/6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)},${cp2x.toFixed(1)} ${cp2y.toFixed(1)},${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
function areaPath(pts:[number,number][], bottomY:number): string {
  return `${smoothPath(pts)} L ${pts[pts.length-1][0].toFixed(1)} ${bottomY} L ${pts[0][0].toFixed(1)} ${bottomY} Z`;
}

const REV_PATH = smoothPath(revPts);
const REV_AREA = areaPath(revPts, CH-PB);
const LOY_PATH = smoothPath(loyPts);

/* ─── CSS ───────────────────────────────────────────────────────────── */
const CSS = `
@keyframes fin-live { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.75)} }
@keyframes fin-kpi-in { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes fin-tooltip-in { from{opacity:0;transform:translateY(6px) scale(0.94)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes fin-summary-in { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:translateX(0)} }
@keyframes fin-panel-in   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
`;

/* ─── Easing ────────────────────────────────────────────────────────── */
const easeOutCubic   = (t:number) => 1-Math.pow(1-t,3);
const easeInOutCubic = (t:number) => t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

/* ─── Month tooltip data ────────────────────────────────────────────── */
const monthTooltipData = (i:number) => ({
  title: `${MONTHS[i]} 2025`,
  revenue: REVENUES[i].toLocaleString('fr-FR')+' €',
  loyer:   LOYERS[i].toLocaleString('fr-FR')+' €',
  varJan:  (((REVENUES[i]-REVENUES[0])/REVENUES[0])*100).toFixed(1)+' %',
  varPrev: i>0 ? (((REVENUES[i]-REVENUES[i-1])/REVENUES[i-1])*100).toFixed(1)+' %' : '—',
});

/* ═══════════════════════════════════════════════════════════════════ */
export const Finances: React.FC = () => {
  const [lineProgress, setLineProgress] = useState(0);
  const [kpiValues, setKpiValues]       = useState([0,0,0,0]);
  const [showTooltip, setShowTooltip]   = useState(false);
  const [showBars, setShowBars]         = useState(false);
  const [showPanels, setShowPanels]     = useState(false);
  const [started, setStarted]           = useState(false);
  const [cursorPt, setCursorPt]         = useState<{x:number;y:number}|null>(null);
  const [hoveredDot, setHoveredDot]     = useState<number|null>(null);

  const lineRef = useRef<SVGPathElement>(null);
  const lineLen = useRef(2200);

  useLayoutEffect(() => {
    if (lineRef.current) lineLen.current = lineRef.current.getTotalLength();
  }, []);

  const replay = useCallback(() => {
    setStarted(false); setLineProgress(0); setKpiValues([0,0,0,0]);
    setShowTooltip(false); setShowBars(false); setShowPanels(false);
    setCursorPt(null); setHoveredDot(null);
    setTimeout(()=>setStarted(true), 80);
  }, []);

  useEffect(()=>{ replay(); }, []); // eslint-disable-line

  useEffect(()=>{
    if (!started) return;
    const origin = Date.now();

    /* KPI count-up */
    let kpiRaf:number;
    const kpiTick = () => {
      const t = Math.min((Date.now()-origin)/1800,1);
      setKpiValues(KPI_TARGETS.map(k=>k.value*easeOutCubic(t)));
      if (t<1) kpiRaf=requestAnimationFrame(kpiTick);
    };
    kpiRaf=requestAnimationFrame(kpiTick);

    /* Line draw (+200 ms, 2.6 s) */
    const LD=200, LDur=2600;
    let lineRaf:number;
    const lineTick = () => {
      const el=Date.now()-origin-LD;
      if (el<0){lineRaf=requestAnimationFrame(lineTick);return;}
      const t=Math.min(el/LDur,1), e=easeInOutCubic(t);
      setLineProgress(e);
      if (lineRef.current && e>0 && e<1){
        const pt=lineRef.current.getPointAtLength(lineLen.current*e);
        setCursorPt({x:pt.x,y:pt.y});
      } else if (e>=1) setCursorPt(null);
      if (t<1) lineRaf=requestAnimationFrame(lineTick);
    };
    lineRaf=requestAnimationFrame(lineTick);

    const t1=setTimeout(()=>setShowTooltip(true), LD+LDur*0.74);
    const t2=setTimeout(()=>setShowBars(true),    LD+LDur+350);
    const t3=setTimeout(()=>setShowPanels(true),  LD+LDur+700);

    return ()=>{
      cancelAnimationFrame(kpiRaf); cancelAnimationFrame(lineRaf);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, [started]);

  /* Fixed tooltip anchor — Sep (index 8) */
  const tipPt = revPts[8];
  const tipL  = (tipPt[0]/CW)*100;
  const tipT  = (tipPt[1]/CH)*100;

  /* Hover tooltip */
  const hd = hoveredDot;
  const hdPt = hd !== null ? revPts[hd] : null;

  return (
    <div>
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div style={{marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
            <h1 style={{fontSize:22,fontWeight:700,color:C.textPrimary,margin:0}}>Tableaux de bord financiers</h1>
            <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(224,82,82,0.08)',borderRadius:20,padding:'3px 10px'}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#E05252',animation:'fin-live 1.5s ease-in-out infinite'}}/>
              <span style={{fontSize:10,fontWeight:700,color:'#E05252',letterSpacing:'0.08em'}}>EN DIRECT</span>
            </div>
          </div>
          <p style={{fontSize:13,color:C.textSecondary,margin:0}}>Exercice 2025–2026 · LOCKimmo Comptabilité</p>
        </div>
        <button onClick={replay} style={{display:'flex',alignItems:'center',gap:7,padding:'9px 18px',borderRadius:20,border:`1.5px solid ${C.border}`,background:C.white,color:C.textPrimary,fontSize:13,fontWeight:600,cursor:'pointer'}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          Rejouer
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:18}}>
        {KPI_TARGETS.map((k,i)=>(
          <div key={i} style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:'18px 20px',animation:`fin-kpi-in 0.5s ease ${i*0.09}s both`}}>
            <div style={{fontSize:10,fontWeight:700,color:C.textSecondary,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:9}}>{k.label}</div>
            <div style={{fontFamily:F.display,fontSize:26,fontWeight:700,color:k.color,letterSpacing:'-0.5px',lineHeight:1.1}}>{k.fmt(kpiValues[i])}</div>
            <div style={{marginTop:9,display:'flex',alignItems:'center',gap:5}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={k.up?'#28A566':'#E05252'} strokeWidth="2.5" strokeLinecap="round">
                {k.up?<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>
                     :<><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>}
              </svg>
              <span style={{fontSize:11,color:k.up?'#28A566':'#E05252',fontWeight:600}}>{k.trend} vs M-1</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Line chart + Bar chart ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 290px',gap:16,marginBottom:16}}>

        {/* Dark line chart */}
        <div style={{background:'linear-gradient(150deg,#1A1815 0%,#2B2826 100%)',borderRadius:16,padding:'20px 20px 14px',boxShadow:'0 8px 40px rgba(0,0,0,0.22)',display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.7)',letterSpacing:'0.05em',textTransform:'uppercase'}}>Revenus mensuels 2025</span>
            <div style={{display:'flex',gap:16}}>
              {[{color:C.accent,label:'Revenus bruts',dash:false},{color:'rgba(255,255,255,0.28)',label:'Loyers nets',dash:true}].map(({color,label,dash})=>(
                <div key={label} style={{display:'flex',alignItems:'center',gap:5}}>
                  <svg width="18" height="6" viewBox="0 0 18 6">
                    {dash?<line x1="0" y1="3" x2="18" y2="3" stroke={color} strokeWidth="1.5" strokeDasharray="3 3"/>
                         :<line x1="0" y1="3" x2="18" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round"/>}
                  </svg>
                  <span style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SVG wrapper */}
          <div style={{position:'relative',flex:1}}>
            <svg viewBox={`0 0 ${CW} ${CH}`} style={{width:'100%',display:'block',overflow:'visible'}}>
              <defs>
                <linearGradient id="fin-area-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity="0.28"/>
                  <stop offset="75%" stopColor={C.accent} stopOpacity="0.05"/>
                  <stop offset="100%" stopColor={C.accent} stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="fin-line-g" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFBA99"/>
                  <stop offset="100%" stopColor={C.accent}/>
                </linearGradient>
                <clipPath id="fin-clip">
                  <rect x="0" y="0" width={CW*lineProgress} height={CH}/>
                </clipPath>
                <filter id="fin-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Ghost path */}
              <path d={REV_PATH} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="2 8"/>

              {/* Y grid */}
              {Y_TICKS.map(v=>(
                <g key={v}>
                  <line x1={PL} y1={toY(v)} x2={CW-PR} y2={toY(v)} stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4 8"/>
                  <text x={PL-6} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="rgba(255,255,255,0.26)" fontFamily="Inter,sans-serif">{`${v/1000}k`}</text>
                </g>
              ))}

              {/* X labels */}
              {MONTHS.map((m,i)=>(
                <text key={m} x={toX(i)} y={CH-PB+18} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.26)" fontFamily="Inter,sans-serif">{m}</text>
              ))}

              <path d={REV_AREA} fill="url(#fin-area-g)" clipPath="url(#fin-clip)"/>
              <path d={LOY_PATH} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 5" clipPath="url(#fin-clip)"/>

              {/* Main line */}
              <path ref={lineRef} d={REV_PATH} fill="none" stroke="url(#fin-line-g)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={lineLen.current} strokeDashoffset={lineLen.current*(1-lineProgress)} filter="url(#fin-glow)"/>

              {/* Data dots — interactive */}
              {revPts.map((pt,i)=>{
                const visible = lineProgress >= i/(revPts.length-1)-0.01;
                const isPeak  = REVENUES[i]===Math.max(...REVENUES);
                const isHov   = hoveredDot===i;
                return (
                  <circle key={i} cx={pt[0]} cy={pt[1]}
                    r={visible?(isHov?7:isPeak?5.5:3.5):0}
                    fill={isPeak&&!isHov?C.accent:'#1A1815'}
                    stroke={isHov?'white':C.accent}
                    strokeWidth={isHov?2.5:isPeak?0:1.8}
                    style={{transition:'r 0.22s cubic-bezier(0.34,1.4,0.64,1)',cursor:'pointer'}}
                    onMouseEnter={()=>setHoveredDot(i)}
                    onMouseLeave={()=>setHoveredDot(null)}
                  />
                );
              })}

              {/* Moving cursor */}
              {cursorPt&&(
                <g>
                  <circle cx={cursorPt.x} cy={cursorPt.y} r="11" fill={C.accent} opacity="0.12"/>
                  <circle cx={cursorPt.x} cy={cursorPt.y} r="5" fill={C.accent}/>
                  <circle cx={cursorPt.x} cy={cursorPt.y} r="2.2" fill="white"/>
                  {lineProgress<0.93&&(()=>{
                    const idx=Math.min(Math.round(lineProgress*(REVENUES.length-1)),REVENUES.length-1);
                    const flip=cursorPt.x>CW*0.72;
                    const bx=flip?cursorPt.x-56:cursorPt.x+10;
                    return(<g>
                      <rect x={bx} y={cursorPt.y-11} width="46" height="19" rx="5" fill={C.accent}/>
                      <text x={bx+23} y={cursorPt.y+1} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">
                        {`${(REVENUES[idx]/1000).toFixed(0)}k €`}
                      </text>
                    </g>);
                  })()}
                </g>
              )}

              {/* Fixed tooltip guide line */}
              {showTooltip&&<line x1={tipPt[0]} y1={tipPt[1]+7} x2={tipPt[0]} y2={CH-PB} stroke={C.accent} strokeWidth="1" strokeDasharray="3 5" opacity="0.45"/>}
            </svg>

            {/* Fixed tooltip Sep */}
            {showTooltip&&(
              <div style={{position:'absolute',left:`${tipL}%`,top:`${tipT}%`,transform:'translate(-108%,-110%)',pointerEvents:'none',zIndex:10,animation:'fin-tooltip-in 0.45s cubic-bezier(0.34,1.4,0.64,1) both'}}>
                <div style={{background:'white',borderRadius:12,padding:'12px 14px',boxShadow:'0 12px 36px rgba(0,0,0,0.22),0 0 0 1px rgba(0,0,0,0.05)',width:180}}>
                  <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:9}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:'#28A566',flexShrink:0}}/>
                    <span style={{fontSize:8.5,fontWeight:700,color:'#28A566',letterSpacing:'0.08em',textTransform:'uppercase'}}>Analyse comptable</span>
                  </div>
                  <div style={{fontSize:12,fontWeight:700,color:C.textPrimary,marginBottom:8}}>Septembre · Pic T3</div>
                  {[{l:'Revenus',v:'24 200 €',a:false},{l:'Variation vs Jan',v:'+31.5 %',a:true},{l:'Taux encaissement',v:'97.2 %',a:false},{l:'Rendement net',v:'6.4 % ✓',a:true}].map(row=>(
                    <div key={row.l} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:10,color:C.textSecondary}}>{row.l}</span>
                      <span style={{fontSize:10,fontWeight:700,color:row.a?'#28A566':C.textPrimary}}>{row.v}</span>
                    </div>
                  ))}
                  <div style={{marginTop:9,paddingTop:8,borderTop:`1px solid ${C.border}`,fontSize:9.5,color:C.textSecondary,lineHeight:1.55}}>Trajectoire haussière confirmée sur l'ensemble de l'exercice.</div>
                </div>
              </div>
            )}

            {/* Hover tooltip on dot */}
            {hd!==null&&hdPt&&lineProgress>=hd/(revPts.length-1)-0.01&&(()=>{
              const d = monthTooltipData(hd);
              const lp = (hdPt[0]/CW)*100;
              const tp = (hdPt[1]/CH)*100;
              const flip = hd>=7;
              return (
                <div style={{position:'absolute',left:`${lp}%`,top:`${tp}%`,transform:flip?'translate(-106%,-106%)':'translate(10px,-106%)',pointerEvents:'none',zIndex:20,animation:'fin-tooltip-in 0.18s ease both'}}>
                  <div style={{background:'white',borderRadius:10,padding:'10px 13px',boxShadow:'0 8px 28px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.05)',width:162,minWidth:162}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.textPrimary,marginBottom:6}}>{d.title}</div>
                    {[{l:'Revenus',v:d.revenue},{l:'Loyers nets',v:d.loyer},{l:'Var. vs Jan',v:d.varJan},{l:'Var. M-1',v:d.varPrev}].map(r=>(
                      <div key={r.l} style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:9.5,color:C.textSecondary}}>{r.l}</span>
                        <span style={{fontSize:9.5,fontWeight:700,color:C.textPrimary}}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── Analyse trimestrielle ── */}
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:'20px 20px 16px',display:'flex',flexDirection:'column'}}>
          <div style={{fontSize:11,fontWeight:700,color:C.textSecondary,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:16}}>
            Analyse trimestrielle
          </div>

          {/* Value labels row — SEPARATE from bars to avoid overflow */}
          <div style={{display:'flex',justifyContent:'space-around',marginBottom:4}}>
            {QUARTERS.map((_q,i)=>(
              <div key={i} style={{flex:1,textAlign:'center',fontSize:9.5,fontWeight:700,color:C.textSecondary,height:14}}>
                {showBars?`${(Q_NET[i]/1000).toFixed(0)}k`:''}
              </div>
            ))}
          </div>

          {/* Bars */}
          <div style={{display:'flex',alignItems:'flex-end',gap:8,height:122,justifyContent:'space-around'}}>
            {QUARTERS.map((q,i)=>{
              const loyH=showBars?Math.round((Q_LOYERS[i]/Q_MAX)*112):0;
              const netH=showBars?Math.round((Q_NET[i]/Q_MAX)*112):0;
              return (
                <div key={q} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,flex:1}}>
                  <div style={{display:'flex',alignItems:'flex-end',gap:4,height:112}}>
                    <div style={{width:16,background:'rgba(255,135,83,0.18)',borderRadius:'3px 3px 0 0',height:loyH,transition:`height 0.9s cubic-bezier(0.34,1.1,0.64,1) ${i*0.12}s`}}/>
                    <div style={{width:16,background:C.accent,borderRadius:'3px 3px 0 0',height:netH,transition:`height 0.9s cubic-bezier(0.34,1.1,0.64,1) ${i*0.12+0.07}s`}}/>
                  </div>
                  <div style={{fontSize:9.5,color:C.textSecondary,fontWeight:600}}>{q}</div>
                </div>
              );
            })}
          </div>

          <div style={{display:'flex',gap:14,paddingTop:10,borderTop:`1px solid ${C.border}`,marginTop:8}}>
            {[{c:'rgba(255,135,83,0.28)',l:'Loyers bruts'},{c:C.accent,l:'Net gestionnaire'}].map(({c,l})=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                <span style={{fontSize:10,color:C.textSecondary}}>{l}</span>
              </div>
            ))}
          </div>

          {showBars&&(
            <div style={{marginTop:14,padding:'11px 13px',background:'rgba(40,165,102,0.06)',border:'1px solid rgba(40,165,102,0.15)',borderRadius:10,animation:'fin-summary-in 0.4s ease both'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#28A566',marginBottom:4}}>Tendance annuelle ↗</div>
              <div style={{fontSize:11,color:C.textSecondary,lineHeight:1.55}}>
                Progression nette de <strong style={{color:C.textPrimary}}>+28.4 %</strong> entre T1 et T4. Rendement en hausse continue.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ 3 bottom panels ══════════════════════════════════════════ */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>

        {/* Panel 1 — Répartition des charges (donut) */}
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:'20px',animation:showPanels?'fin-panel-in 0.5s ease 0s both':'none',opacity:showPanels?1:0}}>
          <div style={{fontSize:11,fontWeight:700,color:C.textSecondary,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:16}}>Répartition des charges</div>

          <div style={{display:'flex',alignItems:'center',gap:16}}>
            {/* Donut SVG */}
            <div style={{position:'relative',flexShrink:0}}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={DONUT_R} fill="none" stroke={C.bgLight} strokeWidth="13"/>
                <g transform="rotate(-90 55 55)">
                  {DONUT_SEGS.map((seg,i)=>{
                    const len=(seg.pct/100)*DONUT_CIRCUM;
                    const off=(seg.cumPct/100)*DONUT_CIRCUM;
                    return (
                      <circle key={i} cx="55" cy="55" r={DONUT_R}
                        fill="none" stroke={seg.color} strokeWidth="13"
                        strokeDasharray={`${showPanels?len:0} ${DONUT_CIRCUM}`}
                        strokeDashoffset={-off}
                        style={{transition:`stroke-dasharray 0.7s ease ${i*0.15+0.1}s`}}
                      />
                    );
                  })}
                </g>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontFamily:F.display,fontSize:15,fontWeight:700,color:C.textPrimary,lineHeight:1.1}}>8 200</div>
                <div style={{fontSize:9,color:C.textSecondary}}>€/mois</div>
              </div>
            </div>

            {/* Legend */}
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
              {DONUT_SEGS.map(seg=>(
                <div key={seg.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <div style={{width:8,height:8,borderRadius:2,background:seg.color,flexShrink:0}}/>
                    <span style={{fontSize:10.5,color:C.textSecondary}}>{seg.label}</span>
                  </div>
                  <span style={{fontSize:10.5,fontWeight:700,color:C.textPrimary}}>{seg.pct} %</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2 — Top biens · Rendement */}
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:'20px',animation:showPanels?'fin-panel-in 0.5s ease 0.1s both':'none',opacity:showPanels?1:0}}>
          <div style={{fontSize:11,fontWeight:700,color:C.textSecondary,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:16}}>Top biens · Rendement</div>

          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            {TOP_BIENS.map((b,i)=>{
              const pct=(b.yield/YIELD_MAX)*100;
              return (
                <div key={i}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:11,color:C.textPrimary,fontWeight:500,maxWidth:'70%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.label}</span>
                    <span style={{fontSize:11,fontWeight:700,color:C.accent}}>{b.yield.toFixed(1)} %</span>
                  </div>
                  <div style={{height:5,borderRadius:3,background:C.bgLight,overflow:'hidden'}}>
                    <div style={{
                      height:'100%',borderRadius:3,
                      background:`linear-gradient(90deg,${C.accent},#FFB899)`,
                      width:showPanels?`${pct}%`:'0%',
                      transition:`width 0.8s cubic-bezier(0.34,1.1,0.64,1) ${i*0.1+0.15}s`,
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 3 — Flux de trésorerie (sparkline) */}
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:'20px',animation:showPanels?'fin-panel-in 0.5s ease 0.2s both':'none',opacity:showPanels?1:0}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:C.textSecondary,letterSpacing:'0.05em',textTransform:'uppercase'}}>Flux de trésorerie</div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:F.display,fontSize:18,fontWeight:700,color:'#28A566',lineHeight:1}}>+25 100 €</div>
              <div style={{fontSize:9.5,color:C.textSecondary,marginTop:2}}>Déc 2025</div>
            </div>
          </div>

          {/* Mini sparkline */}
          {(()=>{
            const SW=230, SH=80;
            const minCF=Math.min(...CF_VALUES)-1000, maxCF=Math.max(...CF_VALUES)+500;
            const cfToX=(i:number)=>10+(i/(CF_MONTHS.length-1))*(SW-20);
            const cfToY=(v:number)=>SH-8-(((v-minCF)/(maxCF-minCF))*(SH-20));
            const cfPts:[number,number][] = CF_VALUES.map((v,i)=>[cfToX(i),cfToY(v)]);
            const cfPath = smoothPath(cfPts);
            const cfArea = `${cfPath} L ${cfPts[cfPts.length-1][0]} ${SH-8} L ${cfPts[0][0]} ${SH-8} Z`;
            const targetY = cfToY(CF_TARGET);
            return (
              <svg viewBox={`0 0 ${SW} ${SH}`} style={{width:'100%',overflow:'visible'}}>
                <defs>
                  <linearGradient id="cf-area-g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#28A566" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#28A566" stopOpacity="0"/>
                  </linearGradient>
                  <clipPath id="cf-clip">
                    <rect x="0" y="0" width={showPanels?SW:0} height={SH} style={{transition:'width 1.4s ease 0.3s'}}/>
                  </clipPath>
                </defs>
                {/* Target line */}
                <line x1="10" y1={targetY} x2={SW-10} y2={targetY} stroke="#E05252" strokeWidth="1" strokeDasharray="4 6" opacity="0.5"/>
                <text x={SW-10} y={targetY-4} textAnchor="end" fontSize="8" fill="#E05252" opacity="0.7" fontFamily="Inter,sans-serif">Objectif</text>
                {/* Area + line */}
                <path d={cfArea} fill="url(#cf-area-g)" clipPath="url(#cf-clip)"/>
                <path d={cfPath} fill="none" stroke="#28A566" strokeWidth="2" strokeLinecap="round" clipPath="url(#cf-clip)"/>
                {/* Dots */}
                {cfPts.map((pt,i)=>(
                  <circle key={i} cx={pt[0]} cy={pt[1]}
                    r={showPanels?3:0}
                    fill={CF_VALUES[i]>=CF_TARGET?'#28A566':'#E05252'}
                    style={{transition:`r 0.3s ease ${i*0.1+0.5}s`}}
                  />
                ))}
                {/* X labels */}
                {CF_MONTHS.map((m,i)=>(
                  <text key={m} x={cfToX(i)} y={SH} textAnchor="middle" fontSize="8.5" fill={C.textSecondary} fontFamily="Inter,sans-serif">{m}</text>
                ))}
              </svg>
            );
          })()}

          <div style={{marginTop:10,display:'flex',alignItems:'center',gap:12}}>
            {[{c:'#28A566',l:'Au-dessus objectif'},{c:'#E05252',l:'En-dessous'}].map(({c,l})=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:4}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:c}}/>
                <span style={{fontSize:9.5,color:C.textSecondary}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
