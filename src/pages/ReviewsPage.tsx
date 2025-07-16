import Footer from "../Components/Footer/Footer"
import Header from "../Components/Header/Header"
import './MainPage.css'
import './ReviewsPage.css'

const ReviewsPage: React.FC = () => {
    return (
        <>
        <Header/>

    <main className="reviews-page">
        <div className="breadcrumbs">
            <a href="Index.html">Главная</a> / <span>Отзывы</span>
        </div>

        <section className="add-review-section">
            <h1>ОСТАВИТЬ ОТЗЫВ</h1>
            <form className="review-form" id="reviewForm">
                <div className="form-group">
                    <label htmlFor="name">ВАШЕ ИМЯ</label>
                    <input type="text" id="name" name="name" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="email">EMAIL</label>
                    <input type="email" id="email" name="email" required/>
                </div>

                <div className="form-group">
                    <label>ОЦЕНКА</label>
                    <div className="rating">
                        <input type="radio" id="star5" name="rating" value="5"/>
                        <label htmlFor="star5"><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="star4" name="rating" value="4"/>
                        <label htmlFor="star4"><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="star3" name="rating" value="3"/>
                        <label htmlFor="star3"><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="star2" name="rating" value="2"/>
                        <label htmlFor="star2"><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="star1" name="rating" value="1"/>
                        <label htmlFor="star1"><i className="fa-solid fa-star"></i></label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="review">ВАШ ОТЗЫВ</label>
                    <textarea id="review" name="review" rows={5} required></textarea>
                </div>

                <button type="submit" className="submit-btn">ОТПРАВИТЬ ОТЗЫВ</button>
            </form>
        </section>

        <section className="reviews-section">
            <h2>ОТЗЫВЫ НАШИХ КЛИЕНТОВ</h2>
            
            <div className="reviews-container">
                <div className="review-card">
                    <div className="review-header">
                        <i className="fa-solid fa-circle-user"></i>
                        <div className="reviewer-info">
                            <h3>Александр</h3>
                            <div className="stars">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <span className="review-date">15.03.2024</span>
                        </div>
                    </div>
                    <p className="review-text">Отличное качество мебели! Заказывал кухонный гарнитур, все сделали точно в срок. Монтаж произвели быстро и качественно. Очень доволен результатом!</p>
                </div>


            </div>

            <div className="pagination">
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">...</button>
            </div>
        </section>
    </main>

    <Footer/>
    </>
    )
}
export default ReviewsPage