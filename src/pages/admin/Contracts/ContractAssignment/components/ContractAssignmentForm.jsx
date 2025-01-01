import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../../../../redux/Employee/employeSlice.js";
import { fetchAllContractTypes } from "../../../../../redux/Contracts/contractTypeSlince.js"
import Input from "../../../../../components/ui/Input.jsx";
import CustomSelect from "../../../../../components/ui/Select.jsx";
import { LiaFileSignatureSolid } from "react-icons/lia";
// Validar campos individuales
const validateField = (name, value) => {
    const today = new Date(); // Fecha actual
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 2);
    switch (name) {
        case "employee_id":
            return value ? "" : "Por favor, selecciona un empleado.";
        case "contract_type_id":
            return value ? "" : "Por favor, selecciona un tipo de contrato.";
        case "start_date":
            if (!value) {
                return "Por favor, selecciona una fecha de inicio.";
            }
            const selectedDate = new Date(value);
            if (selectedDate < today) {
                return "La fecha de inicio no puede ser una fecha pasada.";
            }
            if (selectedDate > maxDate) {
                return `La fecha de inicio no puede ser más de dos años después de hoy (${maxDate.toISOString().split('T')[0]}).`;
            }
            return ""; // Sin errores
        default:
            return "";
    }
};

// Validar todos los campos del formulario
const validateAllFields = (formData) => ({
    employee_id: validateField("employee_id", formData.employee_id),
    contract_type_id: validateField("contract_type_id", formData.contract_type_id),
    start_date: validateField("start_date", formData.start_date),
});

const ContractAssignmentForm = ({
    onSubmit,
    onCancel,
    formErrors = {},
    isSubmitting = false,
    confirmButtonText = "Crear",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-600",
    cancelButtonColor = "border-gray-400",
}) => {
    const dispatch = useDispatch();
    const employeesState = useSelector((state) => state.employee);
    const contractTypesState = useSelector((state) => state.contractTypes);

    // Obtener listas filtradas de empleados y tipos de contratos
    const employees = employeesState?.employees?.filter(
        (employee) => !employee.has_active_contract
    ) || [];
    const contractTypes = contractTypesState?.contractTypes?.filter(
        (contractType) => contractType.status === "Activo"
    ) || [];

    // Estados locales
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedContractType, setSelectedContractType] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [errors, setErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(false);

    // Efecto para cargar datos si no han sido previamente obtenidos
    useEffect(() => {
        if (!employeesState.hasFetchedAll) {
            dispatch(fetchEmployees());
        }
        if (!contractTypesState.hasFetchedAll) {
            dispatch(fetchAllContractTypes());
        }
    }, [dispatch, employeesState.hasFetchedAll, contractTypesState.hasFetchedAll]);

    // Actualizar errores del formulario
    useEffect(() => {
        setErrors((prevErrors) => ({ ...prevErrors, ...formErrors }));
    }, [formErrors]);


    // Manejo del cambio en el selector de empleado
    const handleEmployeeChange = (option) => {
        setSelectedEmployee(option);
        setErrors((prevErrors) => ({
            ...prevErrors,
            employee_id: validateField("employee_id", option?.value),
        }));
    };

    // Manejo del cambio en el selector de tipo de contrato
    const handleContractTypeChange = (option) => {
        setSelectedContractType(option);
        // Validar inmediatamente el campo
        setErrors((prevErrors) => ({
            ...prevErrors,
            contract_type_id: validateField("contract_type_id", option?.value),
        }));
    };

    // Manejo del cambio en el campo de fecha
    const handleDateChange = (e) => {
        const { value } = e.target;
        setStartDate(value);
        // Validar inmediatamente el campo
        setErrors((prevErrors) => ({
            ...prevErrors,
            start_date: validateField("start_date", value),
        }));
    };

    // Manejo del envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            employee_id: selectedEmployee?.value.id || null,
            contract_type_id: selectedContractType?.value.id || null,
            start_date: startDate || null,
        };

        // Validar todos los campos
        const validationErrors = validateAllFields(formData);
        setErrors(validationErrors);

        if (Object.values(validationErrors).some((error) => error)) return;

        // Enviar datos si no hay errores
        onSubmit(formData);
    };

    useEffect(() => {
        setHasErrors(Object.values(errors).some((error) => error));
    }, [errors]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de empleado */}
            <div>
                <CustomSelect
                    label="Empleado"
                    options={employees}
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                    placeholder="Selecciona un empleado"
                    error={errors.employee_id}
                    isSearchable={true}
                    labelKey="full_name"
                />
            </div>
            {/* Selector de tipo de contrato */}
            <div>
                <CustomSelect
                    label="Tipo de Contrato"
                    options={contractTypes}
                    value={selectedContractType}
                    onChange={handleContractTypeChange}
                    placeholder="Selecciona un tipo de contrato"
                    error={errors.contract_type_id}
                    isSearchable={true}
                    labelKey="name"
                />
            </div>
            {/* Campo de fecha */}
            <div>
                <Input
                    label="Fecha de Inicio"
                    type="date"
                    name="start_date"
                    value={startDate}
                    onChange={handleDateChange}
                    icon={LiaFileSignatureSolid}
                    error={errors.start_date}
                />
            </div>
            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="submit"
                    aria-label={isSubmitting ? "Enviando..." : confirmButtonText}
                    className={`p-2 rounded-xl text-white w-full 
        ${confirmButtonColor} outline-none border border-transparent transform transition-all duration-300 hover:scale-105 
        ${isSubmitting || hasErrors ? "opacity-70 cursor-not-allowed" : ""}`}
                    disabled={hasErrors}
                >
                    {isSubmitting ? "Enviando..." : confirmButtonText}
                </button>
                <button
                    type="button"
                    aria-label={cancelButtonText}
                    className={`p-2 rounded-xl bg-transparent border border-dashed ${cancelButtonColor} w-full outline-none transform transition-all duration-300 hover:scale-105`}
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    {cancelButtonText}
                </button>
            </div>
        </form>
    );
};

export default ContractAssignmentForm;