import React, { useState, useEffect } from "react";
import Textarea from "../../../../../components/ui/Textarea";

const ContractTerminateForm = ({
    onSubmit,
    onCancel,
    formErrors = {}, 
    isSubmitting = false,
}) => {
    const [formData, setFormData] = useState({
        reason: "",
    });

    const [errors, setErrors] = useState({});

    // Sincronizar errores del backend
    useEffect(() => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...formErrors,
        }));
    }, [formErrors]);

    // Validar el campo del motivo
    const validateField = (name, value) => {
        switch (name) {
            case "reason":
                return !value ? "El motivo de terminación es obligatorio." : "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validar el campo modificado
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar todos los campos
        const newErrors = {
            reason: validateField("reason", formData.reason),
        };
        setErrors(newErrors);

        // Si no hay errores, enviar los datos
        if (!Object.values(newErrors).some((error) => error)) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Textarea para el motivo */}
            <Textarea
                label="Motivo de terminación"
                id="reason"
                name="reason"
                placeholder="Escribe el motivo de la terminación..."
                value={formData.reason}
                onChange={handleChange}
                error={errors.reason}
                rows={4}
            />

            {/* Botones */}
            <div className="flex justify-end gap-4">
            <button
        type="submit"
        aria-label="Terminar contrato"
        className={`p-2 rounded-xl text-white bg-red-500 w-full border border-transparent transform transition-all duration-300 hover:scale-105 
            ${isSubmitting || Object.values(errors).some((error) => error) ? "opacity-70 cursor-not-allowed" : ""}`}
        disabled={isSubmitting || Object.values(errors).some((error) => error)}
    >
        {isSubmitting ? "Terminando..." : "Terminar"}
    </button>
    <button
        type="button"
        aria-label="Cancelar"
        className={`p-2 rounded-xl bg-transparent border border-dashed border-gray-400 w-full transform transition-all duration-300 hover:scale-105 
            ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
        onClick={onCancel}
        disabled={isSubmitting}
    >
        Cancelar
    </button>
            </div>
        </form>
    );
};

export default ContractTerminateForm;