
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Footer from "../Components/Footer/Footer"
import Header from "../Components/Header/Header"
import HeadMeta from "../Components/HeadMeta/HeadMeta"
import './MainPage.css'
import './ReviewsPage.css'
import { useForm } from "react-hook-form"
import useApi from "../hook/UseApi"
import { CircularProgress } from "@mui/material"
import { PopUp } from "../Components/PopUp/PopUp"
import OrgReviews from "../Components/OrganizationReviews/OrgReviews"

interface IOrganizationReviewForm {
    username: string
    email: string
    review: string
    rating: number
}

const ReviewsPage: React.FC = () => {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
    const [hover, setHover] = useState<number>(0)
    const {createOrgReview, error, data} = useApi()
    const [popUp, setPopUp] = useState<boolean>(false)
    const {handleSubmit, register ,setValue, formState: {errors, isSubmitting,}, reset, getValues} = useForm<IOrganizationReviewForm>()
    useEffect(() => setValue('rating', 5), [])
    
    const onSubmit = async (formData: IOrganizationReviewForm) => {
        await createOrgReview(formData)
        reset()
        setValue('rating', 5)
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        if (error || data ) {
            setPopUp(true)
        }
    }, [error, data])

    

    return (
        <>
            <HeadMeta
                title="Отзывы"
                description="Отзывы клиентов о мебели Locker Wood. Оставьте свой отзыв о кухнях, шкафах и другой мебели на заказ."
                keywords="отзывы, Locker Wood, мебель на заказ, отзывы клиентов"
            />
            <Header />

            <main className="reviews-page">
                <div className="breadcrumbs">
                    <Link to="/">Главная</Link> / <span>Отзывы</span>
                </div>

                <section className="add-review-section">
                    <h1>ОСТАВИТЬ ОТЗЫВ</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="review-form" id="reviewForm">
                        <div className="form-group">
                            <label htmlFor="username">ВАШЕ ИМЯ</label>
                            <input type="text" className="form-input" placeholder="Имя" {...register('username', {required: 'Название продукта обязательно', minLength: {value: 2, message: 'Название должно содержать более 4х букв'}})}  required />
                            {errors.username && <p style={{ color: 'red' }}>⚠️ {errors.username.message?.toString()}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">EMAIL</label>
                            <input type="email" className="form-input" placeholder="Почта" {...register('email', {required: 'Почта обязательна', pattern: { value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, message: 'Некорректный почтовый адрес'}})} required />
                            {errors.email && <p style={{ color: 'red' }}>⚠️ {errors.email.message?.toString()}</p>}
                        </div>

                        <div className="form-group">
                            <label>ОЦЕНКА</label>
                            <div className="rating">

                            {
                            [...Array(5)].map((item, index) => {
                                index += 1
                                return <div className="star_wrapper"><i className={`fa-solid fa-star star ${index <= (hover || getValues('rating')) ? 'star-hover' : ''}`}
                                          onClick={()=> {
                                            setValue('rating', index)
                                          }}
                                          onMouseEnter={() => setHover(index)}
                                          onMouseLeave={() => setHover(getValues('rating'))}
                                        /></div>
                            })
                        }


                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="review">ВАШ ОТЗЫВ</label>
                            <textarea id="review" rows={5} required  {...register('review', {required: 'Название продукта обязательно', maxLength: {value: 300, message: 'Отзыв должен содержать до 300 символов.'}})}></textarea>
                        </div>

                        <button type="submit" className="submit-btn">{isSubmitting ? <CircularProgress size={20} style={{color: 'white'}}/> : 'ОТПРАВИТЬ ОТЗЫВ'}</button>
                    </form>
                </section>

                <OrgReviews refreshTrigger={refreshTrigger} />
            </main>

            <Footer />

                        {popUp && data  ? <PopUp message="Спасибо за отзыв!" status="success" showTime={3000} setStateFunction={setPopUp}/> : null}
                        {popUp && error ? <PopUp message="Отзыв не получилось отправить. Попробуйте позже!" status="error" showTime={3000} setStateFunction={setPopUp}/> : null}
        </>
    )
}
export default ReviewsPage