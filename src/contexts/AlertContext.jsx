import React, { createContext, useState } from 'react';
import Alert from '../components/ui/Alert';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const [duration, setDuration] = useState(1500);

  const showAlert = (message, type = 'success', duration) => {
    setMessage(message);
    setType(type);
    setIsOpenAlert(true);
    setDuration(duration || 1500);
  };

  const hideAlert = () => {
    setIsOpenAlert(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Alert
        isOpen={isOpenAlert}
        setIsOpen={setIsOpenAlert}
        message={message}
        type={type}
        onConfirm={hideAlert}
        duration={duration}
      />
    </AlertContext.Provider>
  );
};