import React from 'react';

const colorClasses = {
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    hover: "hover:bg-green-200",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    hover: "hover:bg-blue-200",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    hover: "hover:bg-red-200",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    hover: "hover:bg-yellow-200",
  },
  gray: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    hover: "hover:bg-gray-200",
  },
};

const sizeClasses = {
  small: "h-8 text-xs",
  medium: "h-10 text-sm",
  large: "h-12 text-md",
};

const paddingClasses = {
  small: "px-1 py-1",
  medium: "px-2 py-2",
  large: "px-3 py-3",
};

const iconSizeClasses = {
  small: "h-3 w-3",
  medium: "h-4 w-4",  
  large: "h-5 w-5",
};

const CustomButton = ({ onClick, icon: Icon, color = "green", size = "medium", children }) => {
  const { bg, text, hover } = colorClasses[color];
  const sizeClass = sizeClasses[size]; 
  const paddingClass = children ? paddingClasses[size] : "p-2"; 
  const iconSize = iconSizeClasses[size]; 
  const baseStyles = "flex items-center justify-center rounded-lg transition-colors";

  const widthClass = children ? "" : "w-10"; 

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${bg} ${text} ${hover} ${sizeClass} ${paddingClass} ${widthClass}`}
    >
      {Icon && <Icon className={`${iconSize} ${children ? "mr-2" : "mx-auto"}`} />}
      {children}
    </button>
  );
};

export default CustomButton;
