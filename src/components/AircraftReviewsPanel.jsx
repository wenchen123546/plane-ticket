import React, { useState, useEffect } from 'react';
import { Plane, Star, Quote } from 'lucide-react';
import { getAircraftReviews } from '../services/mockData';

export default function AircraftReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch all reviews and randomize them
    const allReviews = getAircraftReviews().sort(() => 0.5 - Math.random());
    setReviews(allReviews);
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allReviews.length);
    }, 6000); // Change review every 6 seconds

    return () => clearInterval(interval);
  }, []);

  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Plane size={18} />
        機型真實體驗分享
      </h3>
      
      <div style={{ position: 'relative', minHeight: '120px' }}>
        <Quote size={32} style={{ position: 'absolute', top: '-10px', left: '-10px', opacity: 0.1, color: 'var(--accent-primary)' }} />
        
        <div key={currentIndex} className="animate-fade-in">
          <div style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            ✈️ {currentReview.aircraft}
          </div>
          <p style={{ color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1rem' }}>
            "{currentReview.content}"
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>— {currentReview.author}</span>
            <div style={{ display: 'flex', color: 'var(--accent-primary)' }}>
              {[...Array(currentReview.rating)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
