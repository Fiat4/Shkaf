import React, { FC } from "react";
import { Link } from "react-router-dom";

interface PopCardProps {
	title: string;
	description: string;
	img: string;
	price: number;
}

const PopCard: FC<PopCardProps> = ({ title, description, img, price }) => {
	return (
		<Link to="product" className="product-card">
			<div className="product-image">
				<img src={img} alt="Фото продукта" />
			</div>
			<h3 className="product-title">{title}</h3>
			<p className="product-description">{description}</p>
			<div className="mobile-new-price-container">
				<span className="product-price">{price} руб</span>
				<button className="mobile-new-fav-button">
					<i className="fa-regular fa-heart"></i>
				</button>
			</div>
		</Link>
	);
};

export default PopCard;
