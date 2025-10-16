import React from 'react';
import './LoadingPage.css';

const LoadingPage: React.FC = () => {
  return (
    <div className="loading-page">
      <div className="loading-container">
        <div className="loading-circle left-circle"></div>
        <div className="loading-circle center-circle">
          <div className="logo-container">
            <img 
              src="/img/Logo.png" 
              alt="Locker Wood Logo" 
              className="logo-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            <div className="logo-fallback" style={{display: 'none'}}>
              <span className="logo-text">LW</span>
              <div className="logo-underline"></div>
            </div>
          </div>
        </div>
        <div className="loading-circle right-circle"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
