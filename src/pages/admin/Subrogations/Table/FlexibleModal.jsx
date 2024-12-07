import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

// Utilidad para acceder a campos anidados
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const FlexibleModal = ({ data, config, title, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleClickOutside = (event) => {
    if (event.target.id === 'modal-background') {
      onClose();
    }
  };

  const renderContent = (configs) => {
    return configs.map((item, index) => {
      const value = getNestedValue(data, item.key);
      if (value !== null && value !== undefined) {
        return (
          <div key={index} className="mb-2">
            <strong className="block text-gray-700">{item.label}:</strong>
            <span>{value}</span>
          </div>
        );
      }
      return null;
    });
  };

  const isArrayConfig = Array.isArray(config[0]);

  const shouldRenderSection = (configs) => {
    return configs.some(item => {
      const value = getNestedValue(data, item.key);
      return value !== null && value !== undefined;
    });
  };

  const visibleConfigs = isArrayConfig ? config.filter(shouldRenderSection) : [config];

  return (
    <div
      id="modal-background"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClickOutside}
    >
      <div
        className={`bg-white rounded-lg p-4 shadow-lg relative ${
          visibleConfigs.length > 1 ? ' max-w-2xl' : ' max-w-md'
        } w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        {title && <h2 className=" text-blue-900 text-lg  font-bold  mb-4 text-center">{title}</h2>}
        <div className={`grid ${visibleConfigs.length > 1 ? 'grid-cols-1 sm:grid-cols-2 gap-4' : 'grid-cols-1'}`}>
          {visibleConfigs.map((subConfig, idx) => (
            <div key={idx} className="border p-2 rounded-lg">
              {renderContent(subConfig)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlexibleModal;
