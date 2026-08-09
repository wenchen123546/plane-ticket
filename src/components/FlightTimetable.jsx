import React, { useState, useEffect } from 'react';
import { Clock, PlaneTakeoff } from 'lucide-react';
import { airports } from '../data/airports';

const airlines = ['長榮航空', '中華航空', '星宇航空', '國泰航空', '日本航空', '全日空', '新加坡航空', '阿聯酋航空', '聯合航空', '達美航空', '台灣虎航', '樂桃航空'];

const generateTimetable = () => {
  const table = [];
  const now = new Date();
  
  for (let i = 0; i < 8; i++) {
    const dest = airports[Math.floor(Math.random() * airports.length)];
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNum = `${airline.substring(0, 2)}${Math.floor(Math.random() * 800) + 100}`;
    
    const time = new Date(now);
    time.setMinutes(time.getMinutes() + (i * 15) + Math.floor(Math.random() * 20));
    
    // Status probability
    let status = 'ON TIME';
    const rand = Math.random();
    if (i < 2) {
       status = rand > 0.5 ? 'BOARDING' : 'FINAL CALL';
    } else if (i === 2) {
       status = rand > 0.3 ? 'DELAYED' : 'GATE CLOSED';
    } else {
       status = rand > 0.8 ? 'DELAYED' : 'ON TIME';
    }

    table.push({
      id: `tt-${i}-${Math.random()}`,
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      dest: dest.label.split(' (')[0],
      airline,
      flightNum,
      gate: `${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}${Math.floor(Math.random() * 20) + 1}`,
      status
    });
  }
  return table.sort((a, b) => a.time.localeCompare(b.time));
};

export default function FlightTimetable({ originAirport }) {
  const [flights, setFlights] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    setFlights(generateTimetable());

    // Randomly update status to simulate live data
    const interval = setInterval(() => {
      setFlights(current => {
        const updated = [...current];
        const randomIdx = Math.floor(Math.random() * updated.length);
        const flight = { ...updated[randomIdx] };
        
        if (flight.status === 'ON TIME') flight.status = 'BOARDING';
        else if (flight.status === 'BOARDING') flight.status = 'FINAL CALL';
        else if (flight.status === 'FINAL CALL') flight.status = 'GATE CLOSED';
        else if (flight.status === 'DELAYED') flight.status = 'ON TIME';
        
        updated[randomIdx] = flight;
        return updated;
      });
    }, 5000); // Change one flight status every 5 seconds for visual activity

    return () => clearInterval(interval);
  }, [originAirport]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'ON TIME': return '#10b981'; // Green
      case 'BOARDING': return '#f59e0b'; // Amber
      case 'FINAL CALL': return '#ef4444'; // Red Flash
      case 'DELAYED': return '#ef4444'; // Red
      case 'GATE CLOSED': return '#6b7280'; // Gray
      default: return '#facc15';
    }
  };

  return (
    <div className="timetable-container glass-panel animate-fade-in" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', background: '#0a0a0a', border: '2px solid #222' }}>
      <div className="timetable-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PlaneTakeoff size={20} style={{ color: '#facc15' }} />
          <h3 style={{ margin: 0, color: '#facc15', letterSpacing: '2px', fontFamily: 'monospace', fontSize: '1.25rem' }}>DEPARTURES / 即時離境航班</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#888', fontFamily: 'monospace' }}>
          <Clock size={16} />
          <span>LOCAL TIME {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
        </div>
      </div>
      
      <div className="timetable-board" style={{ padding: '0.5rem' }}>
        <div className="timetable-row header-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 0.5fr 1.5fr', padding: '0.5rem 1rem', color: '#666', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
          <div>TIME</div>
          <div>DESTINATION</div>
          <div>FLIGHT</div>
          <div>GATE</div>
          <div>STATUS</div>
        </div>
        
        {flights.map((f, i) => (
          <div key={f.id} className="timetable-row data-row" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 2fr 1.5fr 0.5fr 1.5fr', 
            padding: '0.75rem 1rem', 
            borderBottom: '1px solid #1a1a1a',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '1.1rem',
            fontWeight: 'bold',
            animation: `fadeIn 0.5s ease-out forwards`,
            animationDelay: `${i * 0.1}s`,
            opacity: 0
          }}>
            <div style={{ color: '#facc15' }}>{f.time}</div>
            <div style={{ color: '#e5e7eb' }}>{f.dest}</div>
            <div style={{ color: '#facc15' }}>{f.flightNum}</div>
            <div style={{ color: '#e5e7eb' }}>{f.gate}</div>
            <div style={{ 
              color: getStatusColor(f.status),
              animation: f.status === 'FINAL CALL' ? 'pulse-fast 1s infinite' : 'none'
            }}>
              {f.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
