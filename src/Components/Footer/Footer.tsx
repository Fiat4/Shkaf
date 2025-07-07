import React from "react";

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

  if (windowWidth === null) return null; // avoid rendering until width is known

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
              <p className="footer-text">Телефон: +7 (999) 999-99-99</p>
              <p className="footer-text">Email: info@example.com</p>
              <address className="footer-text">Адрес: ул. Пушкина, д. 1, Москва, Россия</address>
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
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;