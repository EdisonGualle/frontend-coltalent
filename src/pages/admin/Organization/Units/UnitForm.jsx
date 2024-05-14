import React, { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import Textarea from "../../../../components/ui/Textarea";
import CustomSelect from "../../../../components/ui/Select";
import { fetchEmployees } from "../../../../redux/Employee/employeSlice";
import { validateLandlinePhone, validateName } from "../../../../Utils/validationsV2";
import { fetchDepartments } from "../../../../redux/Organization/DepartamentSlice";
import { RiPhoneLine } from "react-icons/ri";

const NAME_REQUIRED = "Se requiere el nombre de la unidad.";
const FUNCTION_REQUIRED = "Indica la función que desempeña la unidad.";
const FUNCTION_DESCRIPTION_REQUIRED = "Proporciona una descripción de la función que desempeña la unidad.";
const HEAD_EMPLOYEE_REQUIRED = "Selecciona un jefe de unidad.";
const DEPARTMENT_REQUIRED = "Selecciona un departamento.";

const UnitForm = ({
    unit,
    isEditing,
    onSubmit,
    onCancel,
    confirmButtonText = isEditing ? "Guardar cambios" : "Crear unidad",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "bg-blue-500",
    cancelButtonColor = "border-gray-400",
    formErrors = {},
}) => {
    
    const dispatch = useDispatch();
    const employeesState = useSelector((state) => state.employee);
    const employees = employeesState ? employeesState.employees : [];
    const departmentsState = useSelector((state) => state.departament);
    const departments = departmentsState ? departmentsState.departments : [];
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    // Estados locales para manejar los errores y los datos del formulario
    const [formData, setFormData] = useState({
        name: "",
        functionDescription: "",
        landlinePhone: "",
        selectedEmployee: null,
        selectDepartment: null,
    });
    const [errors, setErrors] = useState({
        name: "",
        function: "",
        phone: "",
        head_employee_id: "",
        department_id: "",
    });

    // Desestructurar los datos del formulario
    const { name, functionDescription, landlinePhone, selectedEmployee, selectDepartment } = formData;

    // Efecto para actualizar los errores del formulario
    useEffect(() => {
        setErrors(formErrors);
    }, [formErrors]);

    // Efecto para cargar los empleados
    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchDepartments());
    }, [dispatch]);

    // Efecto para cargar los datos de la unidad a editar
    useEffect(() => {
        // Encontrar el empleado que es jefe de unidad
        const unitEmployee = employees.find((employee) => employee.id === unit?.head_employee_id);

        // Encontrar el departamento al que pertenece la unidad
        const unitDepartment = departments.find((department) => department.id === unit?.department?.id);


        // Validar los datos de la unidad
        if (isEditing && unit && employees.length > 0 && departments.length > 0) {
            const nameError = validateName(unit.name) || "";
            const functionError = !unit.function ? FUNCTION_DESCRIPTION_REQUIRED : "";
            const landlinePhoneError = validateLandlinePhone(unit.phone) || "";
            // Actualizar los datos del formulario y los errores
            setFormData({
                name: unit.name,
                functionDescription: unit.function,
                landlinePhone: unit.phone,
                selectedEmployee: unitEmployee ? { value: unitEmployee, label: unitEmployee.full_name } : null,
                selectDepartment: unitDepartment ? { value: unitDepartment, label: unitDepartment.name } : null,
            });
            setErrors({
                name: nameError,
                function: functionError,
                phone: landlinePhoneError,
                head_employee_id: "",
                department_id: "",
            });
        }
    }, [unit, employees, departments, isEditing]);


    // Efecto para limpiar los datos del formulario al cancelar la edición
    useEffect(() => {
        if (!isEditing) {
            setFormData({ name: "", functionDescription: "", landlinePhone: "", selectedEmployee: null, selectDepartment: null });
            setErrors({ name: "", function: "", phone: "", head_employee_id: "", department_id: "" });
        }
    }, [isEditing]);

    // Función para manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "name") {
            const nameError = validateName(value);
            setErrors({ ...errors, name: nameError || "" });
        } else if (name === "functionDescription") {
            const functionError = !value.trim() ? FUNCTION_DESCRIPTION_REQUIRED : "";
            setErrors({ ...errors, function: functionError });
        } else if (name === "landlinePhone") {
            const landlinePhoneError = validateLandlinePhone(value);
            setErrors({ ...errors, phone: landlinePhoneError || "" });
        }

        setFormData({ ...formData, [name]: value });
    };

    // Función para manejar el cambio en el campo de jefe de unidad
    const handleEmployeeChange = (option) => {
        setFormData({ ...formData, selectedEmployee: option });
        setErrors((prevErrors) => ({
            ...prevErrors,
            head_employee_id: option ? '' : HEAD_EMPLOYEE_REQUIRED
        }));
    };

    // Función para manejar el cambio en el campo de departamento
    const handleDepartmentChange = (option) => {
        setFormData({ ...formData, selectDepartment: option });
        setErrors((prevErrors) => ({
            ...prevErrors,
            department_id: option ? '' : DEPARTMENT_REQUIRED
        }));
    };

    // Efecto para deshabilitar el botón de envío cuando haya errores
    useEffect(() => {
        const hasErrors = Object.values(errors).some((error) => error);
        setIsSubmitDisabled(hasErrors);
    }, [errors]);


    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar los campos del formulario
        const newErrors = {
            name: !name ? NAME_REQUIRED : "",
            function: !functionDescription ? FUNCTION_REQUIRED : "",
            head_employee_id: !selectedEmployee ? HEAD_EMPLOYEE_REQUIRED : "",
            department_id: !selectDepartment ? DEPARTMENT_REQUIRED : "",
        };

        // Actualizar los errores
        setErrors(newErrors);

        // Verificar si hay errores
        const hasErrors = Object.values(newErrors).some((error) => error);

        if (!hasErrors) {
            const headEmployeeId = selectedEmployee ? selectedEmployee.value.id : null;
            const departmentId = selectDepartment ? selectDepartment.value.id : null;

            // Crear el objeto con los datos actualizados de la unidad
            const updatedUnitData = {
                name,
                function: functionDescription,
                phone: landlinePhone,
                head_employee_id: headEmployeeId,
                department_id: departmentId
            };

            // Enviar los datos del formulario al componente padre
            onSubmit(updatedUnitData);
        }
    }

    return (
        <div className="max-w-1xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="Nombre de la unidad"
                                id="name"
                                placeholder="Ej. Gerencia de ventas"
                                value={name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                        </div>
                        <div>
                            <Input
                                label="Teléfono fijo"
                                id="landlinePhone"
                                placeholder="Ej. 022569542"
                                value={landlinePhone}
                                icon={RiPhoneLine}
                                onChange={handleChange}
                                error={errors.phone}
                            />
                        </div>
                    </div>
                    <div>
                        <Textarea
                            label="Función de la unidad"
                            id="functionDescription"
                            placeholder="Ej. Dirigir y coordinar las actividades de la unidad de ventas"
                            value={functionDescription}
                            onChange={handleChange}
                            error={errors.function}
                            rows={2}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <CustomSelect
                                label="Departamento"
                                options={departments}
                                value={selectDepartment}
                                onChange={handleDepartmentChange}
                                placeholder="Selecciona un departamento"
                                error={errors.department_id}
                                isSearchable={true}
                                labelKey="name"
                            />
                        </div>
                        <div>
                            <CustomSelect
                                label="Jefe de la unidad"
                                options={employees}
                                value={selectedEmployee}
                                onChange={handleEmployeeChange}
                                placeholder="Selecciona un empleado"
                                error={errors.head_employee_id}
                                isSearchable={true}
                                labelKey="full_name"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
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
        </div>
    );
};

export default UnitForm;
