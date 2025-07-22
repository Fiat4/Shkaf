import React from "react";
import "./WorkCard.css";

interface WorkCardProps {
    image: string;
    title: string;
    description: string;
    onClick?: () => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ image, title, description, onClick }) => {
    return (
        <div className="work-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="work-card__image-wrapper">
                <img src={image} alt={title} className="work-card__image" />
            </div>
            <div className="work-card__info">
                <div className="work-card__title">{title}</div>
                <div className="work-card__description">{description}</div>
            </div>
        </div>
    );
};

export default WorkCard; 