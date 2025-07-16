import React from "react";
// import "./Footer.css";

const Footer = () => {
	return (
		<footer className="footer" id="contacts">
			<div className="footer-content_1">
				<section className="footer-section-left">
					<div className="footer-logo"></div>
				</section>

				<section className="footer-section-right">
					<button className="button_footer">
						Подписаться на рассылку
						<img
							className="telegram_icon"
							src="/icons/Telegram.svg"
							alt="Телеграм"
						/>
					</button>
					<p>Телефон: +7 (999) 999-99-99</p>
					<p>Email: info@example.com</p>
					<address>Адрес: ул. Пушкина, д. 1, Москва, Россия</address>
				</section>
			</div>
			<hr />
			<div className="footer-content_2">
				<section className="footer-section-social">
					<p>СОЦИАЛЬНЫЕ СЕТИ:</p>
				</section>
				<section className="footer-section-networks">
					<a type="button" className="footer-link">
						<i className="fa-brands fa-telegram"></i>
					</a>
					<a type="button" id="insta" className="footer-link">
						<i className="fa-brands fa-instagram"></i>
					</a>
					<a type="button" id="vk" className="footer-link">
						<i className="fa-brands fa-vk"></i>
					</a>
				</section>
				<section className="footer-section-copyright">
					<p>© 2025 LockerWood. Все права защищены.</p>
				</section>
			</div>
		</footer>
	);
};

export default Footer;
