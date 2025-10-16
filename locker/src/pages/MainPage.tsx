import React from "react";
import MainBanner from "../Components/MainBanner/MainBanner";
import PopCats from "../Components/PopCats/PopCats";
import Popular from "../Components/Popular/Popular";
import Reviews from "../Components/Reviews/Reviews";
import Footer from "../Components/Footer/Footer";
import "./MainPage.css";
import HeadMeta from "./../Components/HeadMeta/HeadMeta";
import Header from "../Components/Header/Header";
import AboutUs from "../Components/AboutUs/AboutUs";
import { PopUp } from "../Components/PopUp/PopUp";
const MainPage = () => {
	return (
		<React.Fragment>
			<HeadMeta
				title="LW - Главная"
				description="Магазин мебели - качественная мебель для вашего дома"
				keywords="мебель, шкафы, кровати, кухни, стенки, интерьер"
			/>
			<Header />
			<main id="scrolled">
				<MainBanner />
				<PopCats />

				<AboutUs />

				<Popular />

				<Reviews />
				<Footer />
			</main>
		</React.Fragment>
	);
};

export default MainPage;
