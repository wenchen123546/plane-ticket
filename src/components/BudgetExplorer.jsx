import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function BudgetExplorer({ onSelectDestination }) {
  const { formatPrice } = useCurrency();
  const [budget, setBudget] = useState(15000);
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // Generate mock prices for top destinations
  const topDestinations = [
    { code: 'NRT', name: '東京, 日本', image: '🗼', basePrice: 12000 },
    { code: 'BKK', name: '曼谷, 泰國', image: '🛕', basePrice: 8000 },
    { code: 'ICN', name: '首爾, 韓國', image: '🏯', basePrice: 9500 },
    { code: 'SIN', name: '新加坡', image: '🦁', basePrice: 11000 },
    { code: 'CDG', name: '巴黎, 法國', image: '🥐', basePrice: 32000 },
    { code: 'JFK', name: '紐約, 美國', image: '🗽', basePrice: 38000 },
    { code: 'SYD', name: '雪梨, 澳洲', image: '🦘', basePrice: 22000 },
    { code: 'DPS', name: '峇里島, 印尼', image: '🌴', basePrice: 14000 },
  ];

  return (
    <div className="budget-explorer animate-fade-in">
      <div className="budget-header glass-panel">
        <div className="budget-title">
          <Compass size={28} className="app-header-icon" />
          <h2>🌍 盲盒預算探索地圖</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>告訴我們您的預算，我們帶您看世界！系統將為您掃描全球最佳航點。</p>
        
        <div className="budget-controls">
          <div className="control-group budget-slider-group">
            <label>您的總預算上限：<span className="budget-amount">{formatPrice(budget)}</span></label>
            <input 
              type="range" 
              min="5000" 
              max="50000" 
              step="1000" 
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))}
              className="budget-slider"
            />
          </div>
          <div className="control-group">
            <label>預計出發月份</label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="month-select glass-input">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m} style={{ background: '#1e293b' }}>{m} 月出發</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="destinations-grid">
        {topDestinations.map(dest => {
          // Mock dynamic price based on month and a deterministic random seed per destination/month
          const seed = dest.basePrice + month;
          const price = dest.basePrice + (month === 7 || month === 8 || month === 12 ? 4000 : 0) + ((seed % 3000) - 1500);
          const isAffordable = price <= budget;
          
          return (
            <div 
              key={dest.code} 
              className={`dest-card glass-panel ${isAffordable ? 'affordable' : 'unaffordable'}`}
              onClick={() => onSelectDestination && onSelectDestination(dest.code)}
              style={{ cursor: 'pointer' }}
            >
              <div className="dest-image-placeholder">{dest.image}</div>
              <div className="dest-info">
                <h3>{dest.name}</h3>
                <div className="dest-price">
                  <span className="price-label">估計票價</span>
                  <strong className={`amount ${isAffordable ? 'text-success' : 'text-danger'}`}>
                    <span className="dest-price-tag">
                      {formatPrice(price)}
                    </span>
                  </strong>
                </div>
              </div>
              {isAffordable && (
                <div className="affordable-badge">預算內 🎉</div>
              )}
              {!isAffordable && (
                <div className="unaffordable-overlay">
                  <span>超出預算</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
