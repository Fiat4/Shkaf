import React, { useEffect, useState, useRef } from "react";
import PopCard from "./../PopCard/PopCard";
import IProduct from "../../Types/Product";
import useApi from "../../hook/UseApi";
import ApiResponse from "../../Types/ApiResponse";

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

	const {getRecentProducts, data, error} = useApi<ApiResponse<IProduct>>()

	useEffect(() => {
		getRecentProducts("desc", 12)
		updateButtonStates();
	}, []);
	console.log(data)

	if (windowWidth === null) return null;
	if (data && data?.data.length <= 0) return null
	return (
		<section id="new" className="products-section">
			{isMobile ? (
				<div className="products-header">
					<h2 className="products-title mainpage-title">{dynamicText}</h2>
				</div>) : (
				<div className="products-header">
					<h2 className="products-title mainpage-title">{dynamicText}</h2>
				</div>)}


			<div className="products-grid-wrapper">
				<div
					className="products-grid"
					ref={productsGridRef}
					onScroll={updateButtonStates}
				>
					{isMobile ? null : null}

					{data ? data.data.map((item) => (
						<PopCard
						id={item.id}
						title={item.name}
						description={item.description}
						img={item.avatar}
						/>
					)) : null}
				</div>
				{!isMobile && (
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
				)}
			</div>
		</section>
	);
};

export default Popular;
