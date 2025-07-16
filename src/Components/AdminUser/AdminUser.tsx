import React from 'react';
import '../../pages/AdminPage.css';

const AdminUser: React.FC = () => {
  return (
    <div className="main-content">
      <div className="content-header">
        <h1><i className="fas fa-user"></i> Профиль администратора</h1>
      </div>
      <div style={{marginTop: 32, maxWidth: 400}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div><b>Имя:</b> Михаил</div>
          <div><b>Email:</b> admin@yandex.ru</div>
          <div><b>Роль:</b> Администратор</div>
        </div>
      </div>
    </div>
  );
};

export default AdminUser; 