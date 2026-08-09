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
				title="Locker Wood — мебель на заказ"
				fullTitle
				description="Кухни, шкафы, прихожие и другая мебель на заказ. Locker Wood — индивидуальный подход и качественные материалы."
				keywords="мебель на заказ, кухни, шкафы, прихожие, стенки, Locker Wood"
				image="/img/kitchen_mainn.jpg"
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
