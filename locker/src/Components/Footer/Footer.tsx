import React from "react";
import { Link } from "react-router-dom";

const useWindowWidth = () => {
    const [width, setWidth] = React.useState<number | null>(null);

    React.useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
};

const Footer = () => {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth !== null && windowWidth <= 768;

    if (windowWidth === null) return null;

    return (
        <footer className="footer" id="contacts">
            <div className={`footer-content_1 ${isMobile ? 'mobile-layout' : ''}`}>
                {isMobile ? (
                    <>
                        <section className="mobile-footer-left">
                            <button className="button_footer">
                                <span>ПОДПИСАТЬСЯ НА РАССЫЛКУ</span>
                                <i className="fa-brands fa-telegram mobile-telegram-button"></i>
                            </button>
                            <p className="footer-text">Телефон: +7 (964) 777-25-25</p>
                            <p className="footer-text">Email: lockerwood@mail.ru</p>
                            <Link to="/privacy-policy" className="privacy-policy-link">
                                Персональные данные
                            </Link>
                        </section>
                        <section className="mobile-footer-right">
                            <div className="footer-logo"></div>
                        </section>
                    </>
                ) : (
                    <>
                        <section className="footer-section-left">
                            <div className="footer-logo"></div>
                        </section>
                        <section className="footer-section-right">
                            <button className="button_footer" title="Подписка на рассылку">
                                Подписаться на рассылку
                                <img
                                    className="telegram_icon"
                                    src="/icons/Telegram.svg"
                                    alt="Телеграм"
                                />
                            </button>
                            <p>Телефон: +7 (964) 777-25-25</p>
                            <p>Email: lockerwood@mail.ru</p>
                            <Link to="/privacy-policy" className="privacy-policy-link" title="Политика конфиденциальности">
                                Персональные данные
                            </Link>
                        </section>
                    </>
                )}
            </div>

            <hr />

            <div className="footer-content_2">
                {isMobile ? (
                    <>
                        <section className="footer-section-social">
                            <p>СОЦИАЛЬНЫЕ СЕТИ</p>
                        </section>
                        <section className="footer-section-networks">
                            <a type="button" id="tg" className="footer-link">
                                <i className="fa-brands fa-telegram"></i>
                            </a>
                            <a type="button" id="insta" className="footer-link">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a type="button" id="vk" className="footer-link">
                                <i className="fa-brands fa-vk"></i>
                            </a>
                        </section>
                        <section className="footer-section-mobile-copyright">
                            <p>© {new Date().getFullYear()} LockerWood. Все права защищены.</p>
                        </section>
                    </>
                ) : (
                    <>
                        <section className="footer-section-social">
                            <p>СОЦИАЛЬНЫЕ СЕТИ:</p>
                        </section>
                        <section className="footer-section-networks">
                            <a href="https://t.me/LockerWood" type="button" className="footer-link">
                                <i className="fa-brands fa-telegram" title="Телеграм"></i>
                            </a>
                            <a href="https://www.instagram.com/locker_wood?igsh=MzRlODBiNWFlZA==" type="button" id="insta" className="footer-link" title="Instagram *призван экстремистской организации и запрещен на территории РФ">
                                <i className="fa-brands fa-instagram" ></i>
                            </a>
                            <a href="https://vk.com/locker_wood?from=groups" type="button" id="vk" className="footer-link" title="ВКонтакте">
                                <i className="fa-brands fa-vk"></i>
                            </a>
                        </section>
                        <section className="footer-section-copyright">
                            <p>© {new Date().getFullYear()} LockerWood. Все права защищены.</p>
                        </section>
                    </>
                )}
            </div>
        </footer>
    );
};

export default Footer;