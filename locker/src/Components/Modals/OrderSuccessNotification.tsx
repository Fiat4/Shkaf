





import React from 'react';

interface OrderSuccessNotificationProps {
    isVisible: boolean;
}

const OrderSuccessNotification: React.FC<OrderSuccessNotificationProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="order-success-notification">
            <div className="notification-content">
                <i className="fa-solid fa-check-circle"></i>
                <span>Заявка успешно отправлена!</span>
            </div>
        </div>
    );
};

export default OrderSuccessNotification;
