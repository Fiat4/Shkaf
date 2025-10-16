import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import IConsultationFormData from '../../Types/Consultation';
import useApi, { ApiError } from '../../hook/UseApi';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId?: string;
    api:  ReturnType<typeof useApi>
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, productId, api }) => {
    const shit = useState()
   
    const {handleSubmit, register, formState: {errors}, reset} = useForm<IConsultationFormData>()
    

    const onSubmitForm = async (formdata: IConsultationFormData) => {
        
        const order = JSON.stringify({...formdata, product: productId})
        await api.createOrder(order)
        if (api.data) {
            reset()
        }
        onClose()
    }
    

    if (!isOpen) return null;

    return (
        <>
            <div className="order-modal-overlay" onClick={onClose}>
                <div className="order-modal" onClick={e => e.stopPropagation()}>
                    <button className="order-modal-close" onClick={onClose}>&times;</button>
                    
                    <div className="order-modal-content">
                        <div className="order-modal-left">
                            <h2 className="order-modal-title">Хотите оформить данный заказ?</h2>
                            <p className="order-modal-description">
                                Для этого заполните форму ниже, и мы свяжемся с вами в ближайшее время.
                            </p>
                        </div>
                        
                        <div className="order-modal-right">
                            <form onSubmit={handleSubmit(onSubmitForm)} className="order-form" >
                                <input
                                    type="text"
                                    placeholder="ВАШЕ ИМЯ"
                                    className="order-input"
                                    required
                                    {...register('userName', {required: 'Название продукта обязательно', minLength: {value: 2, message: 'Название должно содержать более 4х букв'}})}
                                />
                                
                                <input
                                    type="tel"
                                    placeholder="ВАШ ТЕЛЕФОН"
                                    className="order-input"
                                    required
                                    {...register('tel', {required: 'Номер телефона обзателен', pattern: {
                            value: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                            message: 'Некорректный номер телефона'
                        }})}
                                />
                                <input
                                    type="email"
                                    placeholder="ВАШ EMAIL"
                                    className="order-input"
                                    required
                                    {...register('email', {required: 'Почта обязательна', pattern: { value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, message: 'Некорректный почтовый адрес'}})}
                                />
                                <button type="submit" className="order-submit-btn">
                                    ОТПРАВИТЬ ЗАЯВКУ
                                </button>
                                <p className="order-privacy-text">
                                    Отправляя свои данные, вы подтверждаете свое согласие на обработку и хранение данных в соответствии с <a href="/privacy-policy" className="privacy-link">Политикой конфиденциальности</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default OrderModal;
