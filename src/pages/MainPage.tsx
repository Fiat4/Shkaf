import React, { FC, useEffect, useRef, useState } from "react";
import MainBanner from "../Components/MainBanner/MainBanner";
import PopCats from "../Components/PopCats/PopCats";
import Popular from "../Components/Popular/Popular";
import Reviews from "../Components/Reviews/Reviews";
import Footer from "../Components/Footer/Footer";
import "./MainPage.css";
import HeadMeta from "./../Components/HeadMeta/HeadMeta";
import Header from "../Components/Header/Header";
import AboutUs from "../Components/AboutUs/AboutUs";
const MainPage = () => {
	const [scrollClass, setScrollClass] = useState("scroll-1");

	const updateBackgroundOnScroll = () => {
		const scrollPosition = window.scrollY;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;

		// Вычисляем процент прокрутки
		const scrollPercent =
			(scrollPosition / (documentHeight - windowHeight)) * 100;

		// Определяем новый класс в зависимости от процента прокрутки
		let newClass = "scroll-1";
		if (scrollPercent >= 80) {
			newClass = "scroll-5";
		} else if (scrollPercent >= 60) {
			newClass = "scroll-4";
		} else if (scrollPercent >= 40) {
			newClass = "scroll-3";
		} else if (scrollPercent >= 20) {
			newClass = "scroll-2";
		}

		// Обновляем состояние только если класс изменился
		if (newClass !== scrollClass) {
			setScrollClass(newClass);
		}
	};

	useEffect(() => {
		// Добавляем обработчик события
		window.addEventListener("scroll", updateBackgroundOnScroll);

		// Вызываем сразу для начальной позиции
		updateBackgroundOnScroll();

		// Удаляем обработчик при размонтировании
		return () => {
			window.removeEventListener("scroll", updateBackgroundOnScroll);
		};
	}, [scrollClass]); // Зависимость от scrollClass
	return (
		<React.Fragment>
			<HeadMeta
				title="LW - Главная"
				description="Магазин мебели - качественная мебель для вашего дома"
				keywords="мебель, шкафы, кровати, кухни, стенки, интерьер"
			/>
			<Header />
			<main id="scrolled" className={scrollClass}>
				<MainBanner />

				<PopCats scrollClass={scrollClass} />

				<AboutUs/>

				<Popular />

				<Reviews />
				<Footer />
			</main>
		</React.Fragment>
	);
};

export default MainPage;
