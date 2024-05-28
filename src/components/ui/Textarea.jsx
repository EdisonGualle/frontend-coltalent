import React, { useState } from 'react';

const Textarea = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const textareaClasses = `block w-full rounded-lg border-2 py-2 px-3 text-gray-800 transition-colors duration-300 ${
    error
      ? 'border-red-300 focus:border-red-300 focus:ring-red-300 focus:shadow-md focus:shadow-red-300/50'
      : isFocused
      ? 'border-blue-300 focus:border-blue-300 focus:ring-blue-300 focus:shadow-md focus:shadow-blue-300/50'
      : 'border-gray-300'
  } outline-none`;

  return (
    <div>
      <label htmlFor={id} className="block text-base font-semibold text-gray-800 mb-1">
        {label}
      </label>
      <textarea
        name={id}
        id={id}
        className={textareaClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={rows}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;