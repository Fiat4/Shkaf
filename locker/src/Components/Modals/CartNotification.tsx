import React from 'react';

interface CartNotificationProps {
    isVisible: boolean;
}

const CartNotification: React.FC<CartNotificationProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="cart-notification">
            <div className="cart-notification-content">
                <i className="fa-solid fa-check-circle"></i>
                <span>Товар добавлен в корзину!</span>
            </div>
        </div>
    );
};

export default CartNotification;
