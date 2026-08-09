import { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { generatePriceData } from '../services/mockData';

export default function PriceChart({ data }) {
  const [timeRange, setTimeRange] = useState('30D');
  const { formatPrice } = useCurrency();

  const filteredData = useMemo(() => {
    const days = timeRange === '7D' ? 7 : timeRange === '90D' ? 90 : 30;
    // Generate fresh data for the selected range to ensure we have enough days
    return generatePriceData(days);
  }, [timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--accent-primary)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</p>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            歷史價格: {formatPrice(payload[0].value)}
          </p>
          {payload[1] && payload[1].value && (
            <p style={{ fontWeight: 600, color: 'var(--warning)', marginTop: '0.25rem' }}>
              預測價格: {formatPrice(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container glass-panel animate-fade-in-delayed">
      <div className="chart-header">
        <h2>
          <TrendingUp size={24} className="app-header-icon" />
          價格趨勢與預測
        </h2>
        <div className="chart-actions">
          <button className={timeRange === '7D' ? 'active' : ''} onClick={() => setTimeRange('7D')}>7天</button>
          <button className={timeRange === '30D' ? 'active' : ''} onClick={() => setTimeRange('30D')}>30天</button>
          <button className={timeRange === '90D' ? 'active' : ''} onClick={() => setTimeRange('90D')}>90天</button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={filteredData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--warning)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--warning)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="var(--text-secondary)" 
            tick={{ fill: 'var(--text-secondary)' }}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis 
            stroke="var(--text-secondary)" 
            tick={{ fill: 'var(--text-secondary)' }}
            tickFormatter={(value) => formatPrice(value)}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="var(--accent-primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
          <Area 
            type="monotone" 
            dataKey="predictedPrice" 
            stroke="var(--warning)" 
            strokeWidth={3}
            strokeDasharray="5 5"
            fillOpacity={1} 
            fill="url(#colorPredicted)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
