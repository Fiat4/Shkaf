









import { FC } from "react";

export const NewProductReviewModal: FC = () => {
    return (
        <div className="review-modal-overlay">
                    <div className="review-modal">
                        <button className="review-modal-close" >&times;</button>
                        
                        <div className="review-modal-content">
                            <div className="review-modal-header">
                                <h2 className="review-modal-title">Оставить отзыв</h2>
                                <p className="review-modal-description">
                                    Поделитесь своим мнением о товаре
                                </p>
                            </div>
                            
                            <form className="review-form" >
                                <div className="review-form-row">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="ВАШЕ ИМЯ"
                                        className="review-input"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="ВАШ EMAIL"
                                        className="review-input"
                                        required
                                    />
                                </div>
                                
                                <div className="review-rating-section">
                                    <label className="review-rating-label">ОЦЕНКА</label>
                                    <div className="review-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`star-btn active`}
                                            >
                                                <i className="fa-solid fa-star"></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <textarea
                                    name="text"
                                    placeholder="ВАШ ОТЗЫВ"
                                    className="review-textarea"
                                    rows={4}
                                    required
                                />
                                
                                <div className="review-photo-section">
                                    <label className="review-photo-label">
                                        <i className="fa-solid fa-camera"></i>
                                        ДОБАВИТЬ ФОТО (необязательно)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"

                                        className="review-photo-input"
                                        id="review-photo"
                                    />
                                </div>
                                
                                <button type="submit" className="review-submit-btn">
                                    ОТПРАВИТЬ ОТЗЫВ
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
    )
}