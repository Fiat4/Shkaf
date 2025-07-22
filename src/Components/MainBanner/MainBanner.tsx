import React from "react";
import "./MainBanner.css";

const MainBanner = () => {
    return (
        <section className="hero-section">
            <div className="foto_container">
                <div className="consultation-form">
                    <h2 className="form-title">ОСТАВЬТЕ ЗАЯВКУ НА</h2>
                    <div className="form-subtitle">
                        <div className="svg-arrow">
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                                <line x1="0" y1="10" x2="95.4" y2="10" stroke="#BADD7F" stroke-width="1" />
                                <line x1="95" y1="10" x2="90" y2="5" stroke="#BADD7F" stroke-width="1" />
                                <line x1="95" y1="10" x2="90" y2="15" stroke="#BADD7F" stroke-width="1" />
                            </svg>
                        </div>
                        <h3>КОНСУЛЬТАЦИЮ</h3>
                    </div>
                    <form>
                        <input type="text" className="form-input" placeholder="Имя" required />
                        <input type="email" className="form-input" placeholder="Почта" required />
                        <input type="tel" className="form-input" placeholder="Телефон" required />
                        <label className="personal-data">
                            <input type="checkbox" required />
                            <span className="personal-data-text">Я согласен на обработку персональных данных</span>
                        </label>
                        <button type="submit" className="form-button">ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ</button>

                    </form>
                </div>
                <div className="banner-content">
                    <h2 className="banner-title mainpage-title">ГОТОВЫ РЕАЛИЗОВАТЬ<br />ВАШУ ИДЕЮ МЕЧТЫ</h2>
                </div>
            </div>
        </section>
    );
};

export default MainBanner;
