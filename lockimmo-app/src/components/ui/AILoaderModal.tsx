import React, { useEffect, useState } from 'react';
import { C, F } from '../../tokens';

/* ── Keyframes injectés une seule fois ── */
const CSS = `
@keyframes lockai-orbit-a {
  from { transform: rotate(0deg)   translateX(58px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(58px) rotate(-360deg); }
}
@keyframes lockai-orbit-b {
  from { transform: rotate(72deg)  translateX(42px) rotate(-72deg); }
  to   { transform: rotate(432deg) translateX(42px) rotate(-432deg); }
}
@keyframes lockai-orbit-c {
  from { transform: rotate(144deg) translateX(70px) rotate(-144deg); }
  to   { transform: rotate(504deg) translateX(70px) rotate(-504deg); }
}
@keyframes lockai-orbit-d {
  from { transform: rotate(216deg) translateX(50px) rotate(-216deg); }
  to   { transform: rotate(576deg) translateX(50px) rotate(-576deg); }
}
@keyframes lockai-orbit-e {
  from { transform: rotate(288deg) translateX(36px) rotate(-288deg); }
  to   { transform: rotate(648deg) translateX(36px) rotate(-648deg); }
}
@keyframes lockai-pulse {
  0%, 100% { transform: scale(0.88) rotate(0deg);   opacity: 0.75; }
  25%       { transform: scale(1.06) rotate(90deg);  opacity: 1;    }
  50%       { transform: scale(0.94) rotate(180deg); opacity: 0.85; }
  75%       { transform: scale(1.10) rotate(270deg); opacity: 1;    }
}
@keyframes lockai-twinkle-1 {
  0%,100% { opacity: 0.15; transform: scale(0.5) rotate(0deg);   }
  50%     { opacity: 1;    transform: scale(1.2) rotate(180deg); }
}
@keyframes lockai-twinkle-2 {
  0%,100% { opacity: 0.4;  transform: scale(0.7) rotate(0deg);   }
  50%     { opacity: 0.9;  transform: scale(1.1) rotate(-180deg);}
}
@keyframes lockai-twinkle-3 {
  0%,100% { opacity: 0.2;  transform: scale(0.6) rotate(0deg);   }
  50%     { opacity: 1;    transform: scale(1.3) rotate(120deg); }
}
@keyframes lockai-glow {
  0%,100% { box-shadow: 0 0 0 0 rgba(255,135,83,0);  }
  50%     { box-shadow: 0 0 32px 12px rgba(255,135,83,0.18); }
}
@keyframes lockai-modal-in {
  from { opacity: 0; transform: translate(-50%,-50%) scale(0.92); }
  to   { opacity: 1; transform: translate(-50%,-50%) scale(1);    }
}
@keyframes lockai-backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes lockai-bar {
  0%   { width: 6%; }
  30%  { width: 45%; }
  60%  { width: 72%; }
  80%  { width: 88%; }
  95%  { width: 94%; }
  100% { width: 94%; }
}
`;

/* ── Icône étoile 4 branches ── */
const Star4: React.FC<{ size: number; color: string; anim: string; delay?: string }> = ({ size, color, anim, delay = '0s' }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill={color}
    style={{ animation: anim, animationDelay: delay, position: 'absolute', top: -size / 2, left: -size / 2 }}
  >
    <path d="M12 1.5 L13.8 10.2 L22.5 12 L13.8 13.8 L12 22.5 L10.2 13.8 L1.5 12 L10.2 10.2 Z" />
  </svg>
);

/* ── Étoile orbitante (wrapper + star) ── */
const OrbitStar: React.FC<{
  orbitAnim: string;
  twinkleAnim: string;
  size: number;
  color: string;
  speed: string;
  delay?: string;
  twinkleDelay?: string;
}> = ({ orbitAnim, twinkleAnim, size, color, speed, delay = '0s', twinkleDelay = '0s' }) => (
  <div style={{
    position: 'absolute', left: '50%', top: '50%',
    width: 0, height: 0,
    animation: `${orbitAnim} ${speed} linear infinite`,
    animationDelay: delay,
  }}>
    <Star4 size={size} color={color} anim={`${twinkleAnim} ${parseFloat(speed) * 0.7}s ease-in-out infinite`} delay={twinkleDelay} />
  </div>
);

/* ── Composant principal ── */
interface Props {
  open: boolean;
  onClose?: () => void;
  message?: string;
}

