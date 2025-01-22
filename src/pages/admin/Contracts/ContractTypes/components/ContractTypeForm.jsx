import React, { useState, useEffect } from "react";
import Input from "../../../../../components/ui/Input";
import Textarea from "../../../../../components/ui/Textarea";
import { FaRegClock } from "react-icons/fa";
import { BsCalendarRange, BsCalendarPlus, BsSuitcaseLg, BsHourglassSplit } from "react-icons/bs";

// Función para validar un campo individual
const validateField = (name, value, formData) => {
    switch (name) {
        case "name":
            return !value ? "El nombre es obligatorio." : "";
        case "description":
            return !value ? "La descripción es obligatoria." : "";
        case "max_duration_months":
            if (!value) {
                if (formData.renewable) {
                    return "Los contratos indefinidos no pueden ser renovables.";
                }
                return "";
            }
            if (value < 1) return "La duración debe ser de al menos 1 mes.";
            if (value > 48) return "La duración no puede ser mayor a 48 meses (4 años).";
            return "";
        case "vacation_days_per_year":
            if (!value) return "Las vacaciones por año son obligatorias.";
            if (value < 1) return "El mínimo de días de vacaciones por año es 1.";
            if (value > 30) return "El máximo de días de vacaciones por año es 30.";
            return "";
        case "max_vacation_days":
            if (!value) return "Los días acumulables son obligatorios.";
            if (value < 1) return "El mínimo de días acumulables es 1.";
            if (value > 90) return "El máximo de días acumulables es 90.";
            if (formData.vacation_days_per_year && value < formData.vacation_days_per_year) {
                return "Los días acumulables deben ser mayores o iguales a los días de vacaciones por año.";
            }
            return "";
        case "min_tenure_months_for_vacation":
            if (value < 0) return "La antigüedad mínima no puede ser menor a 0.";
            if (value > 11) return "La antigüedad máxima permitida es 11 meses.";
            if (formData.max_duration_months && value >= formData.max_duration_months) {
                return "La antigüedad mínima debe ser menor que la duración del contrato.";
            }
            return "";
        case "weekly_hours":
            if (!value) return "Las horas semanales son obligatorias.";
            if (value <= 1) return "El número de horas trabajadas debe ser mayor a 1 hora.";
            return "";
        case "renewable":
            if (value && !formData.max_duration_months) {
                return "Los contratos renovables deben tener una duración definida.";
            }
            return "";
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

const ContractTypeForm = ({
    onSubmit,
    onCancel,
    formErrors = {}, // Errores del backend
    isEditing = false,
    isSubmitting = false,
    initialData = {},
    confirmButtonText = isEditing ? "Actualizar" : "Crear",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-600",
    cancelButtonColor = "border-gray-400",
}) => {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        description: initialData.description || "",
        max_duration_months: initialData.max_duration_months || "",
        renewable: initialData.renewable || false,
        vacation_days_per_year: initialData.vacation_days_per_year || "",
        max_vacation_days: initialData.max_vacation_days || "",
        min_tenure_months_for_vacation: initialData.min_tenure_months_for_vacation || "",
        weekly_hours: initialData.weekly_hours || "",
    });

    const [errors, setErrors] = useState({});

    // Sincronizar errores del backend
    useEffect(() => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...formErrors, // Sobrescribe con errores del backend
        }));
    }, [formErrors]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        const updatedFormData = { ...formData, [name]: newValue };

        setFormData(updatedFormData);

        // Valida solo el campo modificado
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, newValue, updatedFormData),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allErrors = validateAllFields(formData);
        setErrors(allErrors);

        // Si no hay errores, envía el formulario
        if (!Object.values(allErrors).some((error) => error)) {
            onSubmit(formData);
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
                placeholder="Ej: Indefinido"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
            />

            {/* Descripción */}
            <Textarea
                label="Descripción"
                id="description"
                name="description"
                placeholder="Ej: Contrato indefinido."
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                rows={3}
            />

            {/* Duración máxima y horas semanales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Duración (meses)"
                    id="max_duration_months"
                    type="number"
                    name="max_duration_months"
                    placeholder="Ej: 12"
                    value={formData.max_duration_months}
                    onChange={handleChange}
                    error={errors.max_duration_months}
                    icon={BsCalendarRange}
                />
                <Input
                    label="Horas de trabajo (semanales)"
                    id="weekly_hours"
                    type="number"
                    name="weekly_hours"
                    placeholder="Ej: 40"
                    value={formData.weekly_hours}
                    onChange={handleChange}
                    error={errors.weekly_hours}
                    icon={FaRegClock}
                />
            </div>

            {/* Vacaciones al año y antigüedad mínima */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Vacaciones por año (días)"
                    id="vacation_days_per_year"
                    type="number"
                    name="vacation_days_per_year"
                    placeholder="Ej: 30"
                    value={formData.vacation_days_per_year}
                    onChange={handleChange}
                    error={errors.vacation_days_per_year}
                    icon={BsSuitcaseLg}
                />
                <Input
                    label="Antigüedad para vacaciones (meses)"
                    id="min_tenure_months_for_vacation"
                    type="number"
                    name="min_tenure_months_for_vacation"
                    placeholder="Ej: 11"
                    value={formData.min_tenure_months_for_vacation}
                    onChange={handleChange}
                    error={errors.min_tenure_months_for_vacation}
                    icon={BsHourglassSplit}
                />
            </div>

            {/* Máximo acumulación de vacaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Vacaciones acumulables (días)"
                    id="max_vacation_days"
                    type="number"
                    name="max_vacation_days"
                    placeholder="Ej: 60"
                    value={formData.max_vacation_days}
                    onChange={handleChange}
                    error={errors.max_vacation_days}
                    icon={BsCalendarPlus}
                />
                <div className="flex flex-col">
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            id="renewable"
                            name="renewable"
                            checked={formData.renewable}
                            onChange={handleChange}
                            className="w-4 h-4 mt-1"
                        />
                        <label htmlFor="renewable" className="font-semibold">
                            Renovable
                        </label>
                    </div>
                    <span className="text-xs ps-6">Indica si el contrato es renovable.</span>
                    {errors.renewable && <span className="text-xs text-red-500 ps-6">{errors.renewable}</span>}
                </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4">
                <button
                    type="submit"
                    aria-label={isSubmitting ? "Enviando..." : confirmButtonText}
                    className={`p-2 rounded-xl text-white w-full 
                        ${confirmButtonColor} outline-none border border-transparent transform transition-all duration-300 hover:scale-105 
                        ${isSubmitting || hasErrors ? "opacity-70 cursor-not-allowed" : ""}`}
                    disabled={isSubmitting || hasErrors}
                >
                    {isSubmitting ? "Enviando..." : confirmButtonText}
                </button>
                <button
                    type="button"
                    aria-label={cancelButtonText}
                    className={`p-2 rounded-xl bg-transparent border border-dashed ${cancelButtonColor} w-full outline-none transform transition-all duration-300 hover:scale-105 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    {cancelButtonText}
                </button>
            </div>
        </form>
    );
};

export default ContractTypeForm;