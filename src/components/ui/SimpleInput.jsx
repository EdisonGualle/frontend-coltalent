import React, { useState } from 'react';

const SimpleInput = ({ label, id, type = 'text', placeholder, value, onChange, error, size = 'medium', ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const sizeClasses = {
    small: 'py-1 text-xs',
    medium: 'py-1.5 text-sm',
    large: 'py-2 text-lg',
  };

  const inputClasses = `relative block w-full ${sizeClasses[size]} text-gray-800 transition-colors duration-300 border-b-2 outline-none bg-amber-50 ${
    error
      ? 'border-red-300'
      : isFocused
      ? 'border-blue-300'
      : 'border-gray-300'
  }`;

  return (
    <div className="mb-2 relative">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800">
        {label}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        className={inputClasses}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <style>{`
        .relative input {
          margin-top: -0.25rem;
          position: relative;
          background: transparent;
          transition: border-color 0.3s ease-in-out;
        }
        .relative input::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 50%;
          background: ${error ? 'red' : 'blue'};
          transition: width 0.3s ease, left 0.3s ease;
        }
        .relative input:focus::after {
          width: 100%;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default SimpleInput;
