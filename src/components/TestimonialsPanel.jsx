import React, { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';

export default function TestimonialsPanel() {
  const reviews = [
    {
      id: 1,
      user: '@旅遊狂熱者',
      avatar: '👩',
      content: '「預算探索地圖」太神了！原本不知道要去哪，隨便拉一下預算就幫我挑好超高 CP 值的航線！',
      rating: 5
    },
    {
      id: 2,
      user: '@工程師阿明',
      avatar: '👨‍💻',
      content: '揪團投票功能完全解決了我們群組每天吵架的問題🤣，還能直接產生 Line Pay 條碼真的有夠懶人！',
      rating: 5
    },
    {
      id: 3,
      user: '@常客張先生',
      avatar: '🧳',
      content: '機型透視儀真的很讚，終於不用自己去查這架飛機有沒有充電座跟 Wi-Fi 了，超級專業！',
      rating: 5
    },
    {
      id: 4,
      user: '@Emily',
      avatar: '👧',
      content: '居然可以先看到飛機座位的 3D 平面圖，而且選商務艙椅子還會變大，這設計細節我給滿分！',
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const currentReview = reviews[currentIndex];

  return (
    <div className="testimonials-panel glass-panel animate-fade-in" style={{ padding: '1.25rem', marginTop: '2rem' }}>
      <div className="intel-header" style={{ marginBottom: '1rem' }}>
        <MessageSquare size={18} className="app-header-icon" style={{ color: '#ec4899' }} />
        <h3 style={{ color: '#ec4899', fontSize: '1.05rem' }}>社群即時好評</h3>
      </div>
      
      <div className="review-content" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.5', fontSize: '0.95rem' }}>
          {currentReview.content}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{currentReview.avatar}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{currentReview.user}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.1rem', color: '#fbbf24' }}>
            {Array.from({ length: currentReview.rating }).map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        {reviews.map((_, i) => (
          <div 
            key={i} 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: i === currentIndex ? '#ec4899' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.3s'
            }} 
          />
        ))}
      </div>
    </div>
  );
}
