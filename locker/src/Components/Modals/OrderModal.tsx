










import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IOrder, IOrderForm } from '../../Types/Orders';
import useApi from '../../hook/UseApi';
import { CircularProgress } from '@mui/material';

interface OrderForm {
    name: string;
    phone: string;
    email: string;
    captcha: string;
}

interface OrderModalProps {
    onClose: () => void;
    productId: string
    setNotification: () => void
    api: ReturnType<typeof useApi<IOrder>>;
}

const OrderModal: React.FC<OrderModalProps> = ({
    onClose,
    productId,
    setNotification,
    api
}) => {
    const {handleSubmit, register, formState: {errors, isSubmitting, isDirty}, reset} = useForm<IOrderForm>()

    const onSubmitForm = async (formdata: IOrderForm) => {
            const order = JSON.stringify({...formdata, product: productId})
            await api.createOrder(order)
        }
    
        useEffect(() => {
            if (api.data || api.error) {
                onClose()
                reset()
                setNotification()
            }
        }, [api.data, api.error])

    return (
        <div className="order-modal-overlay"  onClick={(e) => {
            e.stopPropagation()
            onClose()
        }}>
            <div className="order-modal" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="order-modal-close" >&times;</button>
                
                <div className="order-modal-content">
                    <div className="order-modal-left">
                        <h2 className="order-modal-title">Хотите оформить данный заказ?</h2>
                        <p className="order-modal-description">
                            Для этого заполните форму ниже, и мы свяжемся с вами в ближайшее время.
                        </p>
                    </div>
                    
                    <div className="order-modal-right">
                        <form className="order-form" onSubmit={handleSubmit(onSubmitForm)}>
                            <input
                                type="text"
                                placeholder="ВАШЕ ИМЯ"
                                className="order-input"
                                {...register('userName', {required: 'Название продукта обязательно', minLength: {value: 2, message: 'Название должно содержать более 4х букв'}})}
                                required
                            />
                            <input
                                type="tel"
                                {...register('tel', {required: 'Номер телефона обзателен', pattern: {
                                    value: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                                    message: 'Некорректный номер телефона'
                                }})}
                                placeholder="ВАШ ТЕЛЕФОН"
                                className="order-input"
                                required
                            />
                            {errors.tel && <p style={{ color: 'red' }}>⚠️ {errors.tel.message?.toString()}</p>}
                            <input
                                type="email"
                                {...register('email', {required: 'Почта обязательна', pattern: { value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, message: 'Некорректный почтовый адрес'}})}
                                placeholder="ВАШ EMAIL"
                                className="order-input"
                                required
                            />
                            {errors.email && <p style={{ color: 'red' }}>⚠️ {errors.email.message?.toString()}</p>}
                            <button type="submit" className="order-submit-btn"  disabled={isSubmitting ? true : false}>{isSubmitting ? <CircularProgress size={23} style={{color: 'white'}} /> :
                                "ОТПРАВИТЬ ЗАЯВКУ"}
                            </button>
                            <p className="order-privacy-text">
                                Отправляя свои данные, вы подтверждаете свое согласие на обработку и хранение данных в соответствии с <a href="/privacy-policy" className="privacy-link">Политикой конфиденциальности</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
