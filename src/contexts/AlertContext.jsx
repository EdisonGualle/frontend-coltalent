import React, { createContext, useState } from 'react';
import Alert from '../components/ui/Alert';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');

  const showAlert = (message, type = 'success') => {
    setMessage(message);
    setType(type);
    setIsOpenAlert(true);
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
      />
    </AlertContext.Provider>
  );
};