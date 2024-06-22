import React from 'react';
import { FaCog, FaRegEdit } from 'react-icons/fa';

const CardConfigurable = ({ title, inputPlaceholder, textareaPlaceholder }) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden transform transition duration-500 hover:shadow-2xl mb-6">
      <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center mb-6">
          <FaCog className="text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="configInput">
            {title}
          </label>
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-300">
            <FaRegEdit className="text-gray-400 ml-3" />
            <input
              type="text"
              id="configInput"
              className="appearance-none border-none w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-r-lg"
              placeholder={inputPlaceholder}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="configTextarea">
            Definición de {title}
          </label>
          <textarea
            id="configTextarea"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={textareaPlaceholder}
            rows="4"
          ></textarea>
        </div>
        
      </div>
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-500 hover:scale-105">
          Guardar
        </button>
      </div>
    </div>
  );
};

export default CardConfigurable;
