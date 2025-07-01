import React, { useEffect, useRef } from "react";
import PopCard from "./../PopCard/PopCard";
const Popular = () => {
	let prevBtnRef = useRef<HTMLButtonElement>(null),
		nextBtnRef = useRef<HTMLButtonElement>(null),
		productsGridRef = useRef<HTMLDivElement>(null);

	function updateButtonStates() {
		if (prevBtnRef.current && productsGridRef.current && nextBtnRef.current) {
			prevBtnRef.current.disabled = productsGridRef.current.scrollLeft <= 0;
			nextBtnRef.current.disabled =
				productsGridRef.current.scrollLeft >=
				productsGridRef.current.scrollWidth -
					productsGridRef.current.clientWidth;
		}
	}

	useEffect(() => {
		updateButtonStates();
	}, []);
	return (
		<section className="products-section">
			<div className="products-header">
				<h2 className="products-title">Популярное</h2>
				<div className="products-nav">
					<button
						className="nav-button prev"
						ref={prevBtnRef}
						onClick={() => {
							if (productsGridRef.current) {
								productsGridRef.current.scrollBy({
									left: -220 * 3,
									behavior: "smooth",
								});
							}
						}}
					></button>
					<button
						className="nav-button next"
						ref={nextBtnRef}
						onClick={() => {
							if (productsGridRef.current) {
								productsGridRef.current.scrollBy({
									left: 220 * 3,
									behavior: "smooth",
								});
							}
						}}
					></button>
				</div>
			</div>

			<div
				className="products-grid"
				ref={productsGridRef}
				onScroll={updateButtonStates}
			>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={10000}
					img="./img/bed.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={10000}
					img="./img/bed.jpg"
				/>

				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={10000}
					img="./img/bed.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={10000}
					img="./img/bed.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={10000}
					img="./img/bed.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={15000}
					img="./img/shkaf.jpg"
				/>

				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={20000}
					img="./img/kit.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={25000}
					img="./img/wal.jpg"
				/>

				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={30000}
					img="./img/bed.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={35000}
					img="./img/shkaf.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={40000}
					img="./img/kit.jpg"
				/>

				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={20000}
					img="./img/wal.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={20000}
					img="./img/bed.jpg"
				/>
				<PopCard
					title="Текст"
					description="Lorem Ipsum Dolor Sit Amet"
					price={20000}
					img="./img/shkaf.jpg"
				/>
			</div>
		</section>
	);
};

export default Popular;
