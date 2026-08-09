import React, { useState } from 'react';
import { UserCircle, X, Shield, LogIn, UserPlus } from 'lucide-react';
import { login, register, syncData, getUserData } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authFunc = isLogin ? login : register;
      const res = await authFunc(username, password);
      
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // Success
      localStorage.setItem('nexus_token', res.token);
      localStorage.setItem('nexus_user', res.username);
      
      // Pull data from server
      const userData = await getUserData();
      if (userData) {
        if (userData.savedFlights && userData.savedFlights.length > 0) {
          localStorage.setItem('saved_flights', JSON.stringify(userData.savedFlights));
        }
        if (userData.passengerProfile && userData.passengerProfile.length > 0) {
          localStorage.setItem('passenger_profiles', JSON.stringify(userData.passengerProfile));
        }
        window.dispatchEvent(new Event('storage'));
      } else {
        // Sync local data to server if brand new account or no server data
        const localFlights = JSON.parse(localStorage.getItem('saved_flights') || '[]');
        const localProfiles = JSON.parse(localStorage.getItem('passenger_profiles') || '[]');
        await syncData(localFlights, localProfiles);
      }

      onLoginSuccess(res.username);
      onClose();
    } catch (err) {
      setError('連線失敗，請檢查網路狀態');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '2rem', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(59, 130, 246, 0.5)', boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}>
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
          <UserCircle size={24} /> {isLogin ? '會員登入' : '註冊新帳號'}
        </h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setIsLogin(true)} style={{ flex: 1, padding: '0.5rem', background: isLogin ? 'rgba(59,130,246,0.2)' : 'transparent', border: '1px solid ' + (isLogin ? '#3b82f6' : 'rgba(255,255,255,0.1)'), color: isLogin ? '#3b82f6' : 'white', borderRadius: '4px', cursor: 'pointer' }}>登入</button>
          <button onClick={() => setIsLogin(false)} style={{ flex: 1, padding: '0.5rem', background: !isLogin ? 'rgba(59,130,246,0.2)' : 'transparent', border: '1px solid ' + (!isLogin ? '#3b82f6' : 'rgba(255,255,255,0.1)'), color: !isLogin ? '#3b82f6' : 'white', borderRadius: '4px', cursor: 'pointer' }}>註冊</button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>帳號 (Username)</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="輸入您的帳號"
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>密碼 (Password)</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="輸入密碼"
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          <button type="submit" disabled={loading} className="search-btn" style={{ width: '100%', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {loading ? '處理中...' : (isLogin ? '登入並同步資料' : '註冊並建立雲端護照')}
          </button>
        </form>
      </div>
    </div>
  );
}
