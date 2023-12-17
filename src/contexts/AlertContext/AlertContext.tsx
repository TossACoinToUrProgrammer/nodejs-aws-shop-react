import React, { PropsWithChildren, createContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export const AlertContext = createContext({ alert: "", showAlert: (prop: string) => { } });

const AlertContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] = useState('');

    const showAlert = (newValue: string) => {
        setAlert(newValue);
    };

    const handleClose = () => {
        showAlert('')
    }
    return (
        <>
            <AlertContext.Provider value={{ alert: alert, showAlert }}>
                {children}
                {alert &&
                    (<Snackbar open={!!alert} autoHideDuration={4000} onClose={handleClose}>
                        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={"error"}>
                            {alert}
                        </MuiAlert>
                    </Snackbar>)
                }
            </AlertContext.Provider>
        </>
    );
};

export default AlertContextProvider