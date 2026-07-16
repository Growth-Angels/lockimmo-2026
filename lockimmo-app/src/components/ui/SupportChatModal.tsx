import React, { useEffect, useState } from 'react';
import { C, F } from '../../tokens';

/* ── CSS keyframes ── */
const CSS = `
@keyframes chat-modal-in {
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}
@keyframes chat-bubble-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes chat-backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes typing-dot {
  0%, 60%, 100% { transform: translateY(0);    opacity: 0.35; }
  30%           { transform: translateY(-5px); opacity: 1;    }
}
@keyframes avatar-pulse {
  0%, 100% { box-shadow: 0 0 0 0   rgba(40,165,102,0.4); }
  50%      { box-shadow: 0 0 0 6px rgba(40,165,102,0);   }
}
@keyframes chat-btn-bounce {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}
`;

/* ── Données du chat ── */
const MESSAGES = [
  {
    from: 'client',
    text: "Bonjour, j'ai un problème avec la génération de mes quittances de mars 😕",
    time: '14:32',
  },
  {
    from: 'support',
    text: "Bonjour Léona 👋 Je vois votre dossier. Vous êtes bien dans Éditions > Quittances ?",
    time: '14:32',
  },
  {
    from: 'client',
    text: "Oui mais le bouton « Générer » est grisé, je ne peux pas cliquer.",
    time: '14:33',
  },
  {
    from: 'support',
    text: "C'est normal : les loyers de mars ne sont pas encore validés ✅ Allez dans Gestion → Loyers & facturations, validez-les, et le bouton se débloquera immédiatement !",
    time: '14:33',
  },
] as const;

/* Délais d'apparition en ms */
const TIMELINE = [
  400,   // bulle 1
  1000,  // indicateur "typing..."
  2600,  // bulle 2 (typing disparaît)
  3400,  // bulle 3
  4200,  // indicateur "typing..."
  5800,  // bulle 4 (typing disparaît)
];

/* ── Bulle de chat ── */
const Bubble: React.FC<{
  msg: typeof MESSAGES[number];
  visible: boolean;
}> = ({ msg, visible }) => {
  const isClient = msg.from === 'client';

  if (!visible) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isClient ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: 8,
      animation: 'chat-bubble-in 0.32s cubic-bezier(0.34,1.4,0.64,1) both',
    }}>
      {/* Avatar support */}
      {!isClient && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #28A566, #1d7a4d)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'avatar-pulse 2s ease-in-out infinite',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 4.18 2 2 0 014.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </div>
      )}

      {/* Contenu */}
      <div style={{ maxWidth: '76%', display: 'flex', flexDirection: 'column', alignItems: isClient ? 'flex-end' : 'flex-start', gap: 3 }}>
        {!isClient && (
          <span style={{ fontSize: 10, fontWeight: 700, color: '#28A566', letterSpacing: '0.04em', textTransform: 'uppercase', marginLeft: 2 }}>
            Support LOCKimmo
          </span>
        )}
        <div style={{
          padding: '10px 14px',
          background: isClient ? C.accent : '#F2F0EE',
          color: isClient ? 'white' : C.textPrimary,
          borderRadius: isClient
            ? '16px 16px 4px 16px'
            : '16px 16px 16px 4px',
          fontSize: 13.5, lineHeight: 1.55,
          boxShadow: isClient
            ? '0 4px 12px rgba(255,135,83,0.25)'
            : '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          {msg.text}
        </div>
        <span style={{ fontSize: 10, color: C.textSecondary, marginLeft: isClient ? 0 : 2, marginRight: isClient ? 2 : 0 }}>
          {msg.time}
        </span>
      </div>
    </div>
  );
};

/* ── Indicateur "en train de taper" ── */
const TypingIndicator: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 8,
      animation: 'chat-bubble-in 0.25s ease both',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #28A566, #1d7a4d)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 4.18 2 2 0 014.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      </div>
      <div style={{
        padding: '10px 16px', background: '#F2F0EE',
        borderRadius: '16px 16px 16px 4px',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: C.textSecondary,
            animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
};

/* ── Composant principal ── */
interface Props {
  open: boolean;
  onClose: () => void;
}

export const SupportChatModal: React.FC<Props> = ({ open, onClose }) => {
  // phase : quel step de la timeline on est
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    if (!open) { setPhase(-1); return; }

    const timers = TIMELINE.map((delay, i) =>
      setTimeout(() => setPhase(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [open]);

  if (!open) return null;

  const showTyping1 = phase === 1; // entre bulle 1 et 2
  const showTyping2 = phase === 4; // entre bulle 3 et 4

  return (
    <>
      <style>{CSS}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(30,24,20,0.45)',
        backdropFilter: 'blur(4px)',
        animation: 'chat-backdrop-in 0.2s ease both',
      }}/>

      {/* Modal card */}
      <div style={{
        position: 'fixed', right: 28, bottom: 88, zIndex: 9999,
        width: 380, borderRadius: 20,
        background: C.white,
        boxShadow: '0 24px 64px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        animation: 'chat-modal-in 0.36s cubic-bezier(0.34,1.4,0.64,1) both',
      }}>

        {/* Header */}
        <div style={{
          padding: '16px 18px',
          background: `linear-gradient(135deg, #2B2826, #3d342e)`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #28A566, #1d7a4d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 4.18 2 2 0 014.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.display, fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: '-0.2px' }}>
              Support LOCKimmo
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28A566', animation: 'avatar-pulse 2s ease-in-out infinite' }}/>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>En ligne · répond en &lt; 2 min</span>
            </div>
          </div>
          {/* Close */}
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{
          padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14,
          minHeight: 280, background: '#FAFAF9',
        }}>
          <Bubble msg={MESSAGES[0]} visible={phase >= 0} />
          <TypingIndicator visible={showTyping1} />
          <Bubble msg={MESSAGES[1]} visible={phase >= 2} />
          <Bubble msg={MESSAGES[2]} visible={phase >= 3} />
          <TypingIndicator visible={showTyping2} />
          <Bubble msg={MESSAGES[3]} visible={phase >= 5} />
        </div>

        {/* Input zone (décorative) */}
        <div style={{
          padding: '12px 14px',
          borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 10,
          background: C.white,
        }}>
          <div style={{
            flex: 1, background: '#F2F0EE', borderRadius: 20,
            padding: '9px 16px', fontSize: 13, color: C.textSecondary,
          }}>
            Écrire un message…
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
