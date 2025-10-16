import React, { FC } from "react";

interface ReviewCardProps {
	customerName: string;
	review: string;
	rating: number;
}

const ReviewCard: FC<ReviewCardProps> = ({ customerName, review, rating }) => {
	return (
		<div className="review-card">
			<div className="review-header">
				<i className="fa-solid fa-circle-user"></i>
				<div className="reviewer-info">
					<h3>{customerName}</h3>
					<div className="stars">
						{Array.from({ length: rating }, (_, index) => (
							<i key={index} className="fa-solid fa-star"></i>
						))}
					</div>
				</div>
			</div>
			<p className="review-text">{review}</p>
		</div>
	);
};

export default ReviewCard;
