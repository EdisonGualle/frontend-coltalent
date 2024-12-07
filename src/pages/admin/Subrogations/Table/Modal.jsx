import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 shadow-lg relative max-w-md w-full">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
