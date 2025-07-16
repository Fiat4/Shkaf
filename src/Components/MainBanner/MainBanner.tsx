import React from "react";
import "./MainBanner.css";

const MainBanner = () => {
	return (
		<section className="hero-section">
            <div className="foto_container">
                <div className="consultation-form">
                    <h2 className="form-title">ОСТАВЬТЕ ЗАЯВКУ НА</h2>
                    <h3 className="form-subtitle">КОНСУЛЬТАЦИЮ</h3>
                    <form>
                        <input type="text" className="form-input" placeholder="Имя" required/>
                        <input type="email" className="form-input" placeholder="Почта" required/>
                        <input type="tel" className="form-input" placeholder="Телефон" required/>
                        <label className="personal-data">
                            <input type="checkbox" required/>
                            <span className="personal-data-text">Я согласен на обработку персональных данных</span>
                        </label>
                        <button type="submit" className="form-button">ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ</button>

                    </form>
                </div>
                <div className="banner-content">
                    <h2 className="banner-title">ГОТОВЫ РЕАЛИЗОВАТЬ<br/>ВАШУ ИДЕЮ МЕЧТЫ</h2>
                </div>
            </div>
        </section>
	);
};

export default MainBanner;
