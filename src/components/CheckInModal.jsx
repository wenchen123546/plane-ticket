import React, { useEffect } from 'react';
import { X, CheckCircle, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CheckInModal({ flightNum, passenger, onClose }) {
  const { t } = useTranslation();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <CheckCircle className="icon-pulse" color="#10b981" /> {t('check_in') || '線上報到成功'}
        </h2>
        
        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <svg viewBox="0 0 200 200" width="150" height="150" style={{ background: '#fff', padding: '10px', borderRadius: '8px', margin: '0 auto 1rem' }}>
            <rect x="20" y="20" width="60" height="60" fill="#000" />
            <rect x="120" y="20" width="60" height="60" fill="#000" />
            <rect x="20" y="120" width="60" height="60" fill="#000" />
            
            {/* Fake QR pattern */}
            <path d="M40 40h20v20H40z M140 40h20v20h-20z M40 140h20v20H40z M90 40h20v20H90z M40 90h20v20H40z M140 90h20v20h-20z M90 90h20v20H90z M90 140h20v20H90z M140 140h20v20h-20z M60 70h10v10H60z M120 70h10v10h-10z M70 120h10v10H70z" fill="#000" />
          </svg>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{passenger || 'PASSENGER'}</div>
          <div style={{ color: 'var(--accent-primary)', letterSpacing: '2px', fontSize: '1.5rem', margin: '0.5rem 0' }}>{flightNum}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>CLASS: Y &nbsp;&nbsp;|&nbsp;&nbsp; SEQ: 042</div>
        </div>

        <button className="search-btn" style={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={onClose}>
          <Smartphone size={18} /> 儲存至 Apple Wallet / Google Pay
        </button>
      </div>
    </div>
  );
}
