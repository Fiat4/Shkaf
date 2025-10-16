import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import OrderModal from "../OrderModal/OrderModal";
import "../OrderModal/OrderModal.css";

interface PopCardProps {
	title: string;
	description: string;
	img: string;
	id: string;
}

const PopCard: FC<PopCardProps> = ({ title, description, img, id }) => {
	return (
		<>
			<Link to={`/product/${id}`} className="product-card">
				<div className="product-image">
					<img src={img} alt="Фото продукта" />
				</div>
				<h3 className="product-title">{title}</h3>
				<p className="product-description">{description.substring(0, 80) + (description.length > 80 ? '...' : '')}</p>
			</Link>

		</>
	);
};

export default PopCard;
