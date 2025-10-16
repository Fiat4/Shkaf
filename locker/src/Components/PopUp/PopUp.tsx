import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface IPopUpProps {
    status: 'error' | 'success',
    message: string,
    setStateFunction: Dispatch<SetStateAction<boolean>>
    showTime: number
}

export const PopUp: FC<IPopUpProps> = ({status, message, setStateFunction, showTime}) => {
    useEffect(() => {
        setTimeout(() => {
            setStateFunction(false)
        }, showTime);
    }, [])

   
    return (
        <div className="cart-notification">
            <div className={"cart-notification-content " + status}>
                <i className={`fa-solid fa-circle-${status==='error' ? 'xmark' : 'check'}`}></i>
                <span>{message}</span>
            </div>
        </div>
        )

        

}