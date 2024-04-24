import React from 'react';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';

const OptionsColumn = () => {
  return (
    <div className="flex gap-2">
      <button className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg transition-colors hover:bg-green-200">
        <RiEdit2Line />
      </button>
      <button className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg transition-colors hover:bg-red-200">
        <RiDeleteBin6Line />
      </button>
    </div>
  );
};

export default OptionsColumn;