import { useState } from "react"
import Footer from "../Components/Footer/Footer"
import Header from "../Components/Header/Header"
import './MainPage.css'
import './ReviewsPage.css'

const ReviewsPage: React.FC = () => {
    const [hover, setHover] = useState<number>(0)
    const [rating, setRating] = useState<number>(-1)

    return (
        <>
            <Header />

            <main className="reviews-page">
                <div className="breadcrumbs">
                    <a href="Index.html">Главная</a> / <span>Отзывы</span>
                </div>

                <section className="add-review-section">
                    <h1>ОСТАВИТЬ ОТЗЫВ</h1>
                    <form className="review-form" id="reviewForm">
                        <div className="form-group">
                            <label htmlFor="name">ВАШЕ ИМЯ</label>
                            <input type="text" id="name" name="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">EMAIL</label>
                            <input type="email" id="email" name="email" required />
                        </div>

                        <div className="form-group">
                            <label>ОЦЕНКА</label>
                            <div className="rating">
                            {
                            [...Array(5)].map((item, index) => {
                                index += 1
                                return <div className="star_wrapper"><i className={`fa-solid fa-star star ${index <= (hover || rating) ? 'star-hover' : ''}`}
                                          onClick={()=> setRating(index)}
                                          onMouseEnter={() => setHover(index)}
                                          onMouseLeave={() => setHover(rating)}
                                        /></div>
                            })
                        }

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

            <Footer />
        </>
    )
}
export default ReviewsPage