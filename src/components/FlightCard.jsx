import React, { useState, useEffect } from 'react';
import { Plane, Info, Wifi, Zap, VolumeX, Star, Leaf, Heart, Flame, Eye } from 'lucide-react';
import { getAircraftAnalysis } from '../services/mockData';
import { useCurrency } from '../context/CurrencyContext';

export default function FlightCard({ flight, isSelected, onSelect, onInspectAircraft, onCheckout }) {
  const { formatPrice } = useCurrency();
  const isEcoFriendly = ['A350-900', '787-9 Dreamliner', 'A321neo', '737 MAX 8'].some(a => flight?.aircraft?.includes(a));

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
  };
  
  const aircraftData = getAircraftAnalysis(flight.aircraft);

  // Scarcity Alert Logic (Deterministic pseudo-random based on flight details)
  const pseudoRandom = (flight.price + flight.flightNum.charCodeAt(0) + flight.duration.length) % 10;
  let scarcityAlert = null;
  if (pseudoRandom === 1 || pseudoRandom === 2) {
    scarcityAlert = { icon: <Flame size={14} />, text: `🔥 該價位僅剩最後 ${pseudoRandom + 1} 個座位`, color: '#ef4444' };
  } else if (pseudoRandom === 3 || pseudoRandom === 4) {
    scarcityAlert = { icon: <Eye size={14} />, text: `👀 目前有 ${pseudoRandom * 3 + 2} 人正在查看此航班`, color: '#f59e0b' };
  }

  // Saved State
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    const savedFlights = JSON.parse(localStorage.getItem('saved_flights') || '[]');
    setIsSaved(savedFlights.some(f => f.flightNum === flight.flightNum && f.price === flight.price));
  }, [flight]);

  const toggleSave = (e) => {
    e.stopPropagation();
    let savedFlights = JSON.parse(localStorage.getItem('saved_flights') || '[]');
    if (isSaved) {
      savedFlights = savedFlights.filter(f => !(f.flightNum === flight.flightNum && f.price === flight.price));
      setIsSaved(false);
    } else {
      savedFlights.push(flight);
      setIsSaved(true);
    }
    localStorage.setItem('saved_flights', JSON.stringify(savedFlights));
    // Dispatch an event so Dashboard can re-render if it's listening, but it already has a useEffect on mount, which is fine for now
    window.dispatchEvent(new Event('storage'));
  };

  const getAirlineLogo = (airlineName) => {
    const match = airlineName?.match(/\(([^)]+)\)/);
    const englishName = match ? match[1] : airlineName;
    const domainMap = {
      'EVA Air': 'evaair.com',
      'China Airlines': 'china-airlines.com',
      'STARLUX': 'starlux-airlines.com',
      'Cathay Pacific': 'cathaypacific.com',
      'JAL': 'jal.co.jp',
      'ANA': 'ana.co.jp',
      'Korean Air': 'koreanair.com',
      'Singapore Airlines': 'singaporeair.com',
      'Emirates': 'emirates.com',
      'Qatar Airways': 'qatarairways.com',
    };
    const domain = domainMap[englishName];
    if (domain) {
      return `https://logo.clearbit.com/${domain}`;
    }
    return null;
  };
  const logoUrl = getAirlineLogo(flight.airline);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`flight-card glass-panel ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(flight)}
      style={{ position: 'relative' }}
    >
      {scarcityAlert && (
        <div style={{ position: 'absolute', top: '-12px', left: '16px', display: 'flex', alignItems: 'center', gap: '4px', background: scarcityAlert.color, color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10 }}>
          {scarcityAlert.icon} {scarcityAlert.text}
        </div>
      )}
      <div className="flight-card-main">
        <div style={{ width: '100%' }}>
          <div className="flight-airline-info" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="airline-logo-placeholder" style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {logoUrl && !imageError ? (
                <img src={logoUrl} alt={flight.airline} onError={() => setImageError(true)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <Plane size={20} />
              )}
            </div>
          <div className="airline-details">
            <h4>{flight.airline}</h4>
            <span className="flight-num">{flight.flightNum}</span>
            {isEcoFriendly && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.3)', marginLeft: '0.5rem' }}>
                <Leaf size={12} fill="currentColor" /> 低碳排放 -25%
              </span>
            )}
            </div>
          </div>
        </div>

        <div className="flight-times">
          <div className="time-block">
            <span className="time">{formatTime(flight.departure.time)}</span>
            <span className="airport">{flight.departure.airport}</span>
            <span className="date-sub">{formatDate(flight.departure.time)}</span>
          </div>

          <div className="flight-duration-block">
            <span className="duration">{flight.duration}</span>
            <div className="flight-line">
              <span className="dot"></span>
              <span className="line"></span>
              <Plane size={14} className="plane-icon" />
              <span className="line"></span>
              <span className="dot"></span>
            </div>
            <span className="stops">{flight.stops === 0 ? '直飛' : `${flight.stops} 次轉機`}</span>
          </div>

          <div className="time-block">
            <span className="time">{formatTime(flight.arrival.time)}</span>
            <span className="airport">{flight.arrival.airport}</span>
            <span className="date-sub">{formatDate(flight.arrival.time)}</span>
          </div>
        </div>

        <div className="flight-price-select">
          <div className="price-tag">
            <span className="amount">{formatPrice(flight.price)}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              onClick={toggleSave}
              style={{ background: isSaved ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)', color: isSaved ? '#ef4444' : 'var(--text-secondary)', border: '1px solid ' + (isSaved ? '#ef4444' : 'rgba(255,255,255,0.2)'), borderRadius: '8px', padding: '0.5rem 0.75rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} />
            </button>
            <button 
              className={`select-btn ${isSelected ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onCheckout) onCheckout(flight);
            }}
          >
            模擬劃位與結帳 ↗
            </button>
          </div>
        </div>
      </div>

      <div className="flight-card-footer">
        <div className="aircraft-info" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', cursor: 'pointer', borderBottom: '1px dashed var(--accent-primary)', whiteSpace: 'nowrap' }}
            onClick={(e) => {
              e.stopPropagation();
              onInspectAircraft && onInspectAircraft(flight.aircraft);
            }}
          >
            <Info size={14} />
            <span style={{ fontWeight: 'bold' }}>機型深度透視：{flight.aircraft}</span>
          </div>
          
          <div className="aircraft-features" style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span title="舒適度評分" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: aircraftData.score > 90 ? 'var(--success)' : 'var(--warning)' }}>
              <Star size={14} fill="currentColor" /> {aircraftData.score} 分
            </span>
            <span title="椅距" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', border: '1px solid currentColor', padding: '1px 4px', borderRadius: '4px' }}>椅距</span> {aircraftData.legroom}
            </span>
            {aircraftData.wifi && <span title="提供 Wi-Fi" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Wifi size={14} /> Wi-Fi</span>}
            {aircraftData.power && <span title="提供座位插座" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Zap size={14} /> 插座</span>}
            <span title="客艙寧靜度" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><VolumeX size={14} /> {aircraftData.quietness}</span>
          </div>
        </div>
        
        {/* Phase 1 & 2 additions: Layover Alert & Baggage Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          {flight.isLongLayover ? (
            <span style={{ fontSize: '0.85rem', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ☕ 轉機時間長 (&gt;4hr)，建議預訂機場貴賓室或快閃市區行程
            </span>
          ) : (
            <span></span>
          )}
          
          <div className="extras" style={{ display: 'flex', gap: '0.5rem', opacity: 1, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap' }}>💺 {flight.cabin}</span>
            <span style={{ background: flight.includesBaggage ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: flight.includesBaggage ? '#10b981' : '#ef4444', padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
              {flight.includesBaggage ? '🎒 含隨身行李' : '❌ 無隨身行李'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
