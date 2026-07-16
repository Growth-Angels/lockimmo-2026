import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SupportChatModal } from '../ui/SupportChatModal';
import { C } from '../../tokens';

const CHAT_BTN_CSS = `
@keyframes chat-btn-pulse {
  0%, 100% { box-shadow: 0 6px 20px rgba(255,135,83,0.4), 0 0 0 0   rgba(255,135,83,0.3); }
  50%       { box-shadow: 0 6px 20px rgba(255,135,83,0.4), 0 0 0 10px rgba(255,135,83,0);   }
}
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <style>{CHAT_BTN_CSS}</style>
      <div style={{ display: 'flex', height: '100vh', fontFamily: "'Alan Sans', sans-serif", overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bgApp }}>
          <Topbar />
          <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            {children}
          </main>
        </div>
      </div>

      {/* Bouton chat flottant */}
      <button
        onClick={() => setChatOpen(true)}
        title="Contacter le support"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9000,
          width: 52, height: 52, borderRadius: '50%', border: 'none',
          background: C.accent, color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'chat-btn-pulse 2.4s ease-in-out infinite',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        {/* Badge */}
        <div style={{
          position: 'absolute', top: 2, right: 2,
          width: 16, height: 16, borderRadius: '50%',
          background: '#28A566', border: '2px solid white',
          fontSize: 9, fontWeight: 700, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>1</div>
      </button>

      <SupportChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};
