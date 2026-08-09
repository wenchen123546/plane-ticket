import React from 'react';
import { Brain, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function IntelligencePanel({ currentPrice, historyAvg = 15000 }) {
  const { formatPrice } = useCurrency();
  const diff = currentPrice - historyAvg;
  const percent = Math.abs(Math.round((diff / historyAvg) * 100));
  
  let status, message, icon, colorClass;
  if (diff < -500) {
    status = '強烈建議購買';
    message = `目前票價比歷史平均便宜 ${percent}%，為近期罕見低價！`;
    icon = <TrendingDown size={32} />;
    colorClass = 'excellent';
  } else if (diff > 1500) {
    status = '建議觀望';
    message = `目前票價高於平均 ${percent}%，預計近期將有回落可能。`;
    icon = <TrendingUp size={32} />;
    colorClass = 'wait';
  } else {
    status = '價格平穩';
    message = `目前票價與歷史平均相符，若行程確定可考慮入手。`;
    icon = <AlertTriangle size={32} />;
    colorClass = 'good';
  }

  return (
    <div className={`intelligence-panel glass-panel animate-fade-in ${colorClass}`}>
      <div className="intel-header">
        <Brain className="intel-header-icon" size={20} />
        <h3>AI 價格趨勢分析</h3>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.1' }}>
            {formatPrice(currentPrice)}
          </span>
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/人</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <span>歷史均價 {formatPrice(historyAvg)}</span>
          <span style={{ color: diff <= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {diff <= 0 ? `低於均價 ${formatPrice(Math.abs(diff))}` : `高於均價 ${formatPrice(diff)}`}
          </span>
        </div>
      </div>
      <div className="intel-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div className="intel-status-icon" style={{ flexShrink: 0 }}>
          {icon}
        </div>
        <div className="intel-content">
          <h2 className="intel-status">{status}</h2>
          <p className="intel-message">{message}</p>
        </div>
      </div>
    </div>
  );
}
