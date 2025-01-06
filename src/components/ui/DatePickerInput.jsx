import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

registerLocale("es", es); // Configurar idioma español

const DatePickerInput = ({
    label,
    selected,
    onChange,
    startDate,
    endDate,
    selectsRange,
    placeholderText,
    minDate,
    maxDate,
    errorStartDate,
    errorEndDate,
    icon: IconComponent,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Clases dinámicas para el contenedor principal
    const containerClasses = `flex border-2 rounded-lg transition-colors duration-300 ${
        errorStartDate || errorEndDate
            ? "border-red-300 focus-within:border-red-300 focus-within:ring-red-300 focus-within:shadow-md focus-within:shadow-red-300/50"
            : isFocused
            ? "border-blue-300 focus-within:border-blue-300 focus-within:ring-blue-300 focus-within:shadow-md focus-within:shadow-blue-300/50"
            : "border-gray-300"
    }`;

    // Clases dinámicas para el ícono
    const iconContainerClasses = `flex items-center px-2 border-e-2 rounded-s-lg ${
        errorStartDate || errorEndDate
            ? "border-red-300 text-red-500"
            : isFocused
            ? "border-blue-300 text-blue-500"
            : "border-gray-300 text-gray-500"
    }`;

    const inputClasses = `w-full rounded-lg py-2 ps-3 text-gray-800 outline-none`;

    return (
        <div className="relative">
            <label
                htmlFor="date-picker"
                className="block text-base font-semibold text-gray-800 mb-1"
            >
                {label}
            </label>
            {/* Contenedor principal */}
            <div className={`${containerClasses} shadow-lg`}>
                {/* Ícono a la izquierda con clases dinámicas */}
                <div className={`${iconContainerClasses} px-3 bg-white`}>
                    {IconComponent && (
                        <IconComponent
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    )}
                </div>
                {/* Input del DatePicker */}
                <div className="flex-1">
                    <DatePicker
                        selected={selected}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange={selectsRange}
                        placeholderText={placeholderText}
                        minDate={minDate}
                        maxDate={maxDate}
                        isClearable
                        className={inputClasses} // Estilo para el input
                        wrapperClassName="w-full" // Mantén el ancho completo
                        popperClassName="z-20"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...rest}
                    />
                </div>
            </div>
            {/* Mostrar errores individuales */}
            {errorStartDate && (
                <p className="text-red-500 text-xs mt-1">{errorStartDate}</p>
            )}
            {errorEndDate && (
                <p className="text-red-500 text-xs mt-1">{errorEndDate}</p>
            )}
        </div>
    );
};

export default DatePickerInput;
