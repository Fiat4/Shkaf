import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PopCats.css";
import useApi from "../../hook/UseApi";
import IProduct, { ProductsResponse } from "../../Types/Product";

interface PopCatsProps {}

const PopCats: React.FC<PopCatsProps> = () => {
	const [activeIndex, setActiveIndex] = useState(1);
	const {getPopularProducts, data: categoryItems, loading, error} = useApi<ProductsResponse>()

	useEffect(() => {
		getPopularProducts("desc")
	}, [])

	useEffect(() => {
		if (categoryItems) {
			console.log(categoryItems);
			setActiveIndex(Math.floor(categoryItems.data.length / 2));
		}
	}, [categoryItems]);

	useEffect(() => {
		const isMobile = window.innerWidth <= 768;

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
					element.style.transform = "translateX(0) translateZ(0) scale(1.4)";
					element.style.opacity = "1";
					element.style.zIndex = "5";
					element.classList.add("active");
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'auto';
						link.style.cursor = 'pointer';
					}
				} else if (position === -2) {
					element.style.transform =
						"translateX(-180%) translateZ(-200px) scale(0.6)";
					element.style.opacity = "0.4";
					element.style.zIndex = "1";
					element.classList.remove("active");
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				} else if (position === -1) {
					element.style.transform =
						"translateX(-90%) translateZ(-100px) scale(0.8)";
					element.style.opacity = "0.7";
					element.style.zIndex = "2";
					element.classList.remove("active");
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				} else if (position === 1) {
					element.style.transform =
						"translateX(90%) translateZ(-100px) scale(0.8)";
					element.style.opacity = "0.7";
					element.style.zIndex = "2";
					element.classList.remove("active");
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				} else if (position === 2) {
					element.style.transform =
						"translateX(180%) translateZ(-200px) scale(0.6)";
					element.style.opacity = "0.4";
					element.style.zIndex = "1";
					element.classList.remove("active");
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				} else {
					const direction = position > 0 ? 1 : -1;
					element.style.transform = `translateX(${direction * 200
						}%) translateZ(-300px) scale(0.4)`;
					element.style.opacity = "0";
					element.style.zIndex = "0";
					element.classList.remove("active");
					const link = element.querySelector('.category-link') as HTMLAnchorElement;
					if (link) {
						link.style.pointerEvents = 'none';
						link.style.cursor = 'default';
					}
				}
			});
		};

		updatePositions();

		const handleResize = () => {
			const isMobileNow = window.innerWidth <= 768;
			if (isMobileNow !== isMobile) {
				updatePositions();
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [activeIndex]);


	const handleSlideClick = (index: number) => {
		if (window.innerWidth <= 768) {
			return;
		}
		setActiveIndex(index);
	};


	return (
		<section className="popular-section" id="new">
			<div className="katalog_container">
				<h2 className="mainpage-title products-title">НОВИНКИ</h2>
			</div>
			<div className="mobile-new-container">
				{categoryItems ? categoryItems.data.map((item, index) => (
					<Link key={item.id} to={`/product/${item.id}`} className="mobile-new-item">
						<div className="mobile-new-img-wrapper">
							<img className="mobile-new-img" src={item.avatar} alt={item.name} />
						</div>
						<div className="mobile-new-content">
							<div className="mobile-new-name-container">
								<h4 className="mobile-new-primary">{item.name}</h4>
							</div>
							<h5 className="mobile-new-secondary">{item.description}</h5>
						</div>
					</Link>
				)) : null}
			</div>
			{window.innerWidth > 768 ?
				<div className="category-container">
					{categoryItems ? categoryItems.data.map((item, index) => (
						<article
							key={item.id}
							className="category-item"
							onClick={() => handleSlideClick(index)}
						>
							<Link to={`/product/${item.id}`} className="category-link">
								<img
									src={item.avatar}
									alt={item.name}
									className="category-image"
									loading="lazy"
								/>
							</Link>
						</article>
					)) : null}
				</div> : null}
		</section>
	);
};

export default PopCats;



