import React, { useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';

export default function PriceCalendar({ basePrice, multiplier, currentDate, onSelectDate }) {
  const { formatPrice } = useCurrency();
  
  const generateCalendarDays = useMemo(() => {
    const days = [];
    const date = new Date(currentDate || Date.now());
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Generate prices based on day of week and random fluctuation
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(year, month, i);
      const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
      
      // Simulate real-world pricing: weekends are more expensive, some random deals
      let simulatedPrice = basePrice * multiplier;
      if (isWeekend) simulatedPrice *= 1.3;
      
      // Add random noise (-15% to +15%)
      const noise = (Math.sin(i * 13) * 0.15) + 1;
      simulatedPrice = Math.floor(simulatedPrice * noise);
      
      days.push({
        day: i,
        price: simulatedPrice,
        isCheapest: false
      });
    }
    
    // Find cheapest day
    const validDays = days.filter(d => d !== null);
    const minPrice = Math.min(...validDays.map(d => d.price));
    validDays.forEach(d => {
      if (d.price === minPrice) d.isCheapest = true;
    });
    
    return { days, monthName: date.toLocaleDateString('zh-TW', { month: 'long', year: 'numeric' }) };
  }, [basePrice, multiplier, currentDate]);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
        <span>🗓️ {generateCalendarDays.monthName} 彈性票價日曆</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>綠色表示該月最低票價</span>
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingBottom: '0.5rem' }}>{d}</div>
        ))}
        
        {generateCalendarDays.days.map((dayObj, i) => (
          <div 
            key={i} 
            onClick={() => {
              if (dayObj && onSelectDate) {
                const date = new Date(currentDate || Date.now());
                date.setDate(dayObj.day);
                onSelectDate(date.toISOString());
              }
            }}
            style={{ 
              padding: '0.75rem 0.25rem', 
              background: dayObj ? (dayObj.isCheapest ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.2)') : 'transparent',
              border: dayObj ? (dayObj.isCheapest ? '1px solid #10b981' : '1px solid var(--glass-border)') : 'none',
              borderRadius: '8px',
              opacity: dayObj ? 1 : 0,
              cursor: dayObj ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
            className={dayObj ? 'calendar-day-hover' : ''}
          >
            {dayObj && (
              <>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: dayObj.isCheapest ? '#10b981' : 'white' }}>{dayObj.day}</div>
                <div style={{ fontSize: '0.7rem', color: dayObj.isCheapest ? '#34d399' : 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {formatPrice(dayObj.price)}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <style>{`
        .calendar-day-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          background: rgba(59, 130, 246, 0.2) !important;
          border-color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}
