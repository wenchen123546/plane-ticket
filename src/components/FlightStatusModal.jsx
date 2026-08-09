import React, { useState, useEffect } from 'react';
import { X, Plane, Clock, AlertCircle } from 'lucide-react';
import { fetchFlightStatus } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function FlightStatusModal({ flightNum, onClose }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await fetchFlightStatus(flightNum);
        setStatus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, [flightNum]);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <Plane className="icon-pulse" color="var(--accent-primary)" /> {t('flight_status') || '即時航班動態'} - {flightNum}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{t('loading') || '連線至全球航班雷達...'}</p>
          </div>
        ) : error ? (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444' }}>
            <AlertCircle size={20} style={{ marginBottom: '0.5rem' }} />
            <p style={{ margin: 0 }}>{error}</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>請確認後端 `.env` 中是否已設定 AVIATION_STACK_API_KEY</p>
          </div>
        ) : status ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>出發地 (Origin)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{status.departure.iata}</div>
                <div style={{ fontSize: '0.85rem' }}>Terminal {status.departure.terminal || '-'}, Gate {status.departure.gate || '-'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}><Plane size={24} color="var(--text-secondary)" /></div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>目的地 (Destination)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{status.arrival.iata}</div>
                <div style={{ fontSize: '0.85rem' }}>Terminal {status.arrival.terminal || '-'}, Gate {status.arrival.gate || '-'}</div>
              </div>
            </div>

            <div style={{ padding: '1rem', background: status.flight_status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${status.flight_status === 'active' ? '#10b981' : '#f59e0b'}`, borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: status.flight_status === 'active' ? '#10b981' : '#f59e0b' }}>
                <Clock size={18} /> 狀態: {status.flight_status.toUpperCase()}
              </h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                表定出發: {new Date(status.departure.scheduled).toLocaleString()}<br />
                實際出發: {status.departure.actual ? new Date(status.departure.actual).toLocaleString() : '尚未出發'}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
