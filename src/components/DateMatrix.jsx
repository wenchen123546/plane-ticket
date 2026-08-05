import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingDown, Sparkles } from 'lucide-react';

export default function DateMatrix({ matrixData }) {
  const { formatPrice } = useCurrency();
  if (!matrixData || matrixData.length === 0) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short' });
  };

  const minPrice = Math.min(...matrixData.map(d => d.price));
  const maxPrice = Math.max(...matrixData.map(d => d.price));
  const bestDay = matrixData.find(d => d.price === minPrice);

  const getHeatmapColor = (price) => {
    const ratio = (price - minPrice) / (maxPrice - minPrice || 1);
    if (ratio < 0.3) return 'rgba(16, 185, 129, 0.15)'; // success (green)
    if (ratio < 0.7) return 'rgba(245, 158, 11, 0.15)'; // warning (yellow)
    return 'rgba(239, 68, 68, 0.15)'; // danger (red)
  };

  const chartData = matrixData.map(day => ({
    name: day.date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' }),
    price: day.price,
    dateFull: formatDate(day.date)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{payload[0].payload.dateFull}</p>
          <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>{formatPrice(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="date-matrix-container glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📅 去程彈性日期票價 (前後 3 天)
        </h3>
        <div className="matrix-grid" style={{ marginBottom: '1.5rem' }}>
          {matrixData.map((day, i) => (
            <div 
              key={i} 
              className={`matrix-cell ${day.offset === 0 ? 'matrix-center' : ''}`}
              style={{ backgroundColor: getHeatmapColor(day.price) }}
            >
              <span className="matrix-date" style={{ whiteSpace: 'nowrap' }}>{formatDate(day.date)}</span>
              <span className="matrix-price" style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{formatPrice(day.price)}</span>
              {day.price === minPrice && <span className="matrix-best">最低價</span>}
              {day.offset === 0 && <span className="matrix-current">目前選擇</span>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Chart Section to fill space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><TrendingDown size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>未來一週價格波動</span>
          {bestDay && (
            <span style={{ fontSize: '0.8rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
              <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>
              推薦 {formatDate(bestDay.date)} 出發
            </span>
          )}
        </div>
        <div style={{ width: '100%', height: '140px', marginTop: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} dy={10} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
