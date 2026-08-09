import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  const { status, title, message, actionText } = recommendation;
  
  const getIcon = () => {
    switch(status) {
      case 'excellent': return <CheckCircle size={32} />;
      case 'good': return <Clock size={32} />;
      case 'wait': return <AlertTriangle size={32} />;
      default: return null;
    }
  };

  return (
    <div className={`recommendation-card glass-panel ${status} animate-fade-in-delayed`} style={{ animationDelay: '0.4s' }}>
      <div className="rec-content">
        <div className="rec-icon">
          {getIcon()}
        </div>
        <div className="rec-text">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
      </div>
      <button className="rec-action-btn">
        {actionText}
      </button>
    </div>
  );
}
