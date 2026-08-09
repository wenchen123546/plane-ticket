import React, { useState } from 'react';
import FlightCard from './FlightCard';

export default function FlightList({ title, flights, selectedFlight, onSelectFlight, onInspectAircraft, onCheckout }) {
  const [sortBy, setSortBy] = useState('time'); // 'time' or 'price'

  const sortedFlights = [...(flights || [])].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    return String(a.departure.time).localeCompare(String(b.departure.time)); // Default sort by time
  });

  return (
    <div className="flight-list-container animate-fade-in">
      <div className="list-header">
        <h3>{title}</h3>
        <div className="sort-controls">
          <span className="sort-label">排序方式：</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="time">起飛時間 (早到晚)</option>
            <option value="price">價格 (低到高)</option>
          </select>
        </div>
      </div>

      <div className="flights-scroll-area">
        {sortedFlights.length > 0 ? (
          sortedFlights.map(flight => (
            <FlightCard 
              key={flight.id} 
              flight={flight} 
              isSelected={selectedFlight?.id === flight.id}
              onSelect={onSelectFlight}
              onInspectAircraft={onInspectAircraft}
              onCheckout={onCheckout}
            />
          ))
        ) : (
          <div className="no-flights">
            目前沒有符合條件的航班
          </div>
        )}
      </div>
    </div>
  );
}
