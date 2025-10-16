import React, { useEffect, useState } from 'react';
import ReviewCard from '../ReviewCard/ReviewCard';
import '../../pages/AdminPage.css';
import useAdminApi from '../../hook/useAdminApi';
import ApiResponse from '../../Types/ApiResponse';
import { IReview } from '../../Types/Reviews';
import ReviewDeleteModal from '../Modals/ReviewDeleteModal';
import { PopUp } from '../PopUp/PopUp';




const AdminReviews: React.FC = () => {

  const {getReviewsByType, data, loading, error} = useAdminApi<IReview[]>()
  const deleteApi = useAdminApi<IReview>()
  const [reviewType, setReviewType] = useState<'organization' | 'product'>('organization')
  const [deleteModal, setDeleteModal] = useState<null | string>(null)
  const [reviews, setReviews] = useState<IReview[]>([])
  const [popUp,setPopUp] = useState<boolean>(false)
  useEffect(()=>{
    getReviewsByType(reviewType)
  },[reviewType])

  useEffect(() => {
      if (data) {
        setReviews(data)
      }
    }, [data])

  useEffect(() => {
    if (deleteApi.data && !deleteApi.error) {
      setReviews(v => v.filter((item) => item.id !== deleteApi.data?.id))
    } else if(!deleteApi.data && deleteApi.error) {
      setPopUp(true)
    }

  }, [deleteApi.data, deleteApi.error])

  return (
    <div className="main-content">
      <div className="content-header">
        <h1><i className="fas fa-comments"></i> Отзывы</h1>
        <div className="header-right">
          <div className="total-products">
            <i className="fas fa-comments"></i>
            Всего отзывов: <span>{data ? data.length : "-"}</span>
            <select onChange={(e) => {
              setReviewType(e.target.value as 'organization' | 'product')
            }}  style={{padding:'6px 12px', fontSize:16}}>
                          <option key='organization' value="organization">Организация</option>
                          <option key='product' value="product">Продукт</option>
                          
                          
                        </select>
          </div>
        </div>
      </div>
      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя клиента</th>
              <th>Почта клиента</th>
              <th>ID Продукта</th>
              <th>Текст отзыва</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {error && <tr><td colSpan={6} style={{color: 'red'}}>Что-то пошло не так</td></tr>}
            {reviews?.length !== 0 && reviews && loading ? <tr><td colSpan={6}>Загрузка отзывов...</td></tr> : null}
            {!loading && !error && data && reviews.length === 0 && <tr><td colSpan={6}>Отзывы не найдены.</td></tr>}
            {data && !loading ? reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.username}</td>
                <td>{r.email}</td>
                <td>{r.productId || "-"}</td>
                <td>{r.review}</td>
                <td>
                  <button onClick={() => setDeleteModal(r.id)} className="delete-button">
                    <i className="fas fa-trash"></i> Удалить
                  </button>
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>

      {deleteModal ? <ReviewDeleteModal id={deleteModal} setModal={setDeleteModal} api={deleteApi}/> : null}
      {popUp && deleteApi.error ? <PopUp message="Не получилось удалить отзыв. Попробуйте позже!" status="error" showTime={3000} setStateFunction={setPopUp}/> : null}
    </div>
  );
};

export default AdminReviews; 