export const AILoaderModal: React.FC<Props> = ({
  open,
  onClose,
  message = "L'IA de LOCKimmo est en train d'analyser vos photos",
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 420);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style>{CSS}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(30,24,20,0.55)',
          backdropFilter: 'blur(4px)',
          animation: 'lockai-backdrop-in 0.25s ease both',
        }}
      />

      {/* Card */}
      <div style={{
        position: 'fixed', left: '50%', top: '50%', zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        width: 400, borderRadius: 24,
        background: C.white,
        boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
        padding: '40px 36px 36px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        animation: 'lockai-modal-in 0.32s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>

        {/* Zone animation étoiles */}
        <div style={{
          position: 'relative', width: 160, height: 160,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
        }}>
          {/* Halo de fond */}
          <div style={{
            position: 'absolute', width: 90, height: 90, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,135,83,0.14) 0%, transparent 70%)`,
            animation: 'lockai-glow 2.4s ease-in-out infinite',
          }}/>

          {/* Icône centrale — cadenas LOCKimmo */}
          <div style={{
            position: 'relative', zIndex: 2,
            animation: 'lockai-pulse 3.6s ease-in-out infinite',
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="11" width="16" height="11" rx="2.5" fill={C.accent}/>
              <path d="M7.5 11V7.5a4.5 4.5 0 019 0V11" stroke={C.accent} strokeWidth="2.2" strokeLinecap="round"/>
              {/* étoile IA sur le cadenas */}
              <circle cx="12" cy="16.5" r="1.6" fill="white"/>
            </svg>
            {/* Petite étoile 4pts sur le cadenas */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill={C.white}
              style={{ position: 'absolute', top: -4, right: -6 }}>
              <path d="M12 1.5 L13.8 10.2 L22.5 12 L13.8 13.8 L12 22.5 L10.2 13.8 L1.5 12 L10.2 10.2 Z"/>
            </svg>
          </div>

          {/* Étoiles orbitantes */}
          <OrbitStar orbitAnim="lockai-orbit-a" twinkleAnim="lockai-twinkle-1" size={13} color={C.accent}      speed="2.8s" />
          <OrbitStar orbitAnim="lockai-orbit-b" twinkleAnim="lockai-twinkle-2" size={8}  color="#FFBA99"       speed="3.6s" delay="-0.9s" />
          <OrbitStar orbitAnim="lockai-orbit-c" twinkleAnim="lockai-twinkle-3" size={7}  color={C.accent}      speed="2.1s" delay="-0.4s" />
          <OrbitStar orbitAnim="lockai-orbit-d" twinkleAnim="lockai-twinkle-1" size={11} color="rgba(255,135,83,0.6)" speed="4.2s" delay="-1.6s" />
          <OrbitStar orbitAnim="lockai-orbit-e" twinkleAnim="lockai-twinkle-2" size={6}  color={C.accent}      speed="1.9s" delay="-0.7s" />
        </div>

        {/* Badge IA */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.accentLight, borderRadius: 20,
          padding: '5px 12px', marginBottom: 14,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={C.accent}>
            <path d="M12 1.5 L13.8 10.2 L22.5 12 L13.8 13.8 L12 22.5 L10.2 13.8 L1.5 12 L10.2 10.2 Z"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            IA LOCKimmo
          </span>
        </div>

        {/* Texte principal */}
        <div style={{
          fontSize: 16, fontWeight: 600, color: C.textPrimary,
          textAlign: 'center', lineHeight: 1.5, marginBottom: 8,
          fontFamily: F.display, letterSpacing: '-0.2px',
        }}>
          {message}
        </div>

        {/* Sous-texte animé */}
        <div style={{
          fontSize: 13, color: C.textSecondary,
          textAlign: 'center', marginBottom: 28, minHeight: 20,
        }}>
          Analyse en cours<span style={{ display: 'inline-block', width: 20, textAlign: 'left' }}>{dots}</span>
        </div>

        {/* Barre de progression */}
        <div style={{
          width: '100%', height: 4, borderRadius: 4,
          background: 'rgba(255,135,83,0.12)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: `linear-gradient(90deg, ${C.accent}, #FFB899)`,
            animation: 'lockai-bar 6s cubic-bezier(0.4,0,0.2,1) forwards',
          }}/>
        </div>

        {/* Lien annuler */}
        {onClose && (
          <button onClick={onClose} style={{
            marginTop: 20, background: 'none', border: 'none',
            fontSize: 12, color: C.textSecondary, cursor: 'pointer',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            Annuler
          </button>
        )}
      </div>
    </>
  );
};
