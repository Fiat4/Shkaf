const AboutUs: React.FC = () => {
    return (
        <>

        <section className="about_us">
            <div className="container_about">
                <div className="text-with-line">
                    <div className="text-wrapper">
                        <p className="text_11">О НАС</p>
                    </div>
                </div>
                
                <div className="conten">
                    <img src="./img/about.jpg" alt="О нас" className="image_about"/>
                    
                    <div className="text-block">
                        <article className="section">
                            <p className="section-text">
                                О Locker Wood — мебель, в которую влюбляются <br/>
                                Приветствуем вас в Locker Wood — молодой, но страстно увлечённой мебельной мастерской, где каждая деталь создаётся с мыслью о вас. <br/><br/>
                                Мы не просто делаем мебель — мы создаём уют, характер и настроение. Наша философия проста: качество, стиль и душевность в каждом изделии. Дерево — наш главный союзник, а вдохновение — ваш комфорт.
                            </p>
                        </article>
                        
                        <img src="./img/about_cont.jpg" alt="О нас" className="image_about_cont"/>
                        <p className="section-title"><span>ПОЧЕМУ</span> ВЫБИРАЮТ <br/>ИМЕННО<span> НАС</span></p>
                    </div>
                </div>
            </div>
        </section>
             <section className="about_us">
            <div className="container_about">
               
                <div id="con_content" className="conten">
                   
                    <div id="text-with-line_content" className="text-with-line">
                        <div className="text-wrapper">
                            <p className="text_11" id="text_11_mobile">МЫ ЗА <br/>КАЧЕСТВО</p>
                        </div>
                    </div>
                    
            
                    <div className="text-block_content">
                        <article className="section_content">
                            <div className="content_text">
                                <h1>Мы гарантируем высокое качество нашей продукции и используем только лучшие материалы. Наша команда профессионалов следит за каждым этапом производства, чтобы вы получили идеальный результат.</h1>
                            </div>
                        </article>
                    </div>
                </div>
    
                <div className="full-width-images">
                    <img src="./img/cont_1.jpg" alt="Пример работы 1" className="desktop-only"/>
                    <img src="./img/cont_2.jpg" alt="Пример работы 2" className="desktop-only"/>
                    <img src="./img/cont_3.jpg" alt="Пример работы 3" className="desktop-only"/>
                    <img src="./img/4.jpg" alt="Пример работы 4" className="desktop-only"/>
                    <img src="./img/cont_1.jpg" alt="Пример работы 1" className="mobile-only"/>
                </div>
            </div>
        </section>


        <section className="about_us">
            <div className="container_about">
                <div id="con_content" className="conten">
                    <div id="text-with-line_content_1" className="text-with-line">
                        <div className="text-wrapper">
                            <p className="text_11" >ПОМОЖЕМ С <br/>ИДЕЕЙ</p>
                        </div>
                    </div>
                    
              
                    <div className="text-block_content">
                        <article className="section_content">
                            <div className="content_text">
                                <h1>Мы гарантируем высокое качество и экологичность нашей мебели. Используем только лучшие материалы, чтобы вы могли наслаждаться комфортом и безопасностью в вашем доме.</h1>
                            </div>
                        </article>
                    </div>
                </div>
                <div className="full-width-images">
                    <img src="./img/about.jpg" alt="Пример работы 1" className="desktop-only"/>
                    <img src="./img/2.jpg" alt="Пример работы 2" className="desktop-only"/>
                    <img src="./img/3.jpg" alt="Пример работы 3" className="desktop-only"/>
                    <img src="./img/4.jpg" alt="Пример работы 4" className="desktop-only"/>
                    <img src="./img/about.jpg" alt="Пример работы 1" className="mobile-only"/>
                </div>
            </div>
        </section>
        </>
    )
}

export default AboutUs