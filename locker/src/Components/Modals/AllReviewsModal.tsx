





import React from 'react';
import { IReview } from '../../Types/Reviews';

interface ReviewCardProps {
    review: IReview;
    onPhotoClick: (photos: string[], startIndex: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onPhotoClick }) => {
    const [activePhoto, setActivePhoto] = React.useState(0);

    return (
        <div className="review-card">
            <div className="review-card-header">
                <div className="reviewer-info">
                    <div className="reviewer-avatar">
                       {review.avatar ? <img src={review.avatar} alt="Фото отзыва"/> : <span>{review.username.charAt(0)}</span>}
                    </div>
                    <div className="reviewer-details">
                        <h4>{review.username}</h4>
                        <div className="review-rating-stars">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`fa-star ${i < review.rating ? 'fa-solid' : 'fa-regular'}`}
                                ></i>
                            ))}
                        </div>
                        <span className="review-date">{new Date(review.created_at).toLocaleDateString('ru-RU', {day: '2-digit',month: '2-digit', year: 'numeric'})}</span>
                    </div>
                </div>
            </div>
            
            <div className="review-content">
                <p>{review.review}</p>
            </div>

            {review.imgs.length > 0 && (
                <div className="review-photos">
                    <div className="main-photo">
                        <img 
                            src={review.imgs[activePhoto]} 
                            alt="Фото отзыва" 
                        />
                    </div>
                    {review.imgs.length > 1 && (
                        <div className="photo-thumbs">
                            {review.imgs.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Фото ${index + 1}`}
                                    className={activePhoto === index ? 'active' : ''}
                                    onClick={() => setActivePhoto(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

interface AllReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reviews: IReview[];
}

const AllReviewsModal: React.FC<AllReviewsModalProps> = ({
    isOpen,
    onClose,
    reviews
}) => {
    if (!isOpen) return null;

    return (
        <div className="all-reviews-modal-overlay" onClick={onClose}>
            <div className="all-reviews-modal" onClick={e => e.stopPropagation()}>
                <button 
                    className="all-reviews-modal-close" 
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="all-reviews-modal-content">
                    <h2 className="all-reviews-modal-title">Все отзывы ({reviews.length})</h2>
                    <div className="all-reviews-list">
                        {reviews.map(review => (
                            <ReviewCard 
                                key={review.id} 
                                review={review} 
                                onPhotoClick={() => {}}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllReviewsModal;
