import React, { useState } from 'react';
import '../../pages/AdminPage.css'; // Общий стиль админки

interface Request {
  id: number;
  customerName: string;
  phone: string;
  product: string;
  comment: string;
}

const initialRequests: Request[] = [
  { id: 1, customerName: 'Иван', phone: '+7 999 123-45-67', product: 'Кухонный гарнитур', comment: 'Хотел бы узнать сроки изготовления.' },
  { id: 2, customerName: 'Мария', phone: '+7 912 555-66-77', product: 'Шкаф-купе', comment: 'Интересует доставка в область.' },
  { id: 3, customerName: 'Петр', phone: '+7 900 111-22-33', product: 'Детская мебель', comment: 'Можно ли изменить цвет?' },
];

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  // Функция для удаления заявки
  const handleDelete = (id: number) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="main-content">
      <div className="content-header">
        <h1><i className="fas fa-file-alt"></i> Заявки</h1>
        <div className="header-right">
          <div className="total-products">
            <i className="fas fa-file-alt"></i>
            Всего заявок: <span>{requests.length}</span>
          </div>
        </div>
      </div>
      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя клиента</th>
              <th>Телефон</th>
              <th>Товар</th>
              <th>Комментарий</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td className="customer-name-col">{r.customerName}</td>
                <td>{r.phone}</td>
                <td>{r.product}</td>
                <td className="review-text-cell">{r.comment}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(r.id)}>
                    <i className="fas fa-trash"></i> Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRequests; 