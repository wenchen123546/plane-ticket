import React, { useEffect } from 'react';
import { X, BookOpen, Search, Clock, Plane, Info, Star, Map, CreditCard, Users } from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose }) {
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

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ zIndex: 9999 }} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto' }}>
        <button className="close-btn" onClick={onClose} aria-label="Close"><X /></button>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
          <BookOpen size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            新世代航班探索系統 - 終極使用指南
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>歡迎來到全球最具未來感的航班探索平台！以下是為您整理的全功能導覽：</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}>
              <Search size={20} /> 1. 無界探索 (Navigation & Search)
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>漏斗式航線選擇</h4>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                無論是出發地還是目的地，您都可以透過<strong>三層漏斗式選單 (洲際 ➔ 國家 ➔ 機場)</strong> 來精準定位。
                例如：先選擇亞洲，系統會為您過濾出泰國、馬爾地夫等，最後再讓您選擇真實航點，一秒鎖定目的地。
              </p>
              
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>艙等切換</h4>
              <p style={{ margin: '0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                在左側搜尋面板的最下方，隨時切換<strong>輕裝經濟艙</strong>、<strong>標準經濟艙</strong>或<strong>商務尊榮艙</strong>。價格會即時反映。
              </p>
            </div>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#facc15' }}>
              <Clock size={20} /> 2. 機場大廳 (Flight Dashboard)
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid #facc15' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>即時離境航班看板</h4>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                儀表板頂端的 LED 動態時刻表會即時模擬您所選「出發地」未來的航班動態。
                觀察航班狀態在 <code>ON TIME</code>、<code>BOARDING</code> 與閃爍的 <code>FINAL CALL</code> 之間隨機跳動，感受真實機場氛圍。
              </p>
              
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>情報中心與價格矩陣</h4>
              <p style={{ margin: '0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                儀表板左上角顯示「當前票價」與「歷史均價」對比。旁邊的「日期價格矩陣」則能讓您一眼看穿前後幾天的最便宜票價。
              </p>
            </div>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
              <Plane size={20} /> 3. 行前深度解析 (Deep Dive)
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>機型深度透視儀</h4>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                在航班清單中點擊「<strong>🔍 透視機型</strong>」按鈕。您可以檢視七大硬體指標（椅距、寬度、網路等）與五星評分雷達。
              </p>
              
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>乘客真實體驗評價</h4>
              <p style={{ margin: '0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                在「機型透視儀」最下方以及側邊欄中，系統會精準調出專屬於該架飛機 (如 A380 或 787) 的真實乘客實測分享。忘掉無參考價值的社群好評，直接看硬核實測！
              </p>
            </div>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899' }}>
              <Map size={20} /> 4. 智能行程輔助 (Trip Assistance)
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid #ec4899' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}><Users size={14}/> 發起揪團投票</h4>
                  <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    將選定的航班打包成投票面板，讓旅伴直接投票。
                  </p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}><Map size={14}/> AI 行程規劃</h4>
                  <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    根據您的抵達時間與目的地，自動生成落地後的精緻行程。
                  </p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}><Info size={14}/> 哩程計算機</h4>
                  <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    側邊欄自動計算您這趟旅程可賺取的航空哩程與碳排放量。
                  </p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}><CreditCard size={14}/> 虛擬劃位結帳</h4>
                  <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    進入極具科技感的虛擬機艙俯瞰圖挑選舒適座位，完成無縫結帳。
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <Star size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
             <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
               <strong>隱藏彩蛋：</strong> 如果您選擇了「標準經濟艙」，在猶豫或瀏覽航班一段時間後，系統可能會隨機彈出專屬的「VIP 限量升等優惠」，千萬別錯過用超低價格升級商務艙的機會！
             </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
