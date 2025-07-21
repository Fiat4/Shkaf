import React, { useEffect, useState } from "react";
import "./PopCats.css";

interface PopCatsProps {
	scrollClass?: string;
}

const PopCats: React.FC<PopCatsProps> = ({ scrollClass }) => {
	const [activeIndex, setActiveIndex] = useState(1);
	const [categoryItems] = useState([
		{ id: 1, image: "./img/bed.jpg", alt: "Кровати", name: "NIGGA", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: true},
		{ id: 2, image: "./img/shkaf.jpg", alt: "Шкафы", name: "NIGGA", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false},
		{ id: 3, image: "./img/kit.jpg", alt: "Кухни", name: "NIGGA", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false},
		{ id: 4, image: "./img/wal.jpg", alt: "Стенки", name: "NIGGA", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false},
		{ id: 5, image: "./img/wal.jpg", alt: "Стенки", name: "NIGGA", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false},
		{ id: 6, image: "./img/wal.jpg", alt: "Стенки", name: "NIGGA", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false},
		{ id: 7, image: "./img/wal.jpg", alt: "Стенки", name: "NIGGA", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false},
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
		 <section id="new" className="popular-section">
            <div className="katalog_container">
                <h2 className="mainpage-title products-title">НОВИНКИ</h2>
            </div>
			<div className="mobile-new-container">
				{categoryItems.map((item, index) => (
					<div className="mobile-new-item">
						<div className="mobile-new-img-wrapper">
							<img className="mobile-new-img" src={item.image} alt={item.alt} />
						</div>
						<div className="mobile-new-name-container">
							<h4 className="mobile-new-primary">{item.name}</h4>
							{item.new && (
								<h5 className="mobile-new-secondary mobile-new-tag">НОВИНКА</h5>
							)}
						</div>
						<h5 className="mobile-new-secondary">{item.description}</h5>
						<div className="mobile-new-price-container">
							<h4 className="mobile-new-price">{item.price} руб</h4>
							<button className="mobile-new-fav-button">
								<i className="fa-regular fa-heart"></i>
							</button>
						</div>
					</div>
				))}
			</div>
			{window.innerWidth > 768 ? 
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
            </div> : null}
            
        </section>
	);
};

export default PopCats;

				

