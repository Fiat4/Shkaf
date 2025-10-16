import React, { useEffect, useState } from "react";
import "./MainBanner.css";
import { useForm } from "react-hook-form";
import IConsultationFormData from "../../Types/Consultation";
import useApi from "../../hook/UseApi";
import { PopUp } from "../PopUp/PopUp";
import { useFormStatus } from "react-dom";
import { CircularProgress } from "@mui/material";

const MainBanner = () => {
    const {handleSubmit, register, formState: {errors, isSubmitting}, reset} = useForm<IConsultationFormData>()
    const {createOrder, error, data} = useApi()
    const [popUp, setPopUp] = useState<boolean>(false)
    const {pending} = useFormStatus()

    useEffect(() => {
        if (error || data ) {
            setPopUp(true)
        }
    }, [error, data])

    const onSubmitForm = async (formdata: IConsultationFormData) => {
        const order = JSON.stringify(formdata)
        await createOrder(order)
        reset()
    }

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
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <input type="text" className="form-input" placeholder="Имя" {...register('userName', {required: 'Название продукта обязательно', minLength: {value: 2, message: 'Название должно содержать более 4х букв'}})}  required />
                        {errors.userName && <p style={{ color: 'red' }}>⚠️ {errors.userName.message?.toString()}</p>}
                        <input type="email" className="form-input" placeholder="Почта" {...register('email', {required: 'Почта обязательна', pattern: { value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, message: 'Некорректный почтовый адрес'}})} required />
                        {errors.email && <p style={{ color: 'red' }}>⚠️ {errors.email.message?.toString()}</p>}
                        <input type="tel" className="form-input" placeholder="Телефон" {...register('tel', {required: 'Номер телефона обзателен', pattern: {
                            value: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                            message: 'Некорректный номер телефона'
                        }})} required />
                        {errors.tel && <p style={{ color: 'red' }}>⚠️ {errors.tel.message?.toString()}</p>}
                        <label className="personal-data">
                            <input type="checkbox" required />
                            <span className="personal-data-text">Я согласен на обработку персональных данных</span>
                        </label>
                        <button type="submit" className="form-button" disabled={isSubmitting ? true : false}>{isSubmitting ? <CircularProgress size={23} style={{color: 'white'}} /> : "ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ"}</button>

                    </form>
                </div>
                <div className="banner-content">
                    <h2 className="banner-title mainpage-title">ГОТОВЫ РЕАЛИЗОВАТЬ<br />  ВАШУ ИДЕЮ МЕЧТЫ</h2>
                </div>
            </div>
            {popUp && data  ? <PopUp message="Заявка успешно отправлена!" status="success" showTime={3000} setStateFunction={setPopUp}/> : null}
            {popUp && error ? <PopUp message="Ошибка отправки! Попробуйте позже." status="error" showTime={3000} setStateFunction={setPopUp}/> : null}
        </section>
    );
};

export default MainBanner;
