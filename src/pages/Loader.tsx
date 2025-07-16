import React from 'react';
import './Loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-circles">
        <div className="loader-circle left" />
        <div className="loader-circle center">
          <img src="/img/Logo.png" alt="LW Logo" className="loader-logo" />
        </div>
        <div className="loader-circle right" />
      </div>
    </div>
  );
};

export default Loader; 