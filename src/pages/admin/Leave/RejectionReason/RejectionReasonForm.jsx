import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import Input from "../../../../components/ui/Input";
import { RiCloseCircleLine } from "react-icons/ri";
import { fetchLeaveTypes } from '../../../../redux/Leave/leaveTypeSlince';

import TaggableSelect from "../../../../components/ui/TaggableSelect";

const REJECTION_REASON_REQUIRED = "Por favor, ingrese el motivo de rechazo.";
const LEAVE_TYPES_REQUIRED = "Por favor, seleccione al menos un tipo de permiso.";

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
    const dispatch = useDispatch();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const { leaveTypes, hasFetchedAll } = useSelector((state) => state.leaveType);
    const [selectedLeaveTypes, setSelectedLeaveTypes] = useState([]);


    // Tipos de permisos
    useEffect(() => {
        if (!hasFetchedAll) {
            dispatch(fetchLeaveTypes());
        }
    }, [dispatch, hasFetchedAll]);

    const handleLeaveTypesChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map((option) => option.value);
        setSelectedLeaveTypes(selectedIds);
    
        // Validar inmediatamente después de cambiar
        if (selectedIds.length === 0) {
            setErrors((prev) => ({ ...prev, leaveTypes: LEAVE_TYPES_REQUIRED }));
        } else {
            setErrors((prev) => ({ ...prev, leaveTypes: "" }));
        }
    };
    

    // Estados locales para manejar los errores y los datos del formulario
    const [formData, setFormData] = useState({
        reason: "",
    });
    const [errors, setErrors] = useState({
        reason: "",
        leaveTypes: "",
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
        if (isEditing && rejectionReason) {
            setFormData({
                reason: rejectionReason.reason,
            });

            setSelectedLeaveTypes(rejectionReason.leave_types?.map((type) => type.id) || []);

            setErrors({
                reason: "",
                leaveTypes: "",
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
    
        const newErrors = {};
    
        if (!reason.trim()) {
            newErrors.reason = REJECTION_REASON_REQUIRED;
        }
    
        if (selectedLeaveTypes.length === 0) {
            newErrors.leaveTypes = LEAVE_TYPES_REQUIRED;
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        const formattedData = {
            ...formData,
            leave_type_ids: selectedLeaveTypes,
        };
    
        console.log(formattedData);
    
        onSubmit(formattedData);
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

                <TaggableSelect
                    label="Tipos de Permiso Asociados"
                    id="leave_types"
                    placeholder="Selecciona los tipos de permisos"
                    options={leaveTypes.map((type) => ({ label: type.name, value: type.id }))}
                    value={leaveTypes.filter((type) => selectedLeaveTypes.includes(type.id)).map((type) => ({
                        label: type.name,
                        value: type.id,
                    }))}
                    onChange={handleLeaveTypesChange}
                    error={errors.leaveTypes || ""}
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
