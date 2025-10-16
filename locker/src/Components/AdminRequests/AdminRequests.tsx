import React, { useEffect, useState } from 'react';
import '../../pages/AdminPage.css';
import useAdminApi from '../../hook/useAdminApi';
import { IOrder } from '../../Types/Orders';
import ApiResponse from '../../Types/ApiResponse';
import { PopUp } from '../PopUp/PopUp';

interface Request {
  id: number;
  customerName: string;
  phone: string;
  product: string;
  comment: string;
}

const AdminRequests: React.FC = () => {
  const {getOrders, error, data, loading} = useAdminApi<IOrder[]>()
  const statusReq = useAdminApi<IOrder>()
  const [status, setStatus] = useState<'active' | 'canceled' | 'completed'>('active')
  const [type, setType] = useState<'order' | 'consultation'>('consultation')
  const [orders, setOrders] = useState<IOrder[]>()
  const [pop, setPop] = useState<boolean>(false)

  useEffect(() => {
    getOrders(type, status)
  }, [type, status])

  useEffect(() => {
    if (data) {
      setOrders(data)
    }
  }, [data])

  useEffect(() => {
    if (statusReq.data && !statusReq.error) {
      setOrders((v) => v?.filter((item) => item.id !== statusReq.data?.id))
    } else if (!statusReq.data && statusReq.error) {
      setPop(true)
    }
  }, [statusReq.data, statusReq.error])

  return (
    <div className="main-content">
      <div className="content-header">
        <h1><i className="fas fa-file-alt"></i> Заявки</h1>
        <div className="header-right">
          <select onChange={e => {
              setType(e.target.value as 'order' | 'consultation')
            }} style={{padding:'6px 12px', fontSize:16}}>
              <option key='active' value='consultation'>Консультации</option>
              <option key='completed' value='order'>Заказы</option>
            </select>
          <select onChange={e => {
              setStatus(e.target.value as 'active' | 'canceled' | 'completed')
            }} style={{padding:'6px 12px', fontSize:16}}>
              <option key='active' value='active'>Активные</option>
              <option key='completed' value='completed'>Завершённые</option>
              <option key='canceled' value='canceled'>Отменённые</option>
            </select>
          <div className="total-products">
            <i className="fas fa-file-alt"></i>
            Всего заявок: <span>{data ? data.length : '-'}</span>
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
              <th>Почта</th>
              <th>Статус</th>
              <th>Товар</th>
              <th>Комментарий</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {error && <tr><td colSpan={6} style={{color: 'red'}}>Что-то пошло не так</td></tr>}
            {orders?.length !== 0 && orders && loading ? <tr><td colSpan={6}>Загрузка заявок...</td></tr> : null}
            {!loading && !error && data && data.length === 0 && <tr><td colSpan={6}>Продукты не найдены.</td></tr>}
            {data && orders && !loading ? orders.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td className="customer-name-col">{r.userName}</td>
                <td>{r.tel}</td>
                <td>{r.email}</td>
                <td>{r.status}</td>
                <td>{r.productId || '-'}</td>
                <td className="review-text-cell">{r.comment || '-'}</td>
                <td>
                  {status === 'completed' || status === "canceled" ? 
                  
                  <button onClick={() => {
                    statusReq.changeOrderStatus(r.id, 'active')
                  }}  className="delete-button">
                      <i className="fas fa-refresh"></i>
                  </button> : null}
                  {status === 'active' ? <button onClick={() => {
                    statusReq.changeOrderStatus(r.id, 'completed')
                  }}
                  className="edit-button">
                      <i className="fas fa-check"></i>
                  </button> : null}
                  {status === 'active' || status === "completed" ? <button onClick={() => {
                    statusReq.changeOrderStatus(r.id, 'canceled')
                  }} className="delete-button">
                      <i className="fas fa-trash"></i>
                  </button> : null}
                </td>
              </tr>
            )): null}
          </tbody>
        </table>
      </div>
      {pop && statusReq.error ? <PopUp message='Не удалось изменить статус заявки!' status='error' setStateFunction={setPop} showTime={3000}/> : null}
    </div> 
  );
};

export default AdminRequests; 