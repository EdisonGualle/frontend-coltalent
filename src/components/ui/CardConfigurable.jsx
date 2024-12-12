import React, { useState, useEffect } from 'react';
import { RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';

const CardConfigurable = ({ config, onSave, relatedConfigValue, translatedKey, showAlert, isEditing, setIsEditing }) => {
  const [value, setValue] = useState(config.value);
  const [originalValue, setOriginalValue] = useState(config.value);
  const [minError, setMinError] = useState('');
  const [maxError, setMaxError] = useState('');

  // Definir timeFields fuera de useEffect para que esté disponible en todo el componente
  const timeFields = ['max_weekly_hours', 'min_weekly_hours', 'max_daily_hours', 'min_daily_hours'];

  useEffect(() => {
    const validateValues = () => {
      let validationMinError = '';
      let validationMaxError = '';

      if (timeFields.includes(config.key)) {
        if (!/^\d{2,}:[0-5]\d$/.test(value)) {
          validationMinError = 'El valor debe estar en el formato HH:MM.';
        } else if (relatedConfigValue) {
          const [currentHours, currentMinutes] = value.split(':').map(Number);
          const [relatedHours, relatedMinutes] = relatedConfigValue.split(':').map(Number);

          const currentTotalMinutes = currentHours * 60 + currentMinutes;
          const relatedTotalMinutes = relatedHours * 60 + relatedMinutes;

          if (config.key.includes('min') && currentTotalMinutes >= relatedTotalMinutes) {
            validationMinError = 'La duración mínima debe ser menor que la duración máxima.';
          } else if (config.key.includes('max') && currentTotalMinutes <= relatedTotalMinutes) {
            validationMaxError = 'La duración máxima debe ser mayor que la duración mínima.';
          }
        }
      } else if (config.key.includes('hours')) {
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
          if (config.key === 'max_duration_hours_min') {
            validationMinError = 'El valor debe estar en el formato HH:MM.';
          } else {
            validationMaxError = 'El valor debe estar en el formato HH:MM.';
          }
        } else if (relatedConfigValue) {
          const [minHours, minMinutes] = config.key === 'max_duration_hours_min' ? value.split(':').map(Number) : relatedConfigValue.split(':').map(Number);
          const [maxHours, maxMinutes] = config.key === 'max_duration_hours_max' ? value.split(':').map(Number) : relatedConfigValue.split(':').map(Number);

          const minTotalMinutes = minHours * 60 + minMinutes;
          const maxTotalMinutes = maxHours * 60 + maxMinutes;

          if (minTotalMinutes >= maxTotalMinutes) {
            if (config.key.includes('min')) {
              validationMinError = 'La duración mínima debe ser menor que la duración máxima.';
            }
            if (config.key.includes('max')) {
              validationMaxError = 'La duración máxima debe ser mayor que la duración mínima.';
            }
          }

        }
      } else {
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue) || numericValue <= 0) {
          validationMinError = validationMaxError = 'El valor debe ser un número mayor que 0.';
        }
      }

      setMinError(validationMinError);
      setMaxError(validationMaxError);
    };

    validateValues();
  }, [value, relatedConfigValue, config.key]);

  const handleSave = () => {
    if (minError || maxError) {
      showAlert('Error al actualizar la configuración: ' + (minError || maxError), 'error');
    } else {
      onSave(config.id, value);
      setOriginalValue(value); // Actualiza el valor original después de guardar
      setIsEditing(null); // Desactiva el modo de edición
    }
  };

  const handleCancel = () => {
    setValue(originalValue);
    setIsEditing(null); // Desactiva el modo de edición
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setIsEditing(config.id); // Activa el modo de edición al cambiar el valor
  };

  // Verifica si el campo actual debe manejarse como texto en formato HH:MM o como número
  const inputType = timeFields.includes(config.key) || config.key.includes('hours') ? 'text' : 'number';

  return (
    <li className="flex flex-col py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
        
          <div>
            <h3 className=" text-base  font-semibold text-gray-800">{translatedKey}</h3>
            <p className="text-gray-600 text-sm">{config.description}</p>
          </div>
        </div>
        <div className="flex flex-col ms-1">
          <div className="flex items-center space-x-1">
            <input
              type={inputType} 
              min="1"
              className={` text-sm  text-center p-1 border ${(minError || maxError) ? 'border-red-400' : 'border-gray-300'} rounded w-14 focus:outline-none focus:ring-1 focus:ring-blue-400`}
              value={value}
              onChange={handleChange}
              disabled={isEditing !== null && isEditing !== config.id} // Deshabilita si se está editando otro campo
            />
            <button
              className={`px-2 py-1 rounded-lg bg-blue-100 text-blue-600 ${(minError || maxError || value === originalValue || isEditing !== config.id) ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-100 hover:bg-blue-200'}`}
              onClick={handleSave}
              disabled={!!(minError || maxError || value === originalValue || isEditing !== config.id)}
            >
              <RiCheckboxCircleLine size={20} />
            </button>
            {isEditing === config.id && (
              <button
                className="px-2 py-1 rounded-lg text-red-600 bg-red-100 hover:bg-red-200"
                onClick={handleCancel}
              >
              <RiCloseCircleLine size={20} />
              </button>
            )}
          </div>
          {(minError || maxError) && <p className="text-red-400 text-xs mt-1">{minError || maxError}</p>}
        </div>
      </div>
    </li>
  );
};

export default CardConfigurable;
