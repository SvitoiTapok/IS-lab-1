import React, {useEffect, useState} from 'react';
import './error.css';


const CustomError = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");


    const duration = 3000
    const showNotification = (notifMessage, notifType) => {
        setIsVisible(true);
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, duration);
        setMessage(notifMessage)
        setType(notifType)
        clearTimeout(hideTimer)
    }
    if (isVisible) return null;
    return (
        <div className={"error"}>
            {type === "notification" ? "NOTIFICATION" : "ERROR!"}<br/><br/>
            {message}
        </div>
    );
};

export default CustomError;