import React, { useState, useEffect } from 'react';
import { UserPlus, Copy, Trash2, CheckCircle2 } from 'lucide-react';

export default function PassengerProfile({ isOpen, onClose }) {
  const [passengers, setPassengers] = useState([]);
  const [name, setName] = useState('');
  const [passport, setPassport] = useState('');
  const [expiry, setExpiry] = useState('');
  const [ffp, setFfp] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('flight_passengers');
    if (saved) {
      setPassengers(JSON.parse(saved));
    }
  }, []);

  const savePassengers = (newPass) => {
    setPassengers(newPass);
    localStorage.setItem('flight_passengers', JSON.stringify(newPass));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !passport) return;
    const newP = { id: Date.now(), name, passport, expiry, ffp };
    savePassengers([...passengers, newP]);
    setName(''); setPassport(''); setExpiry(''); setFfp('');
  };

  const handleDelete = (id) => {
    savePassengers(passengers.filter(p => p.id !== id));
  };

  const handleCopy = (p) => {
    const text = `姓名: ${p.name}\n護照號碼: ${p.passport}\n效期: ${p.expiry}\n常客卡號: ${p.ffp}`;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="modal-content glass-panel animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
          <UserPlus size={24} /> 旅客護照管理 (Passenger Profiles)
        </h2>
        
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>英文姓名 (如 WANG/XIAO MING)</label>
            <input required value={name} onChange={e => setName(e.target.value.toUpperCase())} style={inputStyle} placeholder="WANG/XIAO MING" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>護照號碼 (Passport No.)</label>
            <input required value={passport} onChange={e => setPassport(e.target.value.toUpperCase())} style={inputStyle} placeholder="31XXXXXXX" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>護照效期 (Expiry Date)</label>
            <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>常客會員號碼 (選填)</label>
            <input value={ffp} onChange={e => setFfp(e.target.value.toUpperCase())} style={inputStyle} placeholder="BR 123456789" />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="search-btn" style={{ margin: 0, padding: '0.5rem 1.5rem' }}>新增旅客</button>
          </div>
        </form>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>已儲存名單 ({passengers.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {passengers.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span>🪪 {p.passport}</span>
                  <span>📅 {p.expiry || '未填寫'}</span>
                  {p.ffp && <span style={{ gridColumn: '1 / -1' }}>🎖️ {p.ffp}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleCopy(p)}
                  style={{ background: copiedId === p.id ? 'var(--success)' : 'rgba(59, 130, 246, 0.2)', color: copiedId === p.id ? 'white' : '#3b82f6', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                  title="一鍵複製所有資訊"
                >
                  {copiedId === p.id ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {passengers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              尚未儲存任何旅客資訊
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--glass-border)',
  background: 'rgba(0,0,0,0.3)',
  color: 'white',
  outline: 'none'
};
