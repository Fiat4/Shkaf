import React, { FC, useEffect, useState } from "react";
import ReviewCard from "../ReviewCard/ReviewCard";
import useApi from "../../hook/UseApi";
import ApiResponse from "../../Types/ApiResponse";
import { IReview, ReviewsResponse } from "../../Types/Reviews";
import { PaginationMeta } from "../../Types/ApiResponse";

const Reviews: FC = () => {
	const [page, setPage] = useState<number>(1);
	const { getReviews, data, loading, error } = useApi<ReviewsResponse>();

	useEffect(() => {
		getReviews(page, "organization", "rating", "desc", undefined, 4);
	}, [page]);

	if (!data || !data.data || data.data.length === 0) return null;

	return (
		<section className="reviews-section">
			<div className="reviews-header mainpage-title">
				<h2>ЧТО ГОВОРЯТ НАШИ КЛИЕНТЫ</h2>
			</div>

			<div className="reviews-container">
				{data.data.map((item) => {
					return (
						<ReviewCard
							key={item.id}
							customerName={item.username}
							review={item.review}
							rating={item.rating}
						/>
					);
				})}
			</div>

			<Pagination 
				meta={data.meta} 
				onPageChange={setPage}
			/>
		</section>
	);
};

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

export default Reviews;
