import React, { useState } from 'react';
import { X, Users, Share2, DollarSign } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function GroupVoteModal({ isOpen, onClose, totalPrice, passengers }) {
  const { formatPrice } = useCurrency();
  if (!isOpen) return null;
  
  const [copied, setCopied] = useState(false);
  const [votes] = useState([
    { id: 1, name: '目前選擇的超值組合', votes: 3, percentage: 60, price: totalPrice },
    { id: 2, name: '晚去晚回 (多玩半天)', votes: 1, percentage: 20, price: totalPrice + 3000 },
    { id: 3, name: '紅眼航班 (最省錢)', votes: 1, percentage: 20, price: Math.max(0, totalPrice - 4500) }
  ]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const perPersonPrice = Math.floor(totalPrice / (passengers || 1));

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content group-vote-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X /></button>
        
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={24} color="var(--accent-primary)" /> 揪團投票與分帳系統</h2>
          <p style={{ color: 'var(--text-secondary)' }}>將此連結分享給旅伴，讓大家投票決定要搭哪一班！</p>
        </div>
        
        <div className="share-link-box">
          <input type="text" readOnly value="https://flightiq.com/vote/xyz-789-abc" />
          <button onClick={handleCopy} className="copy-btn">
            {copied ? '已複製！' : <><Share2 size={16}/> 複製</>}
          </button>
        </div>

        <div className="vote-results">
          <h3 style={{ margin: '1.5rem 0 1rem 0' }}>目前戰況 ({passengers} 人群組)</h3>
          {votes.map(v => (
            <div key={v.id} className="vote-bar-container">
              <div className="vote-bar-header">
                <span className="vote-name">{v.name}</span>
                <span className="vote-count">{v.votes} 票</span>
              </div>
              <div className="vote-bar-track">
                <div className="vote-bar-fill" style={{ width: `${v.percentage}%` }}></div>
              </div>
              <div className="vote-price">總價 {formatPrice(v.price)}</div>
            </div>
          ))}
        </div>

        <div className="split-bill-section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0 1rem 0' }}><DollarSign size={20} color="var(--success)" /> 一鍵分帳 (Line Pay / Apple Pay)</h3>
          <div className="split-bill-card">
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>群組總金額</div>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>
            <div style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.1)' }}>/</div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>每人均攤 (共 {passengers} 人)</div>
              <strong style={{ fontSize: '1.25rem' }}>{formatPrice(perPersonPrice)}</strong>
            </div>
          </div>
          <button className="search-btn" style={{ width: '100%', margin: '1rem 0 0 0', background: '#00c300', borderColor: '#00c300' }}>
            產生 Line Pay 收款條碼
          </button>
        </div>
      </div>
    </div>
  );
}
