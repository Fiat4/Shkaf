import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import OrderModal from "../OrderModal/OrderModal"
import "../OrderModal/OrderModal.css"
import IProduct from "../../Types/Product"
import useApi from "../../hook/UseApi"
import { PopUp } from "../PopUp/PopUp"

const ProductCard: React.FC<{product: IProduct}> = ({product}) => {
    const { name, avatar, description} = product
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showOrderSuccessNotification, setShowOrderSuccessNotification] = useState(false);
    const api = useApi()
    const [popUp, setPopUp] = useState<boolean>(false)
    
        useEffect(() => {
            if (api.error || api.data ) {
                setPopUp(true)
            }
        }, [api.error, api.data])

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowOrderModal(true);
    };

    const handleOrderSubmit = () => {
        setShowOrderSuccessNotification(true);
        setTimeout(() => {
            setShowOrderSuccessNotification(false);
        }, 4000);
    };

    return (
        <>
            <Link className='product-link' to={'/product/' + product.id}>
                <div className="product-card__cat" >
                <div className="product-image__cat">
                    <img src={avatar} alt="Кухня 'Практик'" />
                </div>
                <div className="product-info__cat">
                    <div className="product-title__cat">
                        {name}
                    </div>
                    <p className="product-description__cat">{description.substring(0, 44) + (description.length > 44 ? '...' : '')}</p>
                    <div className="product-price-container__cat">
                        <div className="product-button-container">
                            <button className="add-to-cart-button" >Подробнее</button>
                            <button 
                                className="product-favorite-button"
                                onClick={handleFavoriteClick}
                            >
                                <i className="fa-regular fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </Link>

            <OrderModal
                isOpen={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                productId={product.id}
                api={api}
            />

            {showOrderSuccessNotification && (
                <div className="order-success-notification">
                    <div className="notification-content">
                        <i className="fa-solid fa-check-circle"></i>
                        <span>Заявка успешно отправлена!</span>
                    </div>
                </div>
            )}

            {popUp && api.data  ? <PopUp message="Заявка успешно отправлена!" status="success" showTime={3000} setStateFunction={setPopUp}/> : null}
                        {popUp && api.error ? <PopUp message="Ошибка отправки! Попробуйте позже." status="error" showTime={3000} setStateFunction={setPopUp}/> : null}
        </>
    )
}
export default ProductCard