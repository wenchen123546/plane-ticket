import { ExternalLink, Tag, ShieldCheck } from 'lucide-react';

export default function ProviderComparison({ providers }) {
  if (!providers || providers.length === 0) return null;

  return (
    <div className="provider-comparison glass-panel animate-fade-in-delayed" style={{ animationDelay: '0.6s' }}>
      <div className="provider-header">
        <h2>
          <Tag size={24} className="app-header-icon" />
          各平台價格比較
        </h2>
        <span className="subtitle">為您從各大訂票網站比對出的最佳價格</span>
      </div>

      <div className="provider-list">
        {providers.map((provider, index) => (
          <div key={provider.name} className={`provider-item ${provider.isBest ? 'best-price' : ''}`}>
            <div className="provider-info">
              {provider.isBest && (
                <div className="best-badge">
                  <ShieldCheck size={14} />
                  最低價保證
                </div>
              )}
              <h3>{provider.name}</h3>
              <span className="provider-type">{provider.type === 'airline' ? '航空公司官網' : '線上旅行社 (OTA)'}</span>
            </div>
            
            <div className="provider-action">
              <div className="provider-price">
                <span className="currency">NT$</span>
                <span className="amount">{provider.price.toLocaleString()}</span>
              </div>
              <button className="book-btn">
                前往訂購 <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
