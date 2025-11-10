import React, {useEffect, useState} from 'react';
import './error.css';


const CustomError = (props) => {
    const [isVisible, setIsVisible] = useState(true);


    const duration = 3000
    useEffect(() => {
        // Полностью скрываем через duration
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => {
            clearTimeout(hideTimer);
        };
    }, [duration]);

    if (!props.isVisible) return null;
    return (
        <div className={props?.classname||"error"}>
            {props.classname==="notification"?"NOTIFICATION":"ERROR!"}<br/><br/>
            {props.value}
        </div>
    );
};

export default CustomError;