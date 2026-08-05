import React from 'react';
import { X, Plane, Maximize, VolumeX, Wind, Monitor, Wifi, BatteryCharging, Quote, Star } from 'lucide-react';
import { getDetailedAircraftStats, getAircraftReviews } from '../services/mockData';

export default function AircraftInspectorModal({ isOpen, onClose, aircraft }) {
  if (!isOpen) return null;

  const stats = getDetailedAircraftStats(aircraft);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content inspector-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X /></button>
        
        <div className="inspector-header">
          <Plane size={48} className="app-header-icon" style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }} />
          <h2 style={{ margin: '0 0 0.5rem 0' }}>{aircraft || '未知機型'} 深度透視</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>專業常客情報，揭露隱藏的舒適度密碼</p>
        </div>

        <div className="inspector-grid">
          <div className="inspector-card">
            <div className="card-icon"><Maximize size={20}/></div>
            <div className="card-info">
              <h4>椅距 (Seat Pitch)</h4>
              <p>{stats.pitch}</p>
            </div>
          </div>
          <div className="inspector-card">
            <div className="card-icon"><Maximize size={20} style={{transform: 'rotate(90deg)'}}/></div>
            <div className="card-info">
              <h4>椅寬 (Seat Width)</h4>
              <p>{stats.width}</p>
            </div>
          </div>
          <div className="inspector-card">
            <div className="card-icon"><VolumeX size={20}/></div>
            <div className="card-info">
              <h4>艙內噪音</h4>
              <p>{stats.noise}</p>
            </div>
          </div>
          <div className="inspector-card">
            <div className="card-icon"><Wind size={20}/></div>
            <div className="card-info">
              <h4>氣壓與空調</h4>
              <p>{stats.pressure}</p>
            </div>
          </div>
          <div className="inspector-card">
            <div className="card-icon"><Monitor size={20}/></div>
            <div className="card-info">
              <h4>娛樂系統 (IFE)</h4>
              <p>{stats.ife}</p>
            </div>
          </div>
          <div className="inspector-card">
            <div className="card-icon"><Wifi size={20}/></div>
            <div className="card-info">
              <h4>機上網路</h4>
              <p>{stats.wifi}</p>
            </div>
          </div>
          <div className="inspector-card full-width">
            <div className="card-icon"><BatteryCharging size={20}/></div>
            <div className="card-info">
              <h4>座位充電</h4>
              <p>{stats.power}</p>
            </div>
          </div>
        </div>
        
        <div className="radar-container">
           <h3 style={{ margin: '0 0 1rem 0' }}>五星評分雷達</h3>
           <div className="score-bar">
             <span className="score-label">空間寬敞度</span>
             <div className="bar-bg"><div className="bar-fill" style={{width: `${stats.scores.space}%`, background: '#3b82f6'}}></div></div>
             <span className="score-val">{stats.scores.space}</span>
           </div>
           <div className="score-bar">
             <span className="score-label">機艙安靜度</span>
             <div className="bar-bg"><div className="bar-fill" style={{width: `${stats.scores.quiet}%`, background: '#8b5cf6'}}></div></div>
             <span className="score-val">{stats.scores.quiet}</span>
           </div>
           <div className="score-bar">
             <span className="score-label">科技現代感</span>
             <div className="bar-bg"><div className="bar-fill" style={{width: `${stats.scores.tech}%`, background: '#ec4899'}}></div></div>
             <span className="score-val">{stats.scores.tech}</span>
           </div>
           <div className="score-bar">
             <span className="score-label">總體舒適度</span>
             <div className="bar-bg"><div className="bar-fill" style={{width: `${stats.scores.comfort}%`, background: '#10b981'}}></div></div>
             <span className="score-val">{stats.scores.comfort}</span>
           </div>
        </div>

        {/* 乘客真實體驗分享 */}
        <div style={{ padding: '0 2rem 2rem 2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Quote size={18} color="var(--accent-primary)" />
            乘客真實體驗分享
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {getAircraftReviews().filter(r => r.aircraft === aircraft).map((review, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontStyle: 'italic', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  "{review.content}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>— {review.author}</span>
                  <div style={{ display: 'flex', color: 'var(--accent-primary)' }}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {getAircraftReviews().filter(r => r.aircraft === aircraft).length === 0 && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                目前尚無此機型的特定評價。
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
