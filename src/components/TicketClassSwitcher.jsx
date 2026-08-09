import React from 'react';
import { Briefcase, Luggage, Star } from 'lucide-react';

export default function TicketClassSwitcher({ currentClass, onChangeClass }) {
  const classes = [
    { id: 'light', name: '輕裝上陣', desc: '手提 7kg', icon: <Briefcase size={18} />, color: 'var(--text-secondary)', bg: 'rgba(156, 163, 175, 0.15)' },
    { id: 'standard', name: '標準旅行', desc: '含 23kg 托運', icon: <Luggage size={18} />, color: 'var(--accent-primary)', bg: 'rgba(14, 165, 233, 0.15)' },
    { id: 'business', name: '商務尊榮', desc: '40kg + 優先選位', icon: <Star size={18} />, color: 'var(--warning)', bg: 'rgba(234, 179, 8, 0.15)' }
  ];

  return (
    <div className="ticket-class-switcher glass-panel">
      {classes.map(c => {
        const isActive = currentClass === c.id;
        return (
          <button
            key={c.id}
            className={`class-btn ${isActive ? 'active' : ''}`}
            onClick={() => onChangeClass(c.id)}
            style={{ 
              borderColor: isActive ? c.color : 'transparent',
              background: isActive ? c.bg : 'transparent'
            }}
          >
            <div className="class-icon" style={{ color: isActive ? c.color : 'var(--text-secondary)' }}>
              {c.icon}
            </div>
            <div className="class-info">
              <div className="class-name" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{c.name}</div>
              <div className="class-desc">{c.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
