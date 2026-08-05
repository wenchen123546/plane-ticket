import { useState, useEffect } from 'react';
import { Plane, Compass, HelpCircle, DollarSign } from 'lucide-react';
import './App.css';
import Dashboard from './components/Dashboard';
import BudgetExplorer from './components/BudgetExplorer';
import UserGuideModal from './components/UserGuideModal';
import { useCurrency } from './context/CurrencyContext';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState('default');
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleWeather = (e) => {
      setWeatherCondition(e.detail || 'default');
    };
    window.addEventListener('weatherChanged', handleWeather);
    return () => window.removeEventListener('weatherChanged', handleWeather);
  }, []);

  // Compute background style based on weather
  const getBgStyle = () => {
    if (weatherCondition === 'rainy') return { background: 'linear-gradient(135deg, #1e293b, #334155)', transition: 'background 1s ease' };
    if (weatherCondition === 'snowy') return { background: 'linear-gradient(135deg, #0f172a, #e0f2fe)', transition: 'background 1s ease' };
    if (weatherCondition === 'sunny') return { background: 'linear-gradient(135deg, #451a03, #0f172a)', transition: 'background 1s ease' };
    return { transition: 'background 1s ease' };
  };

  return (
    <div className="app-container" style={getBgStyle()}>
      <header className="app-header animate-fade-in">
        <div className="header-logo">
          <Plane size={36} className="app-header-icon" style={{ transform: 'rotate(-45deg)' }} />
          <h1>FlightIQ 機票價格分析預測</h1>
        </div>
        
        <nav className="header-nav">
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0 0.5rem', marginRight: '0.5rem' }}>
            <DollarSign size={16} color="var(--text-secondary)" />
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', padding: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <option value="TWD">TWD 台幣</option>
              <option value="USD">USD 美金</option>
              <option value="EUR">EUR 歐元</option>
              <option value="JPY">JPY 日圓</option>
            </select>
          </div>
          <button 
            className="nav-btn"
            onClick={() => setIsGuideOpen(true)}
            style={{ color: 'var(--accent-secondary)' }}
          >
            <HelpCircle size={18} /> 使用指南
          </button>
          <button 
            className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Plane size={18} /> 精準搜尋
          </button>
          <button 
            className={`nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Compass size={18} /> 預算探索
          </button>
        </nav>
      </header>
      
      <main>
        {activeTab === 'search' ? <Dashboard /> : <BudgetExplorer />}
      </main>

      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}

export default App;
