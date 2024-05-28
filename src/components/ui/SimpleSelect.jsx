import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';

const SimpleSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = '',
  isSearchable = false,
  labelKey = 'name',
  size = 'medium',
}) => {
  const [selectError, setSelectError] = useState('');
  const [, setIsFocused] = useState(false);

  useEffect(() => {
    setSelectError(error || '');
  }, [error]);

  const formattedOptions = options.map((option) => ({
    value: option,
    label: option[labelKey],
  }));

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const DropdownIndicator = (props) => {
    return !props.selectProps.value ? <components.DropdownIndicator {...props} /> : null;
  };

  const ClearIndicator = (props) => {
    return props.selectProps.value ? <components.ClearIndicator {...props} /> : null;
  };

  const sizeClasses = {
    small: {
      optionPadding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
    },
    medium: {
      optionPadding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
    large: {
      optionPadding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
    },
  };

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0',
      borderBottomWidth: '2px',
      borderBottomColor: selectError
        ? '#fca5a5'
        : state.isFocused
        ? '#93c5fd'
        : value
        ? 'rgb(209 213 219)'
        : '#e5e7eb',
      boxShadow: 'none',
      borderWidth: '0 0 2px 0',
      borderStyle: 'solid',
      '&:hover': {
        borderBottomColor: selectError ? '#fca5a5' : state.isFocused ? '#93c5fd' : 'none',
      },
      backgroundColor: 'inherit',
      transition: 'all 0.3s ease',
      height: '30px', // Altura constante
      minHeight: '30px', // Altura constante
      fontSize: sizeClasses[size].fontSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', // Alinear el contenido a la izquierda horizontalmente
      paddingLeft: '0px', // Asegurarse de que el contenido esté alineado a la izquierda
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '30px', // Altura constante
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
    }),
    singleValue: (provided) => ({
      ...provided,
      margin: '0', // Remover el margen predeterminado
      padding: '0', // Remover el padding predeterminado
      display: 'flex',
      alignItems: 'center',
      fontSize: sizeClasses[size].fontSize, // Asegura que la fuente sea correcta
    }),
    input: (provided) => ({
      ...provided,
      margin: '0', // Remover el margen predeterminado
      padding: '0', // Remover el padding predeterminado
      textAlign: 'left', // Alinear el texto del input a la izquierda
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#60a5fa' : 'white',
      color: state.isSelected ? 'white' : 'rgb(17 24 39)',
      '&:hover': {
        backgroundColor: '#60a5fa',
        color: 'white',
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', // Alinear el contenido a la izquierda horizontalmente
      padding: sizeClasses[size].optionPadding,
      fontSize: sizeClasses[size].fontSize,
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      display: !state.selectProps.value ? 'flex' : 'none', // Mostrar solo si no hay valor seleccionado
      alignItems: 'center',
      height: '30px', // Altura constante
      color: state.isFocused
        ? '#3b82f6'
        : state.hasValue
        ? '#3b82f6'
        : selectError
        ? '#ef4444'
        : provided.color,
      paddingRight: '8px', // Ajustar padding para alineación correcta
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      display: state.selectProps.value ? 'flex' : 'none', // Mostrar solo si hay valor seleccionado
      alignItems: 'center',
      height: '30px', // Altura constante
      color: state.isFocused
        ? '#ef4444'
        : selectError
        ? '#ef4444'
        : provided.color,
      paddingRight: '8px', // Ajustar padding para alineación correcta
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
      backgroundColor: 'white',
    }),
  };

  return (
    <div className='mb-2'>
      <label htmlFor="select" className="block text-sm font-semibold text-gray-800 mb-0">
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
        menuPlacement="auto" // Esto permite que el menú se abra automáticamente hacia arriba o hacia abajo según el espacio disponible
      />
      {selectError && <p className="text-red-500 text-xs mt-1">{selectError}</p>}
    </div>
  );
};

export default SimpleSelect;
