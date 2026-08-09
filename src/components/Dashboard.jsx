import { useState, useEffect } from 'react';
import FlightSearch from './FlightSearch';
import PriceChart from './PriceChart';
import FlightList from './FlightList';
import IntelligencePanel from './IntelligencePanel';
import DateMatrix from './DateMatrix';
import PriceCalendar from './PriceCalendar';
import TicketClassSwitcher from './TicketClassSwitcher';
import PriceRadarList from './PriceRadarList';
import WeatherPackingPanel from './WeatherPackingPanel';
import ItineraryModal from './ItineraryModal';
import GroupVoteModal from './GroupVoteModal';
import MileageCalculator from './MileageCalculator';
import VirtualSeatMap from './VirtualSeatMap';
import VIPUpsellModal from './VIPUpsellModal';
import AircraftInspectorModal from './AircraftInspectorModal';
import AircraftReviewsPanel from './AircraftReviewsPanel';
import FlightTimetable from './FlightTimetable';
import SeatMap from './SeatMap';
import { useCurrency } from '../context/CurrencyContext';
import { generatePriceData, generatePriceMatrix } from '../services/mockData';
import { fetchRealFlights, syncData } from '../services/api';
import { Bell, Users, Map, CreditCard, Heart, Plane, CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FlightStatusModal from './FlightStatusModal';
import CheckInModal from './CheckInModal';

export default function Dashboard({ savedFlights, setSavedFlights, currentUser, accountInfo }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  
  // States for Flight Lists
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [inboundFlights, setInboundFlights] = useState([]);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedInbound, setSelectedInbound] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [ticketClass, setTicketClass] = useState('light');
  const [matrixData, setMatrixData] = useState([]);
  const [currentMatrixAvg, setCurrentMatrixAvg] = useState(15000);
  const [trackedRoutes, setTrackedRoutes] = useState([]);
  const [currentSearch, setCurrentSearch] = useState(null);
  
  const { formatPrice } = useCurrency();
  
  // Modals state
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [checkoutFlight, setCheckoutFlight] = useState(null);
  const [isGroupVoteOpen, setIsGroupVoteOpen] = useState(false);
  const [isVirtualSeatMapOpen, setIsVirtualSeatMapOpen] = useState(false);
  const [isCheckoutSeatMapOpen, setIsCheckoutSeatMapOpen] = useState(false);
  const [isVIPOpen, setIsVIPOpen] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeTargetPrice, setSubscribeTargetPrice] = useState(10000);
  const [checkoutSeat, setCheckoutSeat] = useState(null);
  const [inspectorAircraft, setInspectorAircraft] = useState(null);
  const [statusFlightNum, setStatusFlightNum] = useState(null);
  const [checkInFlightNum, setCheckInFlightNum] = useState(null);

  // (Moved loadAccountInfo to App.jsx)

  // Load saved flights on mount
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('saved_flights');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedFlights(parsed);
          if (localStorage.getItem('nexus_token')) {
            const profiles = JSON.parse(localStorage.getItem('passenger_profiles') || '[]');
            syncData(parsed, profiles).catch(err => console.error(err));
          }
        } catch (e) {
          console.error('Failed to parse storage data', e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    const saved = localStorage.getItem('saved_flights');
    if (saved) {
      try {
        setSavedFlights(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);
  
  // State for old PriceChart (moved to sidebar)
  const [priceData, setPriceData] = useState([]);

  const fetchAnalysis = async (searchParams = null) => {
    setLoading(true);
    
    const origin = searchParams?.origin || 'TPE';
    const destination = searchParams?.destination || 'NRT';
    const depTime = searchParams?.depTime || new Date().toISOString();
    const retTime = searchParams?.retTime || new Date(Date.now() + 86400000 * 5).toISOString();
    const currentPassengers = searchParams?.passengers || 1;
    const directOnly = searchParams?.directOnly || false;
    const preferredAirline = searchParams?.preferredAirline || null;
    
    setPassengers(currentPassengers);
    
    try {
      // Fetch outbound flights
      const outFlights = await fetchRealFlights(origin, destination, depTime, false, directOnly, preferredAirline, currentPassengers);
      // Fetch inbound flights
      const inFlights = await fetchRealFlights(destination, origin, retTime, true, directOnly, preferredAirline, currentPassengers);
      
      setOutboundFlights(outFlights);
      setInboundFlights(inFlights);
      setSelectedOutbound(null);
      setSelectedInbound(null);
      
      const matrix = generatePriceMatrix(depTime);
      setMatrixData(matrix);
      const avg = Math.floor(matrix.reduce((sum, d) => sum + d.price, 0) / matrix.length);
      setCurrentMatrixAvg(avg);
      
      setCurrentSearch({ origin, destination, depTime, originLabel: searchParams?.originLabel, destinationLabel: searchParams?.destinationLabel });
      
      const mockData = generatePriceData(30);
      setPriceData(mockData);
      
    } catch (error) {
      console.error("Failed to fetch analysis", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleSearch = (searchParams) => {
    fetchAnalysis(searchParams);
  };

  const handleTrackPrice = () => {
    if (!currentSearch) return;
    setSubscribeTargetPrice(Math.floor(currentMatrixAvg * 0.8)); // Default target 20% off
    setShowSubscribeModal(true);
  };

  const submitSubscription = async () => {
    try {
      // Dummy call
      alert('✅ 成功訂閱降價通知！當票價低於您的目標價格時，我們將發送 Email 通知您。');
      
      // Also add to local tracked routes for the radar list UI
      if (!trackedRoutes.find(r => r.id === `${currentSearch.origin}-${currentSearch.destination}`)) {
        const newTrack = {
          id: `${currentSearch.origin}-${currentSearch.destination}`,
          origin: currentSearch.origin,
          dest: currentSearch.destination,
          date: new Date().toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }),
          currentPrice: currentMatrixAvg,
          delta: Math.floor(Math.random() * 2000) - 1000
        };
        setTrackedRoutes([...trackedRoutes, newTrack]);
      }
      setShowSubscribeModal(false);
    } catch (error) {
      console.error(error);
      alert('❌ 訂閱失敗，請檢查伺服器是否運行。');
    }
  };

  // Helper to adjust price based on class
  const getClassMultiplier = (cls) => {
    if (cls === 'standard') return 1.2;
    if (cls === 'business') return 2.5;
    return 1.0;
  };

  const currentMultiplier = getClassMultiplier(ticketClass);

  // (Moved handleLogout to App.jsx)

  return (
    <>
      <div className="dashboard-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {t('search_flights')} <Sparkles className="icon-pulse" color="var(--accent-primary)" />
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Find your next cyberpunk destination</p>
        </div>
        {accountInfo && accountInfo.plan_searches_left !== undefined && (
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>剩餘免費搜尋次數 (API)</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
              {accountInfo.plan_searches_left} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>次</span>
            </span>
          </div>
        )}
      </div>

      <div className="dashboard-top-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <FlightSearch onSearch={handleSearch} />
        
        {!loading && savedFlights.length > 0 && (
          <div style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={18} color="#ef4444" /> 我的最愛航班 ({savedFlights.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {savedFlights.map((f, i) => (
                <div key={i} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{f.airline} {f.flightNum}</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{formatPrice(f.price)}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {f.origin} → {f.destination}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => setStatusFlightNum(`${f.airline}${f.flightNum}`)} style={{ flex: 1, padding: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <Plane size={14} /> {t('flight_status') || '動態'}
                    </button>
                    <button onClick={() => setCheckInFlightNum(`${f.airline}${f.flightNum}`)} style={{ flex: 1, padding: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <CheckCircle size={14} /> {t('check_in') || '報到'}
                    </button>
                  </div>
                  {f.bookingLink && (
                    <button 
                      onClick={() => window.open(f.bookingLink, '_blank')}
                      style={{ marginTop: '0.5rem', width: '100%', padding: '0.25rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      前往購票
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="glass-panel" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
          搜尋符合條件的航班中...
        </div>
      ) : (
          <>
            <div className="dashboard-controls" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <TicketClassSwitcher currentClass={ticketClass} onChangeClass={setTicketClass} />
              
              <button 
                onClick={handleTrackPrice}
                className="search-btn" 
                style={{ margin: 0, padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}
              >
                <Bell size={18} />
                追蹤此航線降價
              </button>
            </div>
            
            {currentSearch && (
              <div style={{ marginBottom: '1.5rem' }}>
                <WeatherPackingPanel destination={currentSearch.destination} />
              </div>
            )}

            <div className="dashboard-top-panels">
              <IntelligencePanel 
                currentPrice={Math.floor((matrixData.find(d => d.offset === 0)?.price || 15000) * currentMultiplier)} 
                historyAvg={Math.floor(currentMatrixAvg * currentMultiplier)} 
              />
              <DateMatrix matrixData={matrixData.map(d => ({...d, price: Math.floor(d.price * currentMultiplier)}))} />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <PriceCalendar 
                basePrice={Math.floor(currentMatrixAvg * currentMultiplier)}
                multiplier={currentMultiplier}
                currentDate={currentSearch?.depTime || new Date().toISOString()}
              />
            </div>

            <div className="main-dashboard">
              <div className="dashboard-content left-column">
                <FlightTimetable originAirport={currentSearch?.originLabel || currentSearch?.origin || '未知出發地'} />

            <FlightList 
              title="✈️ 去程航班清單" 
              flights={outboundFlights.map(f => ({...f, price: Math.floor(f.price * currentMultiplier)}))} 
              selectedFlight={selectedOutbound}
              onSelectFlight={setSelectedOutbound}
              onInspectAircraft={setInspectorAircraft}
              onCheckout={(f) => {
                setCheckoutFlight(f);
                setIsCheckoutSeatMapOpen(true);
              }}
            />
            
            <FlightList 
              title="🛬 回程航班清單" 
              flights={inboundFlights.map(f => ({...f, price: Math.floor(f.price * currentMultiplier)}))} 
              selectedFlight={selectedInbound}
              onSelectFlight={setSelectedInbound}
              onInspectAircraft={setInspectorAircraft}
            />
            
            {(selectedOutbound || selectedInbound) && (
               <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)', marginTop: '1rem' }}>
                  <div>
                     <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>已選擇的航班組合</h3>
                     <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                       {selectedOutbound && <span>去程：{selectedOutbound.airline} {selectedOutbound.flightNum}</span>}
                       {selectedOutbound && selectedInbound && <span style={{ margin: '0 0.5rem' }}>|</span>}
                       {selectedInbound && <span>回程：{selectedInbound.airline} {selectedInbound.flightNum}</span>}
                     </div>
                     <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.25rem' }}>
                       總價：{formatPrice(((selectedOutbound?.price || 0) + (selectedInbound?.price || 0)) * currentMultiplier * passengers)} 
                       <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', fontWeight: 'normal' }}>
                         ({passengers} 位旅客 · {ticketClass === 'light' ? '無托運' : ticketClass === 'standard' ? '標準托運' : '商務尊榮'})
                       </span>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button 
                      className="search-btn" 
                      onClick={() => setIsGroupVoteOpen(true)}
                      style={{ margin: 0, padding: '0.75rem 1.5rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Users size={18} /> 發起揪團投票
                    </button>
                    <button 
                      className="search-btn" 
                      onClick={() => setIsItineraryOpen(true)}
                      style={{ margin: 0, padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}
                    >
                      <Map size={18} /> AI 智能規劃行程
                    </button>
                    <button 
                      className="search-btn" 
                      onClick={() => setIsVirtualSeatMapOpen(true)}
                      style={{ margin: 0, padding: '0.75rem 2rem', background: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}
                    >
                      <CreditCard size={18} /> 前往劃位與結帳
                    </button>
                  </div>
               </div>
            )}
            </div> {/* end left-column */}
            
            <div className="dashboard-content right-column">
              <div style={{ marginBottom: '1.5rem' }}>
                <PriceRadarList trackedRoutes={trackedRoutes} />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <MileageCalculator outbound={selectedOutbound} inbound={selectedInbound} ticketClass={ticketClass} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <AircraftReviewsPanel />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>未來 30 天價格趨勢</h3>
                <PriceChart data={priceData} />
              </div>
            </div> {/* end right-column */}
          </div> {/* end main-dashboard */}
        </>
      )}
      
    <ItineraryModal 
        isOpen={isItineraryOpen} 
        onClose={() => setIsItineraryOpen(false)} 
        destination={currentSearch?.destination}
        flight={selectedOutbound}
      />
      
      <GroupVoteModal 
        isOpen={isGroupVoteOpen} 
        onClose={() => setIsGroupVoteOpen(false)} 
        totalPrice={((selectedOutbound?.price || 0) + (selectedInbound?.price || 0)) * currentMultiplier * passengers}
        passengers={passengers}
      />

      <VirtualSeatMap
        isOpen={isVirtualSeatMapOpen}
        onClose={() => setIsVirtualSeatMapOpen(false)}
        ticketClass={ticketClass}
        onConfirm={(seat) => {
          setCheckoutSeat(seat);
          setIsVirtualSeatMapOpen(false);
          setTimeout(() => setIsVIPOpen(true), 300);
        }}
      />

      {isVIPOpen && (
        <VIPUpsellModal onClose={() => setIsVIPOpen(false)} onFinish={(fastTrack, lounge) => {
          setIsVIPOpen(false);
          const basePrice = ((selectedOutbound?.price || 0) + (selectedInbound?.price || 0)) * currentMultiplier * passengers;
          const addons = (fastTrack ? 800 : 0) + (lounge ? 1200 : 0);
          const total = basePrice + addons;
          alert(`準備導向第三方金流系統...\n\n劃位座號: ${checkoutSeat}\n機票總價: ${formatPrice(basePrice)}\n加值服務: ${formatPrice(addons)}\n\n最終應付總額: ${formatPrice(total)}`);
          setIsVirtualSeatMapOpen(false);
        }} />
      )}

      <AircraftInspectorModal 
        isOpen={!!inspectorAircraft}
        onClose={() => setInspectorAircraft(null)}
        aircraft={inspectorAircraft}
      />
      
      {/* Price Alert Subscription Modal */}
      {showSubscribeModal && (
        <div className="modal-overlay" onClick={() => setShowSubscribeModal(false)} style={{ zIndex: 10000 }}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
              <Bell size={24} /> 訂閱降價通知
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>通知信箱 (Email)</label>
              <input 
                type="email" 
                value={subscribeEmail} 
                onChange={e => setSubscribeEmail(e.target.value)} 
                placeholder="輸入您的 Email"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>目標票價低於</label>
              <input 
                type="number" 
                value={subscribeTargetPrice} 
                onChange={e => setSubscribeTargetPrice(e.target.value)} 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSubscribeModal(false)} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>取消</button>
              <button onClick={submitSubscription} className="search-btn" style={{ margin: 0 }}>確認訂閱</button>
            </div>
          </div>
        </div>
      )}
      


      {statusFlightNum && (
        <FlightStatusModal flightNum={statusFlightNum} onClose={() => setStatusFlightNum(null)} />
      )}

      {checkInFlightNum && (
        <CheckInModal flightNum={checkInFlightNum} passenger={currentUser || 'GUEST'} onClose={() => setCheckInFlightNum(null)} />
      )}

      {checkoutFlight && (
        <SeatMap 
          flight={checkoutFlight}
          isOpen={isCheckoutSeatMapOpen}
          onClose={() => setIsCheckoutSeatMapOpen(false)}
          onConfirm={(totalPrice, selectedSeat) => {
            alert(`結帳成功！您已預訂 ${checkoutFlight.airline} 航班。\n${selectedSeat ? `座位: ${selectedSeat.id} (${selectedSeat.type})` : '系統隨機安排座位'}\n總價: ${formatPrice(totalPrice)}`);
            setIsCheckoutSeatMapOpen(false);
          }}
        />
      )}
    </>
  );
}
