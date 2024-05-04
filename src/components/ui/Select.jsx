import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';

const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  error, // Recibir el error como prop
  placeholder = '',
  isSearchable = false,
  labelKey = 'name',
}) => {
  const [selectError, setSelectError] = useState(''); // Estado para el error del componente
  const [, setIsFocused] = useState(false);

  useEffect(() => {
    setSelectError(error || ''); // Actualizar el estado del error con el valor recibido por prop
  }, [error]);

  const formattedOptions = options.map((option) => ({
    value: option,
    label: option[labelKey], // Usar la clave de la etiqueta en lugar de 'name'
  }));

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const DropdownIndicator = (props) => {
    if (props.selectProps.value) {
      return null;
    }
    return <components.DropdownIndicator {...props} />;
  };

  const ClearIndicator = (props) => {
    if (!props.selectProps.value) {
      return null;
    }
    return <components.ClearIndicator {...props} />;
  };

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.5rem',
      borderWidth: '2px',
      borderColor: selectError
        ? '#fca5a5' // Si hay error, color rojo
        : state.isFocused
        ? '#93c5fd' // Si tiene foco, color azul
        : value
        ? 'rgb(209 213 219)' // Si hay una opción seleccionada, color gris
        : '#e5e7eb', // Si no hay error, foco ni opción seleccionada, color gris claro
      boxShadow: state.isFocused
        ? '0 0 0 rgb(96 165 250 / 50%), 0 1px 3px 0 rgb(0 0 0 / 30%), 0 2px 3px 0 rgb(147 197 253/ 20%)'
        : '0 10px 15px rgb(0 0 0 / 7%), 0 4px 6px -2px rgb(0 0 0 / 5%)',
      '&:hover': {
        borderColor: selectError ? '#fca5a5' : state.isFocused ? '#93c5fd' : 'none',
      },
      transition: 'all 0.3s ease',
      height: '40px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#60a5fa' : 'transparent',
      color: state.isSelected ? 'white' : 'rgb(17 24 39)',
      '&:hover': {
        backgroundColor: '#60a5fa',
        color: 'white',
      },
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 1rem',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused
        ? '#3b82f6' // Color azul cuando está enfocado
        : state.hasValue
        ? '#3b82f6' // Color azul cuando hay una opción seleccionada
        : selectError
        ? '#ef4444' // Color rojo cuando hay un error
        : provided.color, // Color predeterminado
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused
        ? '#ef4444' // Color rojo cuando está enfocado
        : selectError
        ? '#ef4444' // Color rojo cuando hay un error
        : provided.color, // Color predeterminado
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 10000,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10000,
      position: 'absolute',
      maxHeight: '160px',
      overflowY: 'auto',
    }),
  };

  return (
    <div>
      <label htmlFor="select" className="block text-base font-semibold text-gray-800 mb-1">
        {label}
      </label>
      <Select
        id="select"
        options={formattedOptions}
        value={value}
        onChange={onChange}
        styles={selectStyles}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isClearable
        components={{ DropdownIndicator, ClearIndicator }}
        placeholder={placeholder}
        menuPortalTarget={document.body}
        isSearchable={isSearchable}
      />
      {selectError && <p className="text-red-500 text-sm mt-1">{selectError}</p>}
    </div>
  );
};

export default CustomSelect;