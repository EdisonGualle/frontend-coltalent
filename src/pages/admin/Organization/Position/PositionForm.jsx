import React, { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import Textarea from "../../../../components/ui/Textarea";
import CustomSelect from "../../../../components/ui/Select";
import { fetchUnits } from "../../../../redux/Organization/UnitSlince";
import { validateName } from "../../../../Utils/validationsV2";



const NAME_REQUIRED = "Se requiere el nombre del cargo.";
const FUNCTION_REQUIRED = "Indica la función que desempeña el cargo.";
const FUNCTION_DESCRIPTION_REQUIRED = "Proporciona una descripción de la función que desempeña el cargo.";
const UNIT_REQUIRED = "Selecciona un departamento.";

const PositionForm = ({
    position,
    isEditing,
    onSubmit,
    onCancel,
    confirmButtonText = isEditing ? "Guardar cambios" : "Crear cargo",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-500",
    cancelButtonColor = "border-gray-400",
    formErrors = {},
}) => {
    const dispatch = useDispatch();
    const unitsState = useSelector((state) => state.unit);
    const units = unitsState ? unitsState.units : [];
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);


    // Estados locales para manejar los errores y los datos del formularios
    const [formData, setFormData] = useState({
        name: "",
        functionDescription: "",
        selectedUnit: null,
    });
    const [errors, setErrors] = useState({
        name: "",
        function: "",
        unit_id: "",
    });

    
    // Desestructurar los datos del formulario
    const { name, functionDescription, selectedUnit } = formData;

    // Efecto para actualizar los errores del formulario
    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    // Efecto para cargar las unidades
    useEffect(() => {
        dispatch(fetchUnits());
    }, [dispatch]);

    // Efecto para cargar los datos del cargo a editar
    useEffect(() => {
        // Encontrar la unidad seleccionada
        const positionUnit = units.find((unit) => unit.id === position?.unit?.id);

        //Validar los datos del cargo
        if (isEditing && position && units.length > 0) {
            const nameError = validateName(position.name) || "";
            const functionError = !position.function ? FUNCTION_REQUIRED : "";
            // Actualizar los datos del formulario y los errores
            setFormData({
                name: position.name,
                functionDescription: position.function,
                selectedUnit: positionUnit ? { value: positionUnit, label: positionUnit.name } : null,
            });
            setErrors({
                name: nameError,
                function: functionError,
                unit_id: "",
            });
        }
    }, [position, units, isEditing]);

    // Efecto para limpiar los datos del formulario al cancelar la edición
    useEffect(() => {
        if (!isEditing) {
            setFormData({
                name: "",
                functionDescription: "",
                selectedUnit: null,
            });
            setErrors({
                name: "",
                function: "",
                unit_id: "",
            });
        }
    }, [isEditing]);

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "name") {
            const nameError = validateName(value);
            setErrors({ ...errors, name: nameError || "" });
        } else if (name === "functionDescription") {
            const functionError = !value.trim() ? FUNCTION_DESCRIPTION_REQUIRED : "";
            setErrors({ ...errors, function: functionError });
        }

        setFormData({ ...formData, [name]: value });
    };

    // Función para manejar los cambios en el campo de la unidad
    const handleUnitChange = (option) => {
        setFormData({ ...formData, selectedUnit: option });
        setErrors((prevState) => ({
            ...prevState,
            unit_id: option ? "" : UNIT_REQUIRED
        }));
    };

    // Efecto para deshabilitar el botón de enviar si hay errores
    useEffect(() => {
        const isDisabled = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(isDisabled);
    }, [errors]);

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar los campos del formulario
        const newErrors = {
            name: !name ? NAME_REQUIRED : "",
            function: !functionDescription ? FUNCTION_REQUIRED : "",
            unit_id: !selectedUnit ? UNIT_REQUIRED : "",
        };

        // Actualizar los errores
        setErrors(newErrors);

        // Verificar si hay errores
        const hasErrors = Object.values(newErrors).some((error) => error);

        if (!hasErrors) {
            const unitId = selectedUnit ? selectedUnit.value.id : null;

            // Crear el objeto con los datos del formulario
            const updatePositionData = {
                name,
                function: functionDescription,
                unit_id: unitId,
            };

            // Enviar los datos del formulario al componente padre
            onSubmit(updatePositionData);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Nombre del cargo"
                    id="name"
                    placeholder="Ej. Gerente de ventas"
                    value={name}
                    onChange={handleChange}
                    error={errors.name}
                />
                <Textarea
                    label="Función del cargo"
                    id="functionDescription"
                    placeholder="Ej. Dirigir y coordinar las actividades del departamento de ventas"
                    value={functionDescription}
                    onChange={handleChange}
                    error={errors.function}
                    rows={2}
                />
                <CustomSelect
                    label="Departamento"
                    options={units}
                    value={selectedUnit}
                    onChange={handleUnitChange}
                    placeholder="Selecciona una unidad"
                    error={errors.unit_id}
                    isSearchable={true}
                    labelKey="name"
                />
                 <CustomSelect
                    label="Unidad"
                    options={units}
                    value={selectedUnit}
                    onChange={handleUnitChange}
                    placeholder="Selecciona una unidad"
                    error={errors.unit_id}
                    isSearchable={true}
                    labelKey="name"
                />
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="submit"
                    className={`p-2 px-1 rounded-xl text-white w-full outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitDisabled
                        ? `${confirmButtonColor} opacity-70 cursor-not-allowed` // Estilos cuando está deshabilitado
                        : `${confirmButtonColor}` // Estilos cuando está habilitado
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
}

export default PositionForm;

