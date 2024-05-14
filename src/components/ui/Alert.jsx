import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { RiCheckboxCircleFill, RiErrorWarningFill, RiInformationFill, RiAlertFill } from 'react-icons/ri';

const Alert = ({ isOpen, setIsOpen, message, type = 'success', onConfirm, duration = 1500 }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <RiCheckboxCircleFill className="text-green-500 text-2xl" />;
      case 'error':
        return <RiErrorWarningFill className="text-red-500 text-2xl" />;
      case 'info':
        return <RiInformationFill className="text-blue-500 text-2xl" />;
      case 'danger':
        return <RiAlertFill className="text-yellow-500 text-2xl" />;
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'info':
        return 'border-blue-500';
      case 'danger':
        return 'border-yellow-500';
      default:
        return '';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      onConfirm();
    }, duration);
    return () => clearTimeout(timer);
  }, [setIsOpen, isOpen, onConfirm, duration]);

  return (
    <Transition appear show={isOpen} as={Fragment} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
      <div className="fixed top-20 right-4 z-50">
        <div className={`bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm py-4 px-6 max-w-md border-l-4 rounded-lg flex items-center gap-3 shadow-lg ${getBorderColor()}`}>
          <div>{getIcon()}</div>
          <div>
            <h3 className="font-semibold">{type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : type === 'info' ? 'Información' : 'Peligro'}</h3>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Alert;