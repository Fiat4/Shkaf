import React, { useEffect, useState, useRef } from "react";
import PopCard from "./../PopCard/PopCard";

const useWindowWidth = () => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

const Popular = ({ dynamicText = "ПОПУЛЯРНОЕ" }) => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== null && windowWidth <= 768;

  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);

  function updateButtonStates() {
    if (prevBtnRef.current && productsGridRef.current && nextBtnRef.current) {
      prevBtnRef.current.disabled = productsGridRef.current.scrollLeft <= 0;
      nextBtnRef.current.disabled =
        productsGridRef.current.scrollLeft >=
        productsGridRef.current.scrollWidth - productsGridRef.current.clientWidth;
    }
  }

  useEffect(() => {
    updateButtonStates();
  }, []);

  if (windowWidth === null) return null;
	return (
		<section className="products-section">
			{isMobile ? ( 
				<div className="products-header">
					<h2 className="products-title mainpage-title">{dynamicText}</h2>
					<div className="mobile-buttons-container">
						<button
							className="nav-button prev"
							ref={prevBtnRef}
							onClick={() => productsGridRef.current?.scrollBy({ left: -220 * 3, behavior: "smooth" })}
							aria-label="Previous items"
							>
							<i className="fa-solid fa-arrow-left" />
						</button>

						<button
							className="nav-button next"
							ref={nextBtnRef}
							onClick={() => productsGridRef.current?.scrollBy({ left: 220 * 3, behavior: "smooth" })}
							aria-label="Next items"
							>
							<i className="fa-solid fa-arrow-right" />
						</button>
					</div>
				</div>) : (
				<div className="products-header">
					<h2 className="products-title mainpage-title">{dynamicText}</h2>
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
				</div>)}
					

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
