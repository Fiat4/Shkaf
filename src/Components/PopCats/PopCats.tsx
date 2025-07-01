import React, { useEffect, useState } from "react";
import "./PopCats.css";

interface PopCatsProps {
	scrollClass?: string;
}

const PopCats: React.FC<PopCatsProps> = ({ scrollClass }) => {
	const [activeIndex, setActiveIndex] = useState(1);
	const [categoryItems] = useState([
		{ id: 1, image: "./img/bed.jpg", alt: "Кровати" },
		{ id: 2, image: "./img/shkaf.jpg", alt: "Шкафы" },
		{ id: 3, image: "./img/kit.jpg", alt: "Кухни" },
		{ id: 4, image: "./img/wal.jpg", alt: "Стенки" },
		{ id: 5, image: "./img/wal.jpg", alt: "Стенки" },
		{ id: 6, image: "./img/wal.jpg", alt: "Стенки" },
		{ id: 7, image: "./img/wal.jpg", alt: "Стенки" },
	]);

	useEffect(() => {
		setActiveIndex(Math.floor(categoryItems.length / 2));
	}, [categoryItems.length]);

	useEffect(() => {
		// Проверяем, является ли устройство мобильным
		const isMobile = window.innerWidth <= 768;
		
		// На мобильных устройствах не применяем анимации слайдера
		if (isMobile) {
			return;
		}

		const updatePositions = () => {
			const items = document.querySelectorAll(".popular-section .category-item");
			items.forEach((item, index) => {
				const position = index - activeIndex;
				const element = item as HTMLElement;
				element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

				if (position === 0) {
					// Активный элемент (центр)
					element.style.transform = "translateX(0) translateZ(0) scale(1.4)";
					element.style.opacity = "1";
					element.style.zIndex = "5";
					element.classList.add("active");
					// Включаем ссылку для центрального элемента
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'auto';
						link.style.cursor = 'pointer';
					}
				} else if (position === -2) {
					// Крайний левый
					element.style.transform =
						"translateX(-180%) translateZ(-200px) scale(0.6)";
					element.style.opacity = "0.4";
					element.style.zIndex = "1";
					element.classList.remove("active");
					// Отключаем ссылку
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				} else if (position === -1) {
					// Левый
					element.style.transform =
						"translateX(-90%) translateZ(-100px) scale(0.8)";
					element.style.opacity = "0.7";
					element.style.zIndex = "2";
					element.classList.remove("active");
					// Отключаем ссылку
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				} else if (position === 1) {
					// Правый
					element.style.transform =
						"translateX(90%) translateZ(-100px) scale(0.8)";
					element.style.opacity = "0.7";
					element.style.zIndex = "2";
					element.classList.remove("active");
					// Отключаем ссылку
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				} else if (position === 2) {
					// Крайний правый
					element.style.transform =
						"translateX(180%) translateZ(-200px) scale(0.6)";
					element.style.opacity = "0.4";
					element.style.zIndex = "1";
					element.classList.remove("active");
					// Отключаем ссылку
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				} else {
					// Остальные элементы
					const direction = position > 0 ? 1 : -1;
					element.style.transform = `translateX(${
						direction * 200
					}%) translateZ(-300px) scale(0.4)`;
					element.style.opacity = "0";
					element.style.zIndex = "0";
					element.classList.remove("active");
					// Отключаем ссылку
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				}
			});
		};

		updatePositions();

		// Добавляем обработчик изменения размера окна
		const handleResize = () => {
			const isMobileNow = window.innerWidth <= 768;
			if (isMobileNow !== isMobile) {
				// Если изменился тип устройства, перезапускаем эффект
				updatePositions();
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [activeIndex]);

	// Добавляем обработчик клика по слайду для переключения
	const handleSlideClick = (index: number) => {
		// На мобильных устройствах не применяем анимации слайдера
		if (window.innerWidth <= 768) {
			return;
		}
		setActiveIndex(index);
	};

	return (
		 <section className="popular-section">
            <div className="katalog_container">
                <h2 className="products-title">НОВИНКИ</h2>
            </div>

            <div className="category-container">
                {categoryItems.map((item, index) => (
					<article 
						key={item.id} 
						className="category-item"
						onClick={() => handleSlideClick(index)}
					>
						<a href="#" className="category-link">
							<img
								src={item.image}
								alt={item.alt}
								className="category-image"
								loading="lazy"
							/>
						</a>
					</article>
				))}
            </div>  
        </section>
	);
};

export default PopCats;

				

