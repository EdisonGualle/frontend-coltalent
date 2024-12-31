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

      if (Array.isArray(value)) {
        return (
          <div key={index} className="mb-2">
            <strong className="block text-gray-800 text-sm font-semibold mb-1">
              {item.label}:
            </strong>
            <ul className="bg-gray-100 p-3 rounded-md shadow-inner">
              {value.map((v, i) => (
                <li
                  key={i}
                  className="text-gray-700 text-sm py-1 flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {v.name || JSON.stringify(v)}
                </li>
              ))}
            </ul>
          </div>
        );
      } else if (value !== null && value !== undefined) {
        return (
          <div key={index} className="mb-2">
            <strong className="block text-gray-800 text-sm font-semibold">
              {item.label}:
            </strong>
            <span className="text-gray-600 text-sm">{value}</span>
          </div>
        );
      }
      return null;
    });
  };

  const isArrayConfig = Array.isArray(config[0]);

  const shouldRenderSection = (configs) => {
    return configs.some((item) => {
      const value = getNestedValue(data, item.key);
      return value !== null && value !== undefined;
    });
  };

  const visibleConfigs = isArrayConfig
    ? config.filter(shouldRenderSection)
    : [config];

  return (
    <div
      id="modal-background"
      className="fixed inset-0 bg-gray-300 bg-opacity-40 flex justify-center items-center z-50"
      onClick={handleClickOutside}
    >
      <div
        className={`bg-white rounded-lg p-5 shadow-lg relative ${
          visibleConfigs.length > 1 ? 'max-w-2xl' : 'max-w-md'
        } w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes size={18} />
        </button>
        {title && (
          <h2 className="text-blue-800 text-lg font-semibold text-center mb-3">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-3">
          {visibleConfigs.map((subConfig, idx) => (
            <div key={idx} className="p-3">
              {renderContent(subConfig)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlexibleModal;
