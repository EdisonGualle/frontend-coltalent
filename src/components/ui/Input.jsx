import React, { useState } from 'react';
import { RiUser3Line } from 'react-icons/ri';

const Input = ({ label, id, type = 'text', placeholder, value, onChange, icon: IconComponent, error, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputClasses = `pl-16 block w-full rounded-lg border-2 py-2 px-3 text-gray-800 transition-colors duration-300 ${
    error
      ? 'border-red-300 focus:border-red-300 focus:ring-red-300 focus:shadow-md focus:shadow-red-300/50'
      : isFocused
      ? 'border-blue-300 focus:border-blue-300 focus:ring-blue-300 focus:shadow-md focus:shadow-blue-300/50'
      : 'border-gray-300'
  } outline-none`;

  const iconColor = error ? 'text-red-500' : isFocused ? 'text-blue-500' : 'text-gray-500';
  const borderColor = error ? 'border-red-300' : isFocused ? 'border-blue-300' : 'border-gray-300';

  return (
    <div>
      <label htmlFor={id} className="block text-base font-semibold text-gray-800 mb-1">
        {label}
      </label>
      <div className="relative rounded-lg shadow-lg transition-all duration-300">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <div className="w-8 h-8 bg-gray-100 flex items-center justify-center">
            {IconComponent ? (
              <IconComponent className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
            ) : (
              <RiUser3Line className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
            )}
          </div>
          <div className={`h-full w-full border-r-2 ${borderColor}`}></div>
        </div>
        <input
          type={type}
          name={id}
          id={id}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;