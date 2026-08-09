import React, { useEffect } from 'react';
import { X, MapPin, Coffee, Camera, Moon, Plane } from 'lucide-react';

export default function ItineraryModal({ isOpen, onClose, destination, flight }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cityName = destination === 'NRT' ? '東京' : destination === 'BKK' ? '曼谷' : destination === 'ICN' ? '首爾' : '目的地';

  const itinerary = [
    { day: 1, title: '抵達與探索', activities: [{ icon: <MapPin size={16}/>, text: `抵達${cityName}國際機場，專車接送至市區飯店` }, { icon: <Coffee size={16}/>, text: '飯店周邊網美咖啡廳放鬆' }, { icon: <Moon size={16}/>, text: '著名夜市/商圈品嚐在地小吃' }] },
    { day: 2, title: '文化深度遊', activities: [{ icon: <Camera size={16}/>, text: '知名歷史文化景點巡禮' }, { icon: <Coffee size={16}/>, text: '米其林推薦餐廳午餐' }, { icon: <Camera size={16}/>, text: '高空觀景台欣賞浪漫夜景' }] },
    { day: 3, title: '自由購物日', activities: [{ icon: <MapPin size={16}/>, text: '市區最大購物中心血拼' }, { icon: <Camera size={16}/>, text: '特色文創園區拍照打卡' }, { icon: <Moon size={16}/>, text: '體驗當地特色夜生活' }] },
    { day: 4, title: '近郊小旅行', activities: [{ icon: <MapPin size={16}/>, text: '搭乘觀光列車前往近郊名勝' }, { icon: <Camera size={16}/>, text: '自然風光絕景探索' }, { icon: <Moon size={16}/>, text: '返回市區，享用告別晚宴' }] },
    { day: 5, title: '滿載而歸', activities: [{ icon: <Coffee size={16}/>, text: '飯店悠閒早餐與最後採買' }, { icon: <MapPin size={16}/>, text: `前往${cityName}國際機場` }, { icon: <Plane size={16}/>, text: `搭乘 ${flight?.airline || '航班'} 返回溫暖的家` }] }
  ];

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content itinerary-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close"><X /></button>
        <div className="modal-header">
          <h2>🤖 AI 為您專屬規劃：{cityName} 5天4夜 深度之旅</h2>
          <p style={{ color: 'var(--text-secondary)' }}>根據您的航班時間，為您打造的最佳行程組合</p>
        </div>
        <div className="itinerary-timeline">
          {itinerary.map((day) => (
            <div key={day.day} className="timeline-item">
              <div className="timeline-day">Day {day.day}</div>
              <div className="timeline-content">
                <h3>{day.title}</h3>
                <ul className="activities-list">
                  {day.activities.map((act, i) => (
                    <li key={i}>
                      <span className="act-icon">{act.icon}</span>
                      <span>{act.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="search-btn" style={{ width: '100%', margin: 0 }}>將行程匯出至 PDF</button>
        </div>
      </div>
    </div>
  );
}
