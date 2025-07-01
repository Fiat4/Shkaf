import React, { FC } from "react";
import ReviewCard from "../ReviewCard/ReviewCard";

const Reviews: FC = () => {
	return (
		<section className="reviews-section">
			<div className="reviews-header">
				<h2>ЧТО ГОВОРЯТ НАШИ КЛИЕНТЫ</h2>
			</div>

			<div className="reviews-container">
				<ReviewCard
					customerName="Александр"
					review="Отличное качество мебели! Заказывал кухонный гарнитур, все сделали
						точно в срок. Монтаж произвели быстро и качественно. Очень доволен
						результатом!"
				/>

				<ReviewCard
					customerName="Елена"
					review="Заказывала шкаф-купе в спальню. Дизайнер помог с выбором материалов
						и конфигурацией. Результат превзошел все ожидания. Спасибо за
						профессионализм!"
				/>
				<ReviewCard
					customerName="Михаил"
					review="Обратился за мебелью для всей квартиры. Понравился индивидуальный
				подход и внимание к деталям. Все выполнено качественно и со вкусом."
				/>
			</div>
		</section>
	);
};

export default Reviews;
