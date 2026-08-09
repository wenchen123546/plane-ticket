import React, { useState, useMemo } from 'react';
import { X, Maximize2 } from 'lucide-react';

export default function VirtualSeatMap({ isOpen, onClose, onConfirm, ticketClass }) {
  const [selectedSeat, setSelectedSeat] = useState(null);

  if (!isOpen) return null;

  const rows = ticketClass === 'business' ? 4 : 10;
  const cols = ticketClass === 'business' ? ['A', 'C', 'D', 'F'] : ['A', 'B', 'C', 'D', 'E', 'F'];

  const occupiedSeats = useMemo(() => {
    const occupied = new Set();
    for (let r = 0; r < (ticketClass === 'business' ? 4 : 10); r++) {
      const columns = ticketClass === 'business' ? ['A', 'C', 'D', 'F'] : ['A', 'B', 'C', 'D', 'E', 'F'];
      for (const c of columns) {
        if (Math.random() > 0.7) occupied.add(`${r + 1}${c}`);
      }
    }
    return occupied;
  }, [ticketClass]);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content seat-map-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X /></button>
        
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Maximize2 size={24} color="var(--accent-primary)" /> 沉浸式機艙選位</h2>
          <p style={{ color: 'var(--text-secondary)' }}>為您呈獻 {ticketClass === 'business' ? '商務尊榮艙' : '標準客艙'} 虛擬平面圖</p>
        </div>

        <div className="airplane-fuselage">
          <div className="cockpit-nose"></div>
          
          <div className="cabin-section">
            <div className="seat-grid-container">
              {Array.from({ length: rows }).map((_, rIndex) => (
                <div key={rIndex} className="seat-row">
                  <div className="row-number">{rIndex + 1}</div>
                  <div className="seat-group left">
                    {cols.slice(0, cols.length / 2).map(c => {
                      const id = `${rIndex + 1}${c}`;
                      const isSelected = selectedSeat === id;
                      const isOccupied = occupiedSeats.has(id); // Mock occupied
                      return (
                        <button 
                          key={c}
                          disabled={isOccupied}
                          className={`seat-btn ${ticketClass} ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                          onClick={() => setSelectedSeat(id)}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  <div className="aisle"></div>
                  <div className="seat-group right">
                    {cols.slice(cols.length / 2).map(c => {
                      const id = `${rIndex + 1}${c}`;
                      const isSelected = selectedSeat === id;
                      const isOccupied = occupiedSeats.has(id);
                      return (
                        <button 
                          key={c}
                          disabled={isOccupied}
                          className={`seat-btn ${ticketClass} ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                          onClick={() => setSelectedSeat(id)}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="seat-legend">
          <div className="legend-item"><div className={`seat-btn dummy ${ticketClass}`}></div> 可選座位</div>
          <div className="legend-item"><div className={`seat-btn dummy ${ticketClass} occupied`}></div> 已佔用</div>
          <div className="legend-item"><div className={`seat-btn dummy ${ticketClass} selected`}></div> 目前選擇</div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>您選擇的座位：</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', marginLeft: '0.5rem' }}>{selectedSeat || '尚未選擇'}</strong>
          </div>
          <button 
            className="search-btn" 
            style={{ margin: 0 }} 
            disabled={!selectedSeat}
            onClick={() => onConfirm(selectedSeat)}
          >
            確認座位並繼續
          </button>
        </div>
      </div>
    </div>
  );
}
