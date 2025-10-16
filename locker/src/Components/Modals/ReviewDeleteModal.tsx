




import { FC, useEffect } from "react"
import useAdminApi from "../../hook/useAdminApi"

interface IReviewDeleteModalProps {
    id: string
    setModal: React.Dispatch<React.SetStateAction<string | null>>
    api: ReturnType<typeof useAdminApi> 
}
const ReviewDeleteModal: FC<IReviewDeleteModalProps> = ({id, setModal, api}) => {
    return (
         <div className='modal active' id="descriptionModal" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget ? setModal(null) : null}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title"><i className="fas fa-info-circle"></i> Удаление отзыва</h2>                </div>
                <div className="description-content">
                    Вы действительно хотите удалить отзыв?
                </div>
                <div className="modal-footer">
                    <button onClick={() => setModal(null)} className="cancel-button" id="closeDescriptionBtn">
                        <i className="fas fa-times"></i> Отмена
                    </button>
                    <button onClick={() => {
                        api.removeReview(id)
                        setModal(null)
                    }} className="save-button" id="closeDescriptionBtn">
                        <i className="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReviewDeleteModal