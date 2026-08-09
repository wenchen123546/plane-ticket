import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Snowflake, Wind, Thermometer, Briefcase } from 'lucide-react';

export default function WeatherPanel({ destination }) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (!destination) return;

    // Simulate network delay and fetch mock weather based on region
    const timer = setTimeout(() => {
      const destStr = destination.toLowerCase();
      let data = {
        condition: 'sunny',
        temp: 28,
        tips: ['輕薄短袖衣物', '太陽眼鏡與防曬乳', '舒適的涼鞋或透氣運動鞋']
      };

      if (destStr.includes('倫敦') || destStr.includes('巴黎') || destStr.includes('歐洲')) {
        data = {
          condition: 'rainy',
          temp: 14,
          tips: ['防水風衣或雨具', '保暖長袖衣物', '好走的防水靴']
        };
      } else if (destStr.includes('東京') || destStr.includes('首爾') || destStr.includes('紐約')) {
        data = {
          condition: 'snowy',
          temp: 2,
          tips: ['厚重羽絨外套', '毛帽、圍巾與手套', '防滑雪靴']
        };
      } else if (destStr.includes('峇里島') || destStr.includes('曼谷') || destStr.includes('馬爾地夫')) {
        data = {
          condition: 'sunny',
          temp: 32,
          tips: ['海灘褲或泳裝', '防曬帽與蘆薈露', '隨身防水包']
        };
      }

      setWeatherData(data);
      
      // Emit event to app to change background subtlety
      window.dispatchEvent(new CustomEvent('weatherChanged', { detail: data.condition }));

    }, 800);

    return () => {
      clearTimeout(timer);
      window.dispatchEvent(new CustomEvent('weatherChanged', { detail: 'default' }));
    };
  }, [destination]);

  if (!destination) return null;
  if (!weatherData) return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1rem', marginTop: '1rem', textAlign: 'center' }}>
      <Wind className="animate-spin" size={24} style={{ color: 'var(--text-secondary)' }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>正在連線當地氣象局...</p>
    </div>
  );

  const getIcon = () => {
    if (weatherData.condition === 'sunny') return <Sun size={36} color="#fbbf24" />;
    if (weatherData.condition === 'rainy') return <CloudRain size={36} color="#60a5fa" />;
    if (weatherData.condition === 'snowy') return <Snowflake size={36} color="#e2e8f0" />;
  };

  const getLabel = () => {
    if (weatherData.condition === 'sunny') return '晴朗炎熱';
    if (weatherData.condition === 'rainy') return '陰雨綿綿';
    if (weatherData.condition === 'snowy') return '寒冷降雪';
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '1rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)' }}>
      <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>
        <Thermometer size={18} color="var(--accent-secondary)" />
        目的地氣象與穿搭 (預報)
      </h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
          {getIcon()}
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1 }}>{weatherData.temp}°C</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{getLabel()}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
          <Briefcase size={14} /> 專屬打包建議
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          {weatherData.tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
