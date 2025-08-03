import { useState } from "react";

const AboutUs: React.FC = () => {
    const [toggletop, setToggletop] = useState(false);
    const [togglebottom, setTogglebottom] = useState(false);
    return (
        <>

            <section className="about_us">
                <div className="container_about">
                    <div className="text-with-line">
                        <div className="text-wrapper ">
                            <p className="text_11 mainpage-title">О НАС</p>
                        </div>
                    </div>

                    <div className="conten">
                        <img src="./img/about.jpg" alt="О нас" className="image_about" />

                        <div className="text-block">
                            <article className="section">
                                <h4 className="section-text mobile-new-primary">
                                    О Locker Wood — мебель, в которую влюбляются <br />
                                    Приветствуем вас в Locker Wood — молодой, но страстно увлечённой мебельной мастерской, где каждая деталь создаётся с мыслью о вас. <br /><br />
                                    Мы не просто делаем мебель — мы создаём уют, характер и настроение. Наша философия проста: качество, стиль и душевность в каждом изделии. Дерево — наш главный союзник, а вдохновение — ваш комфорт.
                                </h4>
                            </article>

                            <img src="./img/about_cont.jpg" alt="О нас" className="image_about_cont" />
                            <p className="section-title"><span>ПОЧЕМУ</span> ВЫБИРАЮТ <br />ИМЕННО<span> НАС</span></p>
                        </div>
                    </div>
                    <img src="/img/sofa.png" alt="О нас" className="mobile-img-about" />
                </div>
            </section>
            <div className="why-us">
                <div className="why-us-caption">
                    <div className="why-us-top">
                        <p className="mainpage-title green">ПОЧЕМУ </p>
                        <p className="mainpage-title">ВЫБИРАЮТ</p>
                    </div>
                    <div className="why-us-bottom">
                        <p className="mainpage-title">ИМЕННО </p>
                        <p className="mainpage-title green">НАС</p>
                        <div className="about-svg-arrow">
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                                <line x1="0" y1="10" x2="95.4" y2="10" stroke="#BADD7F" stroke-width="2" />
                                <line x1="95" y1="10" x2="90" y2="5" stroke="#BADD7F" stroke-width="2" />
                                <line x1="95" y1="10" x2="90" y2="15" stroke="#BADD7F" stroke-width="2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="collapsible-card">
                    <div
                        id="header"
                        className="collapsible-header"
                        onClick={() => {
                            setToggletop(prev => {
                                return !prev;
                            });
                        }}>
                        <h4 className="mobile-new-secondary grid-centered">ПОМОЖЕМ С ИДЕЕЙ</h4>
                        <i className={`fa-solid fa-chevron-up arrow-icon-top ${toggletop ? "expanded" : ""}`} />
                    </div>
                    <div
                        className="collapsible-content"
                        style={{
                            height: toggletop ? "7.5rem" : "0px",
                            paddingBottom: toggletop ? "5%" : "0px",
                        }}>
                        <h4 className="mobile-new-secondary">Мы гарантируем высокое качество и экологичность нашей мебели. Используем только лучшие материалы, чтобы вы могли наслаждаться комфортом и безопасностью в вашем доме.</h4>
                    </div>
                </div>
                <div className="why-us-img-container">
                    <img className="why-us-img" src="./img/sofa.png"></img>
                </div>
                <div className="collapsible-card">
                    <div
                        id="header"
                        className="collapsible-header"
                        onClick={() => {
                            setTogglebottom(prev => {
                                return !prev;
                            });
                        }}>
                        <h4 className="mobile-new-secondary grid-centered">МЫ ЗА КАЧЕСТВО</h4>
                        <i className={`fa-solid fa-chevron-up arrow-icon-bottom ${togglebottom ? "expanded" : ""}`} />
                    </div>
                    <div
                        className="collapsible-content"
                        style={{
                            height: togglebottom ? "7.5rem" : "0px",
                            paddingBottom: togglebottom ? "5%" : "0px",
                        }}>
                        <h4 className="mobile-new-secondary">Мы гарантируем высокое качество и экологичность нашей мебели. Используем только лучшие материалы, чтобы вы могли наслаждаться комфортом и безопасностью в вашем доме.</h4>
                    </div>
                </div>
                <div className="why-us-img-container">
                    <img className="why-us-img" src="./img/sofa.png"></img>
                </div>
            </div>




            <section className="about_us desktop-only">
                <div className="container_about">

                    <div id="con_content" className="conten-quality">

                        <div id="text-with-line_content" className="text-with-line">
                            <div className="text-wrapper">
                                <p className="text_11" id="text_11_mobile">МЫ ЗА <br />КАЧЕСТВО</p>
                            </div>
                        </div>


                        <div className="text-block_content">
                            <article className="section_content">
                                <div className="content_text">
                                    <h1 className="section-text">Мы гарантируем высокое качество нашей продукции и используем только лучшие материалы. Наша команда профессионалов следит за каждым этапом производства, чтобы вы получили идеальный результат.</h1>
                                </div>
                            </article>
                        </div>
                    </div>

                    <div className="full-width-images">
                        <img src="./img/cont_1.jpg" alt="Пример работы 1" className="desktop-only" />
                        <img src="./img/cont_2.jpg" alt="Пример работы 2" className="desktop-only" />
                        <img src="./img/cont_3.jpg" alt="Пример работы 3" className="desktop-only" />
                        <img src="./img/4.jpg" alt="Пример работы 4" className="desktop-only" />
                    </div>
                </div>
            </section>


            <section className="about_us desktop-only">
                <div className="container_about">
                    <div id="con_content" className="conten-quality">
                        <div id="text-with-line_content_1" className="text-with-line">
                            <div className="text-wrapper">
                                <p className="text_11" >ПОМОЖЕМ С <br />ИДЕЕЙ</p>
                            </div>
                        </div>


                        <div className="text-block_content">
                            <article className="section_content">
                                <div className="content_text">
                                    <h1 className="section-text">Мы гарантируем высокое качество и экологичность нашей мебели. Используем только лучшие материалы, чтобы вы могли наслаждаться комфортом и безопасностью в вашем доме.</h1>
                                </div>
                            </article>
                        </div>
                    </div>
                    <div className="full-width-images">
                        <img src="./img/about.jpg" alt="Пример работы 1" className="desktop-only" />
                        <img src="./img/2.jpg" alt="Пример работы 2" className="desktop-only" />
                        <img src="./img/3.jpg" alt="Пример работы 3" className="desktop-only" />
                        <img src="./img/4.jpg" alt="Пример работы 4" className="desktop-only" />
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutUs