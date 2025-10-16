




import { useState } from 'react';

export const useModals = () => {
    const [showCartNotification, setShowCartNotification] = useState<boolean>(false);
    const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
    const [showOrderSuccessNotification, setShowOrderSuccessNotification] = useState<boolean>(false);
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [showAllReviewsModal, setShowAllReviewsModal] = useState<boolean>(false);

    const showCartAddedNotification = () => {
        setShowCartNotification(true);
        setTimeout(() => {
            setShowCartNotification(false);
        }, 3000);
    };

    const openOrderModal = () => setShowOrderModal(true);
    const closeOrderModal = () => setShowOrderModal(false);

    const showOrderSuccess = () => {
        setShowOrderSuccessNotification(true);
        setTimeout(() => {
            setShowOrderSuccessNotification(false);
        }, 4000);
    };

    const openReviewModal = () => setShowReviewModal(true);
    const closeReviewModal = () => setShowReviewModal(false);
    const openAllReviewsModal = () => setShowAllReviewsModal(true);
    const closeAllReviewsModal = () => setShowAllReviewsModal(false);

    return {
        showCartNotification,
        showOrderModal,
        showOrderSuccessNotification,
        showReviewModal,
        showAllReviewsModal,
        showCartAddedNotification,
        openOrderModal,
        closeOrderModal,
        showOrderSuccess,
        openReviewModal,
        closeReviewModal,
        openAllReviewsModal,
        closeAllReviewsModal,
        setShowReviewModal,
        setShowAllReviewsModal
    };
};
