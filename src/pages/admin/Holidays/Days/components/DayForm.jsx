import React, { useState, useEffect } from "react";
import Input from "../../../../../components/ui/Input";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { MdOutlineToday } from "react-icons/md";

registerLocale("es", es); // Registrar el idioma español para react-datepicker

// Función para validar un campo individual
const validateField = (name, value, formData) => {
    switch (name) {
        case "name":
            return !value ? "El nombre es obligatorio." : "";
        case "date":
            return !value ? "La fecha es obligatoria." : "";
        case "is_recurring":
            return ""; // No requiere validaciones adicionales
        case "applies_to_all":
            return ""; // No requiere validaciones adicionales
        default:
            return "";
    }
};

// Validar todos los campos
const validateAllFields = (formData) => {
    return Object.keys(formData).reduce((errors, key) => {
        errors[key] = validateField(key, formData[key], formData);
        return errors;
    }, {});
};

const DayForm = ({
    onSubmit,
    onCancel,
    formErrors = {},
    isEditing = false,
    isSubmitting = false,
    initialData = {}
}) => {

    const parseDateString = (dateString) => {
        const months = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        const [day, , month, , year] = dateString.split(" ");
        const monthIndex = months.indexOf(month.toLowerCase());
        if (monthIndex === -1) return null; // Validar si el mes es inválido
        return new Date(year, monthIndex, parseInt(day, 10));
    };

    const [formData, setFormData] = useState({
        name: initialData.name || "",
        date: initialData.date ? parseDateString(initialData.date) : null,
        is_recurring: initialData.is_recurring ?? true,
        applies_to_all: initialData.applies_to_all ?? true,

    });

    const [errors, setErrors] = useState({});

    // Sincronizar errores del backend
    useEffect(() => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...formErrors,
        }));
    }, [formErrors]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        const updatedFormData = { ...formData, [name]: newValue };

        setFormData(updatedFormData);

        // Valida solo el campo modificado
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, newValue, updatedFormData),
        }));
    };

    const handleDateChange = (date) => {
        const updatedFormData = { ...formData, date };
        setFormData(updatedFormData);

        // Validar la fecha
        setErrors((prevErrors) => ({
            ...prevErrors,
            date: validateField("date", date, updatedFormData),
        }));
    };

    const handleToggleChange = (field) => {
        const updatedFormData = { ...formData, [field]: !formData[field] };
        setFormData(updatedFormData);

        // Valida el campo modificado
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: validateField(field, updatedFormData[field]),
        }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const allErrors = validateAllFields(formData);
        setErrors(allErrors);

        if (!Object.values(allErrors).some((error) => error)) {
            const formattedData = {
                ...formData,
                date: formData.date ? formData.date.toISOString().split("T")[0] : null,
            };

            onSubmit(formattedData);
        }
    };


    const hasErrors = Object.values(errors).some((error) => error);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <Input
                label="Nombre"
                id="name"
                type="text"
                name="name"
                placeholder="Ej: Día Festivo"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={MdOutlineToday}
                disabled={isSubmitting}
            />

            {/* Fecha */}
            <div className="flex flex-col">
                <label htmlFor="date" className="font-semibold mb-1">
                    Fecha
                </label>
                <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="d 'de' MMMM 'de' yyyy"
                    locale="es"
                    placeholderText="Selecciona una fecha"
                    className={`w-full border rounded-md px-3 py-2 text-sm ${errors.date ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={isSubmitting}
                    minDate={new Date(`${new Date().getFullYear()}-01-01`)}
                    maxDate={new Date(`${new Date().getFullYear()}-12-31`)}
                />
                {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
            </div>

            {/* Recurrente */}
            <div className="flex items-center gap-10">
                <label htmlFor="is_recurring" className="font-semibold">
                    Recurrente
                </label>
                <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${formData.is_recurring ? "bg-blue-500" : "bg-gray-200 border border-gray-300"
                        }`}
                    onClick={() => handleToggleChange("is_recurring")}
                    disabled={isSubmitting}
                >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${formData.is_recurring ? "translate-x-6 bg-blue-600" : "translate-x-0"
                            }`}
                    ></div>
                </div>
            </div>
            {errors.is_recurring && <span className="text-xs text-red-500">{errors.is_recurring}</span>}

            {/* Aplica a todos */}
            <div className="flex items-center gap-10">
                <label htmlFor="applies_to_all" className="font-semibold">
                    Aplica a todos
                </label>
                <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${formData.applies_to_all ? "bg-blue-500" : "bg-gray-200 border border-gray-300"
                        }`}
                    onClick={() => handleToggleChange("applies_to_all")}
                    disabled={isSubmitting}
                >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ${formData.applies_to_all ? "translate-x-6 bg-blue-600" : "translate-x-0"
                            }`}
                    ></div>
                </div>
            </div>
            {errors.applies_to_all && <span className="text-xs text-red-500">{errors.applies_to_all}</span>}

            {/* Botones */}
            <div className="flex justify-end gap-4">
                <button
                    type="submit"
                    className={`p-2 rounded-xl text-white w-full bg-blue-600 outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitting || hasErrors ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    disabled={isSubmitting || hasErrors}
                >
                    {isEditing ? "Actualizar" : "Crear"}
                </button>
                <button
                    type="button"
                    className="p-2 rounded-xl bg-transparent border border-dashed border-gray-400 w-full outline-none transform transition-all duration-300 hover:scale-105"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default DayForm;