import React, { useState, useEffect } from 'react';
import '../../pages/AdminPage.css';

const AdminSettings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('admin-dark');
    } else {
      document.body.classList.remove('admin-dark');
    }
    // Очистка при размонтировании
    return () => {
      document.body.classList.remove('admin-dark');
    };
  }, [darkMode]);

  return (
    <div className="main-content">
      <div className="content-header">
        <h1><i className="fas fa-cog"></i> Настройки</h1>
      </div>
    </div>
  );
};

export default AdminSettings; 