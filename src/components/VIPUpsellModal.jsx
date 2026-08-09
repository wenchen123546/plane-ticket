import React, { useState, useEffect } from 'react';
import { X, Crown, Coffee, Zap } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function VIPUpsellModal({ isOpen, onClose, onFinish }) {
  const { formatPrice } = useCurrency();
  const [fastTrack, setFastTrack] = useState(false);
  const [lounge, setLounge] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content vip-upsell-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close"><X /></button>
        
        <div className="vip-header">
          <Crown size={48} color="#fbbf24" style={{ marginBottom: '1rem' }} />
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24' }}>專屬 VIP 尊榮體驗升級</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>避開擁擠人潮，享受奢華的機場時光</p>
        </div>

        <div className="vip-options">
          <label className={`vip-card ${fastTrack ? 'selected' : ''}`}>
            <input type="checkbox" checked={fastTrack} onChange={() => setFastTrack(!fastTrack)} style={{ display: 'none' }} />
            <div className="vip-card-icon" style={{ color: fastTrack ? '#fbbf24' : 'var(--text-secondary)' }}><Zap size={32} /></div>
            <div className="vip-card-content">
              <h3>專屬快速通關 (Fast Track)</h3>
              <p>免排隊！享有專屬安檢與海關通道，節省至少 45 分鐘。</p>
            </div>
            <div className="vip-price">+ {formatPrice(800)}</div>
          </label>

          <label className={`vip-card ${lounge ? 'selected' : ''}`}>
            <input type="checkbox" checked={lounge} onChange={() => setLounge(!lounge)} style={{ display: 'none' }} />
            <div className="vip-card-icon" style={{ color: lounge ? '#fbbf24' : 'var(--text-secondary)' }}><Coffee size={32} /></div>
            <div className="vip-card-content">
              <h3>環亞機場貴賓室 (Premium Lounge)</h3>
              <p>無限享用米其林現煮熱食、頂級調酒與安靜舒適的候機空間。</p>
            </div>
            <div className="vip-price">+ {formatPrice(1200)}</div>
          </label>
        </div>

        <div className="modal-footer" style={{ borderTop: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 2rem 2rem 2rem' }}>
          <button className="search-btn vip-btn" style={{ margin: 0, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none' }} onClick={() => onFinish(fastTrack, lounge)}>
            確認並前往金流結帳
          </button>
          <button className="skip-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => onFinish(false, false)}>
            不，我不需要這些服務
          </button>
        </div>
      </div>
    </div>
  );
}
