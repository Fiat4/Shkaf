import React, { useState } from 'react';
import ReviewCard from '../ReviewCard/ReviewCard';
import '../../pages/AdminPage.css';

interface Review {
  id: number;
  customerName: string;
  review: string;
}

const initialReviews: Review[] = [
  { id: 1, customerName: 'Александр', review: 'Отличное качество мебели! Заказывал кухонный гарнитур, все сделали точно в срок. Монтаж произвели быстро и качественно. Очень доволен результатомйцвввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввйкупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупупуп!' },
  { id: 2, customerName: 'Елена', review: 'Заказывала шкаф-купе в спальню. Дизайнер помог с выбором материалов и конфигурацией. Результат превзошел все ожидания. Спасибо за профессионализм!' },
  { id: 3, customerName: 'Михаил', review: 'Обратился за мебелью для всей квартиры. Понравился индивидуальный подход и внимание к деталям. Все выполнено качественно и со вкусом.' },
];

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Функция для удаления отзыва))))
  const handleDelete = (id: number) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="main-content">
      <div className="content-header">
        <h1><i className="fas fa-comments"></i> Отзывы</h1>
        <div className="header-right">
          <div className="total-products">
            <i className="fas fa-comments"></i>
            Всего отзывов: <span>{reviews.length}</span>
          </div>
        </div>
      </div>
      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя клиента</th>
              <th>Текст отзыва</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.customerName}</td>
                <td>{r.review}</td>
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

export default AdminReviews; 