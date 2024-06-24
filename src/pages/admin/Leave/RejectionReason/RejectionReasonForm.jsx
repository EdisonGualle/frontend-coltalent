import React, { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import { RiCloseCircleLine } from "react-icons/ri";

const REJECTION_REASON_REQUIRED = "Por favor, ingrese el motivo de rechazo.";

const RejectionReasonForm = ({
    rejectionReason,
    isEditing,
    onSubmit,
    onCancel,
    confirmButtonText = isEditing ? "Guardar cambios" : "Crear registro",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-500",
    cancelButtonColor = "border-gray-400",
    formErrors = {},
}) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    // Estados locales para manejar los errores y los datos del formulario
    const [formData, setFormData] = useState({
        reason: "",
    });
    const [errors, setErrors] = useState({
        reason: "",
    });

    // Desestructurar los datos del formulario
    const { reason } = formData;

    // Efecto para actualizar los errores del formulario
    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    // Efecto para deshabilitar el botón de envío si hay errores
    useEffect(() => {
        const isDisabled = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(isDisabled);
    }, [errors]);

    // Efecto para cargar los datos del motivo de rechazo en el formulario cuando se edite
    useEffect(() => {
        if(isEditing && rejectionReason) {
            setFormData({
                reason: rejectionReason.reason,
            });

            setErrors({
                reason: "",
            });
        }
    }, [isEditing, rejectionReason]);

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (value.trim() === "") {
            setErrors({
                ...errors,
                [name]: REJECTION_REASON_REQUIRED,
            });
        } else {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            setErrors({
                reason: REJECTION_REASON_REQUIRED,
            });
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
                <Input
                    label="Motivo de rechazo"
                    name="reason"
                    placeholder={'Ejemplo: "Falta de documentación requerida"'}
                    value={reason}
                    icon={RiCloseCircleLine}
                    onChange={handleChange}
                    error={errors.reason}
                />
            </div>
            <div className="flex items-center gap-x-2 mt-4">
                <button
                    type="submit"
                    className={`p-2 px-4 rounded-xl text-white w-full outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitDisabled
                        ? `bg-gray-400 opacity-70 cursor-not-allowed`
                        : `${confirmButtonColor}`
                        }`}
                    disabled={isSubmitDisabled}
                >
                    {confirmButtonText}
                </button>
                <button
                    type="button"
                    className={`p-2 rounded-xl bg-transparent border border-dashed ${cancelButtonColor} w-full outline-none transform transition-all duration-300 hover:scale-105`}
                    onClick={onCancel}
                >
                    {cancelButtonText}
                </button>
            </div>
        </form>
    );
};

export default RejectionReasonForm;
