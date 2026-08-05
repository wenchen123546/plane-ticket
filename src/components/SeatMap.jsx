import React, { useState } from 'react';
import { X, User, CheckCircle, Shield } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function SeatMap({ flight, isOpen, onClose, onConfirm }) {
  const { formatPrice, rate } = useCurrency();
  const [selectedSeat, setSelectedSeat] = useState(null);

  if (!isOpen) return null;

  // Mock seat layout: 10 rows. 1-2 First class, 3-5 Premium, 6-10 Economy. Row 6 is Exit Row.
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);
  const seats = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Randomly make some seats unavailable based on flightNum
  const getSeatStatus = (row, seat) => {
    const seed = (flight.flightNum.charCodeAt(0) * row + seat.charCodeAt(0)) % 10;
    return seed < 3 ? 'unavailable' : 'available';
  };

  const getSeatClassAndPrice = (row) => {
    if (row <= 2) return { type: '頭等艙', price: 15000 * rate, color: '#f59e0b', bg: 'rgba(245,158,11,0.2)' }; // First
    if (row <= 5) return { type: '豪華經濟艙', price: 5000 * rate, color: '#8b5cf6', bg: 'rgba(139,92,246,0.2)' }; // Premium
    if (row === 6) return { type: '逃生口大空間', price: 2000 * rate, color: '#10b981', bg: 'rgba(16,185,129,0.2)' }; // Exit
    return { type: '標準經濟艙', price: 500 * rate, color: '#3b82f6', bg: 'rgba(59,130,246,0.2)' }; // Economy
  };

  const handleSeatClick = (row, seat, status, seatInfo) => {
    if (status === 'unavailable') return;
    const seatId = `${row}${seat}`;
    if (selectedSeat?.id === seatId) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat({ id: seatId, row, seat, ...seatInfo });
    }
  };

  const calculateTotal = () => {
    let total = flight.price;
    if (selectedSeat) total += selectedSeat.price;
    return total;
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', padding: '2rem', display: 'flex', gap: '2rem' }}>
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        {/* Left: Seat Map */}
        <div style={{ flex: 1, maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>✈️ 模擬劃位系統 ({flight.aircraft})</h2>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '40px 40px 10px 10px', border: '2px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>機頭方向</div>
            
            {rows.map(row => {
              const seatInfo = getSeatClassAndPrice(row);
              return (
                <div key={row} style={{ marginBottom: '1.5rem' }}>
                  {row === 1 && <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.5rem' }}>--- 頭等艙 ---</div>}
                  {row === 3 && <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#8b5cf6', marginBottom: '0.5rem', marginTop: '1rem' }}>--- 豪華經濟艙 ---</div>}
                  {row === 6 && <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#10b981', marginBottom: '0.5rem', marginTop: '1rem' }}>--- 逃生出口 (Exit Row) ---</div>}
                  
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Left Seats A, B, C */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {seats.slice(0, 3).map(seat => {
                        const status = getSeatStatus(row, seat);
                        const isSelected = selectedSeat?.id === `${row}${seat}`;
                        return (
                          <button
                            key={seat}
                            onClick={() => handleSeatClick(row, seat, status, seatInfo)}
                            style={{
                              width: '40px', height: '40px', borderRadius: '8px 8px 4px 4px',
                              display: 'flex', justifyContent: 'center', alignItems: 'center',
                              cursor: status === 'unavailable' ? 'not-allowed' : 'pointer',
                              border: isSelected ? `2px solid ${seatInfo.color}` : '1px solid rgba(255,255,255,0.2)',
                              background: status === 'unavailable' ? 'rgba(255,255,255,0.05)' : (isSelected ? seatInfo.color : seatInfo.bg),
                              color: status === 'unavailable' ? 'rgba(255,255,255,0.2)' : 'white',
                              transition: 'all 0.2s',
                              position: 'relative'
                            }}
                            title={`${row}${seat} - ${seatInfo.type}`}
                          >
                            {status === 'unavailable' ? <X size={16} /> : (isSelected ? <User size={18} /> : seat)}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div style={{ width: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{row}</div>
                    
                    {/* Right Seats D, E, F */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {seats.slice(3, 6).map(seat => {
                        const status = getSeatStatus(row, seat);
                        const isSelected = selectedSeat?.id === `${row}${seat}`;
                        return (
                          <button
                            key={seat}
                            onClick={() => handleSeatClick(row, seat, status, seatInfo)}
                            style={{
                              width: '40px', height: '40px', borderRadius: '8px 8px 4px 4px',
                              display: 'flex', justifyContent: 'center', alignItems: 'center',
                              cursor: status === 'unavailable' ? 'not-allowed' : 'pointer',
                              border: isSelected ? `2px solid ${seatInfo.color}` : '1px solid rgba(255,255,255,0.2)',
                              background: status === 'unavailable' ? 'rgba(255,255,255,0.05)' : (isSelected ? seatInfo.color : seatInfo.bg),
                              color: status === 'unavailable' ? 'rgba(255,255,255,0.2)' : 'white',
                              transition: 'all 0.2s'
                            }}
                            title={`${row}${seat} - ${seatInfo.type}`}
                          >
                            {status === 'unavailable' ? <X size={16} /> : (isSelected ? <User size={18} /> : seat)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Summary Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>票價明細</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>基本票價 ({flight.airline})</span>
              <span>{formatPrice(flight.price)}</span>
            </div>
            
            {selectedSeat ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: selectedSeat.color }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} /> 
                  劃位費 ({selectedSeat.id} - {selectedSeat.type})
                </span>
                <span>+ {formatPrice(selectedSeat.price)}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.85rem', marginBottom: '1rem', background: 'rgba(251,191,36,0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                <Shield size={16} /> 請由左側點選空位進行劃位，或是跳過劃位由系統隨機安排。
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>總金額</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
          
          <button 
            className="search-btn"
            style={{ padding: '1rem', fontSize: '1.1rem', background: 'var(--accent-primary)', fontWeight: 'bold' }}
            onClick={() => onConfirm(calculateTotal(), selectedSeat)}
          >
            確認選位並前往結帳 ↗
          </button>
        </div>
      </div>
    </div>
  );
}
