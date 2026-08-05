import React, { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, Plane } from 'lucide-react';
import Select from 'react-select';
import { airports } from '../data/airports';
import { airlines } from '../services/mockData';
import { useTranslation } from 'react-i18next';

// Custom styles for react-select to match our glassmorphism theme
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: state.isFocused ? 'var(--accent-primary)' : 'var(--glass-border)',
    boxShadow: state.isFocused ? '0 0 0 2px var(--accent-glow)' : 'none',
    padding: '0.25rem 0.25rem 0.25rem 2.25rem',
    borderRadius: '8px',
    cursor: 'text',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.3)'
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    boxShadow: 'var(--glass-shadow)',
    zIndex: 9999
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'var(--accent-primary)' 
      : state.isFocused 
        ? 'rgba(59, 130, 246, 0.2)' 
        : 'transparent',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'var(--accent-secondary)'
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-primary)'
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--text-primary)'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--text-secondary)'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'var(--text-secondary)',
    '&:hover': {
      color: 'var(--text-primary)'
    }
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 })
};

export default function FlightSearch({ onSearch }) {
  const { t } = useTranslation();
  // Find sensible defaults from the massive list
  const defaultOrigin = airports.find(a => a.value === 'TPE') || airports[0];
  const defaultDest = airports.find(a => a.value === 'NRT') || airports[1];
  
  // Trip Type State
  const [tripType, setTripType] = useState('round-trip');
  const [multiCityLegs, setMultiCityLegs] = useState([
    { origin: null, destination: null, outDate: '' },
    { origin: null, destination: null, outDate: '' }
  ]);

  // Main search state
  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(defaultDest);
  const [outDate, setOutDate] = useState(`${new Date().toISOString().split('T')[0]}`);
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [directOnly, setDirectOnly] = useState(false);
  const [preferredAirline, setPreferredAirline] = useState(null);
  
  // Cascading state for origin
  const [originContinent, setOriginContinent] = useState(null);
  const [originCountry, setOriginCountry] = useState(null);

  // Cascading state for destination
  const [destContinent, setDestContinent] = useState(null);
  const [destCountry, setDestCountry] = useState(null);
  
  // State for manual input filtering to prevent browser freeze
  const [originInput, setOriginInput] = useState('');
  const [destInput, setDestInput] = useState('');

  // Continents mapping
  const continentMap = {
    '台灣': '亞洲 (Asia)', '日本': '亞洲 (Asia)', '韓國': '亞洲 (Asia)',
    '中國香港': '亞洲 (Asia)', '中國澳門': '亞洲 (Asia)', '新加坡': '亞洲 (Asia)',
    '泰國': '亞洲 (Asia)', '馬來西亞': '亞洲 (Asia)', '越南': '亞洲 (Asia)',
    '菲律賓': '亞洲 (Asia)', '印尼': '亞洲 (Asia)', '中國': '亞洲 (Asia)',
    '印度': '亞洲 (Asia)', '斯里蘭卡': '亞洲 (Asia)', '馬爾地夫': '亞洲 (Asia)',
    '巴基斯坦': '亞洲 (Asia)', '孟加拉': '亞洲 (Asia)', '緬甸': '亞洲 (Asia)', '柬埔寨': '亞洲 (Asia)',
    '汶萊': '亞洲 (Asia)', '哈薩克': '亞洲 (Asia)', '烏茲別克': '亞洲 (Asia)', '吉爾吉斯': '亞洲 (Asia)', '塔吉克': '亞洲 (Asia)', '土庫曼': '亞洲 (Asia)', '尼泊爾': '亞洲 (Asia)', '寮國': '亞洲 (Asia)',
    '美國': '北美洲 (North America)', '加拿大': '北美洲 (North America)',
    '墨西哥': '中美洲與加勒比海 (Central America & Caribbean)', '古巴': '中美洲與加勒比海 (Central America & Caribbean)',
    '巴拿馬': '中美洲與加勒比海 (Central America & Caribbean)', '哥斯大黎加': '中美洲與加勒比海 (Central America & Caribbean)', '薩爾瓦多': '中美洲與加勒比海 (Central America & Caribbean)', '瓜地馬拉': '中美洲與加勒比海 (Central America & Caribbean)',
    '巴西': '南美洲 (South America)', '阿根廷': '南美洲 (South America)', '智利': '南美洲 (South America)',
    '秘魯': '南美洲 (South America)', '哥倫比亞': '南美洲 (South America)', '委內瑞拉': '南美洲 (South America)', '玻利維亞': '南美洲 (South America)', '烏拉圭': '南美洲 (South America)', '巴拉圭': '南美洲 (South America)', '厄瓜多': '南美洲 (South America)',
    '南非': '非洲 (Africa)', '埃及': '非洲 (Africa)', '摩洛哥': '非洲 (Africa)',
    '衣索比亞': '非洲 (Africa)', '肯亞': '非洲 (Africa)', '阿爾及利亞': '非洲 (Africa)', '突尼西亞': '非洲 (Africa)', '利比亞': '非洲 (Africa)', '蘇丹': '非洲 (Africa)', '塞內加爾': '非洲 (Africa)', '迦納': '非洲 (Africa)', '象牙海岸': '非洲 (Africa)', '剛果': '非洲 (Africa)', '剛果民主共和國': '非洲 (Africa)', '奈及利亞': '非洲 (Africa)', '安哥拉': '非洲 (Africa)', '坦尚尼亞': '非洲 (Africa)', '烏干達': '非洲 (Africa)', '盧安達': '非洲 (Africa)', '辛巴威': '非洲 (Africa)', '尚比亞': '非洲 (Africa)', '莫三比克': '非洲 (Africa)', '馬達加斯加': '非洲 (Africa)', '模里西斯': '非洲 (Africa)',
    '英國': '歐洲 (Europe)', '法國': '歐洲 (Europe)', '德國': '歐洲 (Europe)',
    '荷蘭': '歐洲 (Europe)', '西班牙': '歐洲 (Europe)', '義大利': '歐洲 (Europe)', '土耳其': '歐洲 (Europe)',
    '瑞士': '歐洲 (Europe)', '奧地利': '歐洲 (Europe)', '捷克': '歐洲 (Europe)', '希臘': '歐洲 (Europe)',
    '芬蘭': '歐洲 (Europe)', '丹麥': '歐洲 (Europe)', '瑞典': '歐洲 (Europe)', '挪威': '歐洲 (Europe)', '冰島': '歐洲 (Europe)',
    '葡萄牙': '歐洲 (Europe)', '愛爾蘭': '歐洲 (Europe)', '比利時': '歐洲 (Europe)', '波蘭': '歐洲 (Europe)',
    '匈牙利': '歐洲 (Europe)', '羅馬尼亞': '歐洲 (Europe)', '俄羅斯': '歐洲 (Europe)', '保加利亞': '歐洲 (Europe)', '塞爾維亞': '歐洲 (Europe)', '克羅埃西亞': '歐洲 (Europe)', '斯洛維尼亞': '歐洲 (Europe)', '白俄羅斯': '歐洲 (Europe)', '烏克蘭': '歐洲 (Europe)',
    '阿聯酋': '中東 (Middle East)', '卡達': '中東 (Middle East)', '沙烏地阿拉伯': '中東 (Middle East)',
    '以色列': '中東 (Middle East)', '伊朗': '中東 (Middle East)', '阿富汗': '中東 (Middle East)', '亞塞拜然': '中東 (Middle East)', '喬治亞': '中東 (Middle East)', '亞美尼亞': '中東 (Middle East)', '伊拉克': '中東 (Middle East)', '葉門': '中東 (Middle East)', '阿曼': '中東 (Middle East)', '科威特': '中東 (Middle East)', '巴林': '中東 (Middle East)', '約旦': '中東 (Middle East)', '黎巴嫩': '中東 (Middle East)',
    '澳洲': '大洋洲 (Oceania)', '紐西蘭': '大洋洲 (Oceania)', '斐濟': '大洋洲 (Oceania)', '關島': '大洋洲 (Oceania)', '巴布亞紐幾內亞': '大洋洲 (Oceania)', '新喀里多尼亞': '大洋洲 (Oceania)', '玻里尼西亞': '大洋洲 (Oceania)', '法屬玻里尼西亞(大溪地)': '大洋洲 (Oceania)', '塞班島': '大洋洲 (Oceania)', '北馬利安納群島': '大洋洲 (Oceania)'
  };

  // Pre-process airports to include continent and country
  const enrichedAirports = useMemo(() => {
    return airports.map(a => {
      const country = a.label.split(' - ')[1] || '未知';
      return {
        ...a,
        country,
        continent: continentMap[country] || '其他 (Others)'
      };
    });
  }, []);

  const continents = useMemo(() => [...new Set(enrichedAirports.map(a => a.continent))], [enrichedAirports]);
  const destCountries = useMemo(() => {
    if (!destContinent) return [];
    return [...new Set(enrichedAirports.filter(a => a.continent === destContinent.value).map(a => a.country))];
  }, [destContinent, enrichedAirports]);

  const originCountries = useMemo(() => {
    if (!originContinent) return [];
    return [...new Set(enrichedAirports.filter(a => a.continent === originContinent.value).map(a => a.country))];
  }, [originContinent, enrichedAirports]);

  // Only pass max 50 options to react-select to completely avoid React rendering lockups
  const filteredOriginOptions = useMemo(() => {
    let opts = enrichedAirports;
    if (originContinent) opts = opts.filter(a => a.continent === originContinent.value);
    if (originCountry) opts = opts.filter(a => a.country === originCountry.value);

    if (!originInput) return opts;
    const lower = originInput.toLowerCase();
    return opts.filter(a => 
      a.label.toLowerCase().includes(lower) || 
      a.value.toLowerCase().includes(lower) ||
      a.keywords.toLowerCase().includes(lower)
    );
  }, [originInput, originContinent, originCountry, enrichedAirports]);

  const filteredDestOptions = useMemo(() => {
    let opts = enrichedAirports;
    if (destContinent) opts = opts.filter(a => a.continent === destContinent.value);
    if (destCountry) opts = opts.filter(a => a.country === destCountry.value);
    
    if (!destInput) return opts;
    const lower = destInput.toLowerCase();
    return opts.filter(a => 
      a.label.toLowerCase().includes(lower) || 
      a.value.toLowerCase().includes(lower) ||
      a.keywords.toLowerCase().includes(lower)
    );
  }, [destInput, destContinent, destCountry, enrichedAirports]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (tripType === 'multi-city') {
      const validLegs = multiCityLegs.filter(leg => leg.origin && leg.destination && leg.outDate);
      if (validLegs.length > 0) {
        onSearch({ tripType, legs: validLegs, passengers, directOnly, preferredAirline: preferredAirline ? preferredAirline.value : null });
      }
    } else {
      if(origin && destination) {
        onSearch({ tripType, origin: origin.value, destination: destination.value, depTime: outDate, retTime: returnDate, passengers, directOnly, preferredAirline: preferredAirline ? preferredAirline.value : null });
      }
    }
  };

  const addMultiCityLeg = () => {
    if (multiCityLegs.length < 5) {
      setMultiCityLegs([...multiCityLegs, { origin: null, destination: null, outDate: '' }]);
    }
  };

  const removeMultiCityLeg = (index) => {
    if (multiCityLegs.length > 2) {
      const newLegs = [...multiCityLegs];
      newLegs.splice(index, 1);
      setMultiCityLegs(newLegs);
    }
  };

  const updateMultiCityLeg = (index, field, value) => {
    const newLegs = [...multiCityLegs];
    newLegs[index][field] = value;
    setMultiCityLegs(newLegs);
  };

  return (
    <div className="search-form glass-panel animate-fade-in">
      <h2>
        <Plane size={24} className="app-header-icon" />
        {t('search_flights') || '搜尋航班'}
      </h2>
      
      {/* Trip Type Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '12px' }}>
        {['one-way', 'round-trip', 'multi-city'].map(type => (
          <button
            key={type}
            type="button"
            onClick={() => setTripType(type)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '8px',
              background: tripType === type ? 'var(--accent-primary)' : 'transparent',
              color: tripType === type ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: tripType === type ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            {type === 'one-way' ? (t('one_way') || '單程') : type === 'round-trip' ? (t('round_trip') || '來回') : (t('multi_city') || '多城市')}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* 航線選擇區 */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} /> {t('route_selection') || '航線選擇 (Route)'}
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tripType === 'multi-city' ? (
              // Multi-City Mode
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {multiCityLegs.map((leg, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Select
                        value={leg.origin}
                        onChange={(val) => updateMultiCityLeg(index, 'origin', val)}
                        options={enrichedAirports}
                        styles={customStyles}
                        placeholder={t('origin') || `第 ${index + 1} 段出發地...`}
                      />
                      <Select
                        value={leg.destination}
                        onChange={(val) => updateMultiCityLeg(index, 'destination', val)}
                        options={enrichedAirports}
                        styles={customStyles}
                        placeholder={t('destination') || `第 ${index + 1} 段目的地...`}
                      />
                      <input 
                        type="date"
                        value={leg.outDate}
                        onChange={(e) => updateMultiCityLeg(index, 'outDate', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                      />
                    </div>
                    {multiCityLegs.length > 2 && (
                      <button type="button" onClick={() => removeMultiCityLeg(index)} style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {multiCityLegs.length < 5 && (
                  <button type="button" onClick={addMultiCityLeg} style={{ padding: '0.75rem', background: 'transparent', border: '1px dashed var(--accent-primary)', color: 'var(--accent-primary)', borderRadius: '8px', cursor: 'pointer' }}>
                    + {t('add_flight_leg') || '新增航段'}
                  </button>
                )}
              </div>
            ) : (
              // One-way / Round-trip Mode (Cascading)
              <>
            {/* Origin Cascading */}
            <div className="form-group">
              <label>{t('origin_continent') || '出發地 - 洲際 (Continent)'}</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <div style={{ width: '100%', position: 'relative', zIndex: 12 }}>
                  <Select
                    value={originContinent}
                    onChange={(val) => {
                      setOriginContinent(val);
                      setOriginCountry(null);
                      setOrigin(null);
                    }}
                    options={continents.map(c => ({ value: c, label: c }))}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    placeholder="選擇洲際 (選填)..."
                    isClearable={true}
                    isSearchable={false}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{t('origin_country') || '出發地 - 國家 (Country)'}</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <div style={{ width: '100%', position: 'relative', zIndex: 11 }}>
                  <Select
                    value={originCountry}
                    onChange={(val) => {
                      setOriginCountry(val);
                      setOrigin(null);
                    }}
                    options={originCountries.map(c => ({ value: c, label: c }))}
                    isDisabled={!originContinent}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    placeholder={originContinent ? "選擇國家..." : "請先選擇洲際"}
                    isClearable={true}
                    isSearchable={false}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{t('origin_airport') || '出發地 - 機場 (Airport)'}</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <div style={{ width: '100%', position: 'relative', zIndex: 10 }}>
                  <Select
                    value={origin}
                    onChange={setOrigin}
                    onInputChange={(val, { action }) => {
                      if (action === 'input-change') setOriginInput(val);
                    }}
                    options={filteredOriginOptions}
                    filterOption={null}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    placeholder="輸入或選擇機場..."
                    isSearchable={true}
                  />
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />

            {/* Destination Cascading */}
            <div className="form-group">
              <label>{t('dest_continent') || '目的地 - 洲際 (Continent)'}</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <div style={{ width: '100%', position: 'relative', zIndex: 6 }}>
                  <Select
                    value={destContinent}
                    onChange={(val) => {
                      setDestContinent(val);
                      setDestCountry(null);
                      setDestination(null);
                    }}
                    options={continents.map(c => ({ value: c, label: c }))}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    placeholder="選擇洲際 (選填)..."
                    isClearable={true}
                    isSearchable={false}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{t('dest_country') || '目的地 - 國家 (Country)'}</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <div style={{ width: '100%', position: 'relative', zIndex: 5 }}>
                  <Select
                    value={destCountry}
                    onChange={(val) => {
                      setDestCountry(val);
                      setDestination(null);
                    }}
                    options={destCountries.map(c => ({ value: c, label: c }))}
                    isDisabled={!destContinent}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    placeholder={destContinent ? "選擇國家..." : "請先選擇洲際"}
                    isClearable={true}
                    isSearchable={false}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{t('dest_airport') || '目的地 - 機場 (Airport)'}</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <div style={{ width: '100%', position: 'relative', zIndex: 4 }}>
                  <Select
                    value={destination}
                    onChange={setDestination}
                    onInputChange={(val, { action }) => {
                      if (action === 'input-change') setDestInput(val);
                    }}
                    options={filteredDestOptions}
                    filterOption={null}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    placeholder="輸入或選擇機場..."
                    isSearchable={true}
                  />
                </div>
              </div>

              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {['NRT', 'KIX', 'ICN', 'BKK', 'LHR', 'CDG', 'JFK'].map(code => {
                  const ap = airports.find(a => a.value === code);
                  if (!ap) return null;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setDestination(ap)}
                      style={{
                        background: destination?.value === code ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {ap.label.split(' (')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
          </div>
        </div>

        {/* 時間與人數區 */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} /> {tripType === 'multi-city' ? (t('passengers') || '人數 (Pax)') : (t('schedule_pax') || '時間與人數 (Schedule & Pax)')}
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {tripType !== 'multi-city' && (
              <>
                <div className="form-group">
                  <label>{t('departure_date') || '去程 (Departure)'}</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input 
                      type="date" 
                      value={outDate}
                      onChange={(e) => setOutDate(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} 
                    />
                  </div>
                </div>
                
                <div className="form-group" style={{ opacity: tripType === 'one-way' ? 0.5 : 1 }}>
                  <label>{t('return_date') || '回程 (Return)'} {tripType === 'one-way' && (t('optional_for_one_way') || '(單程免填)')}</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input 
                      type="date" 
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      disabled={tripType === 'one-way'}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} 
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="form-group">
            <label>搭乘人數 (Passengers)</label>
            <div className="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)', pointerEvents: 'none', zIndex: 10 }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <select 
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num} style={{ background: 'rgba(30, 41, 59, 1)' }}>{num} 位旅客</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label>偏好航空公司 (Preferred Airline)</label>
            <div style={{ position: 'relative' }}>
              <Plane size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 10 }} />
              <Select
                value={preferredAirline}
                onChange={setPreferredAirline}
                options={[{ value: null, label: '不限 (Any)' }, ...airlines.map(a => ({ value: a, label: a }))]}
                styles={customStyles}
                placeholder="不限 (Any)"
                isClearable
              />
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="directOnly" 
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
              style={{ width: '1rem', height: '1rem', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <label htmlFor="directOnly" style={{ color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem' }}>
              僅搜尋直飛航班 (Direct Flights Only)
            </label>
          </div>
        </div>

        <button type="submit" className="search-btn" style={{ position: 'relative', zIndex: 10, marginTop: '0.5rem' }}>
          <Search size={20} />
          分析價格趨勢
        </button>
      </form>
    </div>
  );
}
