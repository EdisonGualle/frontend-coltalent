import React, { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import Textarea from "../../../../components/ui/Textarea";
import CustomSelect from "../../../../components/ui/Select";
import { fetchUnits } from "../../../../redux/Organization/UnitSlince";
import { validateName } from "../../../../Utils/validationsV2";
import { fetchDepartments } from "../../../../redux/Organization/DepartamentSlice";
import ResponsibilitiesModal from "./ResponsibilitiesModal";

const NAME_REQUIRED = "Se requiere el nombre del cargo.";
const FUNCTION_REQUIRED = "Indica la función que desempeña el cargo.";
const FUNCTION_DESCRIPTION_REQUIRED = "Proporciona una descripción de la función que desempeña el cargo.";
const UNIT_REQUIRED = "Selecciona una unidad.";
const DIRECTION_REQUIRED = "Selecciona una dirección.";
const UNIT_OR_DIRECTION_REQUIRED = "Debe seleccionar una unidad o una dirección.";
const RESPONSIBILITY_REQUIRED = "Debe asignar al menos una responsabilidad al cargo.";


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
    const departmentsState = useSelector((state) => state.departament);
    const departments = departmentsState ? departmentsState.departments : [];
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const [isResponsibilitiesModalOpen, setIsResponsibilitiesModalOpen] = useState(false);
    const [responsibilities, setResponsibilities] = useState([]);


    const [formData, setFormData] = useState({
        name: "",
        functionDescription: "",
        selectedUnit: null,
        selectedDirection: null,
        isManager: false,
    });

    const [errors, setErrors] = useState({
        name: "",
        function: "",
        unit_id: "",
        direction_id: "",
        belongsTo: "",
        is_manager: "",
    });

    const { name, functionDescription, selectedUnit, selectedDirection, isManager } = formData;



    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    useEffect(() => {
        dispatch(fetchUnits());
        dispatch(fetchDepartments());
    }, [dispatch]);

    useEffect(() => {
        const positionUnit = units.find((unit) => unit.id === position?.unit?.id);
        const positionDirection = departments.find((department) => department.id === position?.direction?.id);

        if (isEditing && position && (units.length > 0 || departments.length > 0)) {
            const nameError = validateName(position.name) || "";
            const functionError = !position.function ? FUNCTION_REQUIRED : "";
            const belongsToValue = position.unit ? 'unit' : (position.direction ? 'direction' : null);

            setFormData({
                name: position.name,
                functionDescription: position.function,
                selectedUnit: positionUnit ? { value: positionUnit, label: positionUnit.name } : null,
                selectedDirection: positionDirection ? { value: positionDirection, label: positionDirection.name } : null,
                isManager: position.is_manager === 1,
            });
            setSelectedOption(belongsToValue);
            setResponsibilities(position.responsibilities || []);
            setErrors({
                name: nameError,
                function: functionError,
                unit_id: "",
                direction_id: "",
                belongsTo: "",
                is_manager: "",
            });
        }
    }, [position, units, departments, isEditing]);

    useEffect(() => {
        if (!isEditing) {
            setFormData({
                name: "",
                functionDescription: "",
                selectedUnit: null,
                selectedDirection: null,
                isManager: false,
            });
            setSelectedOption(null);
            setErrors({
                name: "",
                function: "",
                unit_id: "",
                direction_id: "",
                belongsTo: "",
                is_manager: "",
            });
        }
    }, [isEditing]);

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

    const handleUnitChange = (option) => {
        setFormData({ ...formData, selectedUnit: option, selectedDirection: null });
        setErrors((prevState) => ({
            ...prevState,
            unit_id: option ? "" : UNIT_REQUIRED,
            direction_id: "",
            belongsTo: "",
            is_manager: "",
        }));
    };

    const handleDirectionChange = (option) => {
        setFormData({ ...formData, selectedDirection: option, selectedUnit: null });
        setErrors((prevState) => ({
            ...prevState,
            direction_id: option ? "" : DIRECTION_REQUIRED,
            unit_id: "",
            belongsTo: "",
            is_manager: "",
        }));
    };

    const handleOptionChange = (e) => {
        const { value } = e.target;
        setSelectedOption(value);
        setFormData({
            ...formData,
            selectedUnit: null,
            selectedDirection: null,
            isManager: false,
        });
        setErrors((prevState) => ({
            ...prevState,
            unit_id: "",
            direction_id: "",
            belongsTo: "",
            is_manager: "",
        }));
    };

    const handleIsManagerChange = (e) => {
        setFormData({ ...formData, isManager: e.target.checked });
        setErrors((prevState) => ({
            ...prevState,
            is_manager: "",
        }));
    };

    useEffect(() => {
        const isDisabled = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(isDisabled);
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            name: !name ? NAME_REQUIRED : "",
            function: !functionDescription ? FUNCTION_REQUIRED : "",
            unit_id: selectedOption === "unit" && !selectedUnit ? UNIT_REQUIRED : "",
            direction_id: selectedOption === "direction" && !selectedDirection ? DIRECTION_REQUIRED : "",
            belongsTo: !selectedOption ? UNIT_OR_DIRECTION_REQUIRED : "",
            responsibilities: responsibilities.length === 0 ? RESPONSIBILITY_REQUIRED : "",
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((error) => error);

        if (!hasErrors) {
            const unitId = selectedUnit ? selectedUnit.value.id : null;
            const directionId = selectedDirection ? selectedDirection.value.id : null;

            const updatePositionData = {
                name,
                function: functionDescription,
                unit_id: unitId,
                direction_id: directionId,
                is_manager: isManager,
                responsibilities,
            };

            onSubmit(updatePositionData);
        }
    };

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
                <div className="flex gap-4">
                    <label>
                        <input
                            type="radio"
                            name="belongsTo"
                            value="unit"
                            checked={selectedOption === "unit"}
                            onChange={handleOptionChange}
                        />
                        Unidad
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="belongsTo"
                            value="direction"
                            checked={selectedOption === "direction"}
                            onChange={handleOptionChange}
                        />
                        Dirección
                    </label>
                </div>
                {selectedOption === "unit" && (
                    <>
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
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="isManager"
                                checked={isManager}
                                onChange={handleIsManagerChange}
                                className="mr-2"
                            />
                            ¿Es jefe de la unidad?
                        </label>
                    </>
                )}
                {selectedOption === "direction" && (
                    <>
                        <CustomSelect
                            label="Dirección"
                            options={departments}
                            value={selectedDirection}
                            onChange={handleDirectionChange}
                            placeholder="Selecciona una dirección"
                            error={errors.direction_id}
                            isSearchable={true}
                            labelKey="name"
                        />
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="isManager"
                                checked={isManager}
                                onChange={handleIsManagerChange}
                                className="mr-2"
                            />
                            ¿Es jefe de la dirección?
                        </label>
                    </>
                )}
                {errors.belongsTo && (
                    <div className="text-red-500 text-xs mt-0">
                        {errors.belongsTo}
                    </div>
                )}
                {errors.is_manager && (
                    <div className="text-red-500 text-xs mt-0">
                        {errors.is_manager}
                    </div>
                )}
            </div>

            <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 mt-4  rounded-lg w-full hover:bg-gray-300 transition-colors"
                onClick={() => setIsResponsibilitiesModalOpen(true)}
            >
                Gestionar responsabilidades
            </button>
            {errors.responsibilities && (
                <div className="text-red-500 text-xs mt-2">
                    {errors.responsibilities}
                </div>
            )}



            {isResponsibilitiesModalOpen && (
                <ResponsibilitiesModal
                    responsibilities={responsibilities}
                    onSave={(updatedResponsibilities) => {
                        setResponsibilities(updatedResponsibilities);
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            responsibilities: updatedResponsibilities.length === 0 ? RESPONSIBILITY_REQUIRED : "",
                        }));
                        setIsResponsibilitiesModalOpen(false);
                    }}
                    onClose={() => setIsResponsibilitiesModalOpen(false)}
                />
            )}

            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="submit"
                    className={`p-2 px-1 rounded-xl text-white w-full outline-none border border-transparent transform transition-all duration-300 hover:scale-105 ${isSubmitDisabled
                        ? `${confirmButtonColor} opacity-70 cursor-not-allowed`
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
}

export default PositionForm;