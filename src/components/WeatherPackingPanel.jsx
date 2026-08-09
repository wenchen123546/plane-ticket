import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, CheckSquare } from 'lucide-react';

export default function WeatherPackingPanel({ destination }) {
  // Mock logic based on destination
  const isCold = destination === 'NRT' || destination === 'ICN' || destination === 'JFK' || destination === 'CDG';
  const isRainy = destination === 'NRT' || destination === 'CDG';

  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(`packing_checklist_${destination}`);
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {}
    } else {
      setCheckedItems({}); // Reset on destination change if no saved state
    }
  }, [destination]);

  const handleToggle = (id) => {
    const nextState = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(nextState);
    localStorage.setItem(`packing_checklist_${destination}`, JSON.stringify(nextState));
  };
  
  return (
    <div className="weather-packing-panel glass-panel animate-fade-in">
      <div className="panel-col weather-col">
        <div className="intel-header">
          <CloudRain size={20} className="app-header-icon" />
          <h3>目的地天氣預報</h3>
        </div>
        <div className="weather-info">
          <div className="weather-icon-large">
            {isRainy ? <CloudRain size={48} color="var(--accent-primary)" /> : isCold ? <Cloud size={48} color="#94a3b8" /> : <Sun size={48} color="var(--warning)" />}
          </div>
          <div className="weather-details">
            <div className="temp">{isCold ? '8°C - 15°C' : '26°C - 32°C'}</div>
            <div className="desc">{isRainy ? '陣雨 / 潮濕' : isCold ? '多雲 / 乾冷' : '晴朗 / 炎熱'}</div>
            <div className="rain-chance">降雨機率: {isRainy ? '65%' : '10%'}</div>
          </div>
        </div>
      </div>
      
      <div className="panel-divider"></div>
      
      <div className="panel-col packing-col">
        <div className="intel-header">
          <CheckSquare size={20} className="app-header-icon" />
          <h3>AI 專屬行李清單</h3>
        </div>
        <ul>
          <li>
            <input type="checkbox" id="item1" checked={checkedItems['item1'] || false} onChange={() => handleToggle('item1')} />
            <label htmlFor="item1">{isCold ? '保暖羽絨外套 / 防風大衣' : '透氣短袖 / 遮陽帽'}</label>
          </li>
          <li>
            <input type="checkbox" id="item2" checked={checkedItems['item2'] || false} onChange={() => handleToggle('item2')} />
            <label htmlFor="item2">{isCold ? '發熱衣 / 保暖手套' : '泳裝 / 涼鞋'}</label>
          </li>
          <li>
            <input type="checkbox" id="item3" checked={checkedItems['item3'] || false} onChange={() => handleToggle('item3')} />
            <label htmlFor="item3">{isCold ? '高保濕乳液 / 護唇膏' : '高係數防曬乳'}</label>
          </li>
          <li>
            <input type="checkbox" id="item4" checked={checkedItems['item4'] || false} onChange={() => handleToggle('item4')} />
            <label htmlFor="item4">{isRainy ? '折疊傘 / 防水鞋' : '墨鏡 / 小風扇'}</label>
          </li>
          <li>
            <input type="checkbox" id="item5" checked={checkedItems['item5'] ?? true} onChange={() => handleToggle('item5')} />
            <label htmlFor="item5">護照與當地轉接頭</label>
          </li>
        </ul>
      </div>
    </div>
  );
}
