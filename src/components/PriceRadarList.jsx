import React from 'react';
import { Bell, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function PriceRadarList({ trackedRoutes }) {
  const { formatPrice } = useCurrency();
  
  if (!trackedRoutes || trackedRoutes.length === 0) {
    return (
      <div className="price-radar glass-panel animate-fade-in empty">
        <div className="radar-header">
          <Bell size={20} className="app-header-icon" />
          <h3>降價雷達與追蹤</h3>
        </div>
        <p className="empty-text">目前尚未追蹤任何航線。<br/>點擊搜尋結果旁的「追蹤降價」來啟動雷達！</p>
      </div>
    );
  }
  
  return (
    <div className="price-radar glass-panel animate-fade-in">
      <div className="radar-header">
        <Bell size={20} className="app-header-icon" style={{ animation: 'shake 2s infinite' }} />
        <h3>降價雷達 (即時看盤)</h3>
      </div>
      
      <div className="radar-list">
        {trackedRoutes.map(route => {
          const isDrop = route.delta < 0;
          const isUp = route.delta > 0;
          return (
            <div key={route.id} className="radar-item">
              <div className="route-info">
                <span className="route-cities">{route.origin} ✈️ {route.dest}</span>
                <span className="route-date">{route.date}</span>
              </div>
              <div className="radar-price-block">
                <div className="current-price">{formatPrice(route.currentPrice)}</div>
                <div className={`price-delta ${isDrop ? 'drop' : isUp ? 'up' : 'flat'}`}>
                  {isDrop && <TrendingDown size={14} />}
                  {isUp && <TrendingUp size={14} />}
                  {!isDrop && !isUp && <Minus size={14} />}
                  <span>{isDrop || isUp ? formatPrice(Math.abs(route.delta)) : '持平'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
