import React, { FC } from "react";

interface ReviewCardProps {
	customerName: string;
	review: string;
}

const ReviewCard: FC<ReviewCardProps> = ({ customerName, review }) => {
	return (
		<div className="review-card">
			<div className="review-header">
				<i className="fa-solid fa-circle-user"></i>
				<div className="reviewer-info">
					<h3>{customerName}</h3>
					<div className="stars">
						<i className="fa-solid fa-star"></i>
						<i className="fa-solid fa-star"></i>
						<i className="fa-solid fa-star"></i>
						<i className="fa-solid fa-star"></i>
						<i className="fa-solid fa-star"></i>
					</div>
				</div>
			</div>
			<p className="review-text">{review}</p>
		</div>
	);
};

export default ReviewCard;
