import React from 'react';
import { Award, Leaf } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function MileageCalculator({ outbound, inbound, ticketClass }) {
  if (!outbound && !inbound) return null;

  const getDistance = (flight) => {
    if (!flight?.departure?.airport || !flight?.arrival?.airport) return 1500;
    const airports = require('../data/airports').airports;
    const orig = airports.find(a => a.value === flight.departure.airport);
    const dest = airports.find(a => a.value === flight.arrival.airport);
    if (!orig?.lat || !dest?.lat) return 1500;
    
    const R = 3959; // Earth radius in miles
    const dLat = (dest.lat - orig.lat) * Math.PI / 180;
    const dLon = (dest.lon - orig.lon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(orig.lat * Math.PI / 180) * Math.cos(dest.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const { formatPrice } = useCurrency();
  const classMultiplier = ticketClass === 'business' ? 1.5 : ticketClass === 'standard' ? 1.0 : 0.5;
  const outMiles = getDistance(outbound) * classMultiplier;
  const inMiles = getDistance(inbound) * classMultiplier;
  const totalMiles = Math.floor(outMiles + inMiles);
  
  const cashValue = Math.floor(totalMiles * 0.4); // Mock: 1 mile = 0.4 TWD

  // Carbon Footprint Calculation (mock base: 0.15 kg CO2 per mile)
  const calculateCO2 = (flight, miles) => {
    if (!flight) return 0;
    const isEco = ['A350-900', '787-9 Dreamliner', 'A321neo', '737 MAX 8'].some(a => flight?.aircraft?.includes(a));
    return miles * (isEco ? 0.11 : 0.15);
  };
  const totalCO2 = Math.floor(calculateCO2(outbound, outMiles) + calculateCO2(inbound, inMiles));
  const isEcoTrip = outbound && ['A350-900', '787-9 Dreamliner', 'A321neo', '737 MAX 8'].some(a => outbound?.aircraft?.includes(a));

  return (
    <div className="mileage-calculator glass-panel animate-fade-in">
      <div className="intel-header" style={{ marginBottom: '1rem' }}>
        <Award size={20} className="app-header-icon" style={{ color: 'var(--warning)' }} />
        <h3 style={{ color: 'var(--warning)' }}>常客哩程計算機</h3>
      </div>
      
      <div className="miles-display">
        <div className="miles-amount">
          <span className="number">{totalMiles.toLocaleString()}</span>
          <span className="unit">哩程</span>
        </div>
        <div className="miles-value">
          等同現金價值 {formatPrice(cashValue)}
        </div>
      </div>
      
      <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>
            <Leaf size={16} /> 碳排放預估
          </div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
            {totalCO2} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>kg CO2</span>
          </div>
        </div>
        {isEcoTrip && (
          <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>
            ✨ 您選擇了低碳排放機型，為地球盡一份心力！
          </div>
        )}
      </div>

      <div className="miles-progress-container">
        <div className="miles-progress-header">
          <span>距離免費兌換機票</span>
          <span>{Math.round((totalMiles / 15000) * 100)}%</span>
        </div>
        <div className="vote-bar-track" style={{ background: 'rgba(0,0,0,0.3)', height: '10px' }}>
          <div className="vote-bar-fill" style={{ width: `${Math.min(100, (totalMiles / 15000) * 100)}%`, background: 'var(--warning)' }}></div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', textAlign: 'right' }}>
          目標: 15,000 哩程 (亞洲線來回)
        </div>
      </div>
    </div>
  );
}
