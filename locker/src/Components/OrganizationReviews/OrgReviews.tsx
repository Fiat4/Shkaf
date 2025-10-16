import { FC, useEffect, useState } from "react"
import useApi from "../../hook/UseApi"
import { ReviewsResponse } from "../../Types/Reviews"
import { PaginationMeta } from "../../Types/ApiResponse"
interface OrgReviewsProps {
  refreshTrigger?: number;
}
const OrgReviews: FC<OrgReviewsProps> = ({refreshTrigger}) => {
    const [page, setPage] = useState<number>(1) 
    const {data, loading, error, getReviews} = useApi<ReviewsResponse>()

    useEffect(() => {    
        getReviews(page, 'organization', "rating", "desc", undefined, 4)   
    }, [page, refreshTrigger]);

    return (
        <section className="reviews-section">
            <h2>ОТЗЫВЫ НАШИХ КЛИЕНТОВ</h2>

            <div className="reviews-container">
                {data?.data.map(item => {

                    return (                    
                        <div className="review-card">
                            <div className="review-header">
                                <i className="fa-solid fa-circle-user"></i>
                                <div className="reviewer-info">
                                    <h3>{item.username}</h3>
                                    <div className="stars">
                                        {
                                            [...Array(item.rating)].map(() => <i className="fa-solid fa-star"/>)
                                        }
                                    </div>
                                    <span className="review-date">{new Date(item.created_at).toLocaleDateString('ru-RU', {day: '2-digit',month: '2-digit', year: 'numeric'})}</span>
                                </div>
                            </div>
                            <p className="review-text">{item.review}</p>
                        </div>
                    )
                })}
            </div>
            <Pagination 
                meta={data?.meta} 
                onPageChange={setPage}
            />

        </section>
    )
}

interface PaginationProps {
    meta: PaginationMeta | undefined;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
    if (!meta || meta.totalPages <= 1) return null;

    const { page, totalPages, hasNext, hasPrev } = meta;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; 
        
        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination">
            <button 
                className={`page-btn ${!hasPrev ? 'disabled' : ''}`}
                onClick={() => hasPrev && onPageChange(page - 1)}
                disabled={!hasPrev}
            >
                ←
            </button>

            {pageNumbers.map((pageNum, index) => (
                typeof pageNum === 'string' ? (
                    <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                ) : (
                    <button
                        key={pageNum}
                        className={`page-btn ${pageNum === page ? 'active' : ''}`}
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </button>
                )
            ))}

            <button 
                className={`page-btn ${!hasNext ? 'disabled' : ''}`}
                onClick={() => hasNext && onPageChange(page + 1)}
                disabled={!hasNext}
            >
                →
            </button>
        </div>
    );
};

export default OrgReviews