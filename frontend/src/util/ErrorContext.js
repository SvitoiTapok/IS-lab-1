import React, {createContext, useContext, useState} from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({children}) => {
    const [errors, setErrors] = useState([]);

    const showError = (message) => {
        const id = Date.now()
        const type = "err"
        setErrors([...errors, {id, message, type}]);
        setTimeout(() => hideError(id), 5000);
    };
    const showNotification = (message) => {
        const id = Date.now()
        const type = "notif"
        setErrors([...errors, {id, message, type}]);
        setTimeout(() => hideError(id), 3000);
        console.log(message)
    };
    const hideError = (id) =>
        setErrors(errors => errors.filter(e => e.id != id));


    return (
        <ErrorContext.Provider value={{showError, hideError, showNotification}}>
            {children}

            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                {errors.map((error) => (
                        <div style={{
                            marginLeft: '10px',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '5px',
                            background: error.type === "err" ? "red" : "green",
                            cursor: 'pointer'
                        }}>
                            {error.message}
                            <button
                                onClick={() => hideError(error.id)}
                                style={{marginLeft: '10px', background: 'white', border: 'none'}}
                            >
                                ×
                            </button>
                        </div>

                    )
                )}
            </div>
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    return useContext(ErrorContext);
};