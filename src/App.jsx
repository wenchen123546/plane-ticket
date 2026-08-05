import { useState, useEffect } from 'react';
import { Plane, Compass, HelpCircle, DollarSign, Globe, UserCircle, Users, Heart, Shield, LogIn, LogOut, Database } from 'lucide-react';
import './App.css';
import Dashboard from './components/Dashboard';
import BudgetExplorer from './components/BudgetExplorer';
import UserGuideModal from './components/UserGuideModal';
import LoginModal from './components/LoginModal';
import PassengerProfile from './components/PassengerProfile';
import { useCurrency } from './context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { fetchAccountInfo } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState('default');
  const { currency, setCurrency } = useCurrency();
  const { i18n, t } = useTranslation();

  // Global Auth & Profile State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPassengerProfileOpen, setIsPassengerProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [savedFlights, setSavedFlights] = useState([]);

  useEffect(() => {
    // Load auth from local storage
    const token = localStorage.getItem('nexus_token');
    const user = localStorage.getItem('nexus_user');
    if (token && user) {
      setCurrentUser(user);
      loadAccountInfo();
    }
    // Load saved flights from local storage
    const saved = localStorage.getItem('nexus_saved_flights');
    if (saved) {
      try { setSavedFlights(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const loadAccountInfo = async () => {
    try {
      const data = await fetchAccountInfo();
      setAccountInfo(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setCurrentUser(null);
    setAccountInfo(null);
  };

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
          <h1>Nexus Flight <span className="highlight" style={{ fontSize: '0.8rem', verticalAlign: 'super', padding: '0.1rem 0.3rem', background: 'var(--accent-primary)', borderRadius: '4px' }}>PRO</span></h1>
        </div>
        
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          
          {/* Global Buttons */}
          <button className="nav-btn" onClick={() => setIsPassengerProfileOpen(true)} style={{ color: 'var(--text-secondary)' }}>
            <Users size={16} /> <span className="hide-on-mobile">{t('my_passport') || '護照'}</span>
          </button>
          
          <button className="nav-btn" onClick={() => setActiveTab('search')} style={{ color: 'var(--text-secondary)', position: 'relative' }}>
            <Heart size={16} /> 
            <span className="hide-on-mobile">{t('saved_flights') || '最愛'}</span>
            {savedFlights.length > 0 && <span className="nav-badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-primary)', fontSize: '10px', padding: '2px 5px', borderRadius: '10px', color: 'white' }}>{savedFlights.length}</span>}
          </button>

          <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 0.25rem' }}></div>

          {/* Auth Section */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.75rem', borderRadius: '4px' }}>
                <UserCircle size={16} />
                <span className="hide-on-mobile">{currentUser}</span>
              </div>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)} className="nav-btn" style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px' }}>
              <LogIn size={16} /> <span className="hide-on-mobile">{t('login_register') || '登入'}</span>
            </button>
          )}
          
          <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 0.25rem' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0 0.5rem' }}>
            <Globe size={16} color="var(--text-secondary)" />
            <select 
              value={i18n.language} 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', padding: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0 0.5rem' }}>
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
            <HelpCircle size={18} /> <span className="hide-on-mobile">使用指南</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Plane size={18} /> <span className="hide-on-mobile">精準搜尋</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Compass size={18} /> <span className="hide-on-mobile">預算探索</span>
          </button>
        </nav>
      </header>
      
      <main>
        {activeTab === 'search' ? (
          <Dashboard 
            savedFlights={savedFlights} 
            setSavedFlights={setSavedFlights} 
            currentUser={currentUser}
            accountInfo={accountInfo}
          />
        ) : (
          <BudgetExplorer />
        )}
      </main>

      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      
      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(username) => {
            setCurrentUser(username);
            loadAccountInfo();
          }}
        />
      )}
      
      {isPassengerProfileOpen && (
        <PassengerProfile 
          isOpen={isPassengerProfileOpen}
          onClose={() => setIsPassengerProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
