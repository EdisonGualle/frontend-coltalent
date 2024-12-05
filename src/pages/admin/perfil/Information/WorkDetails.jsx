import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SimpleInput from "../../../../components/ui/SimpleInput";
import { RiEditLine } from 'react-icons/ri';
import { getEmployee } from "../../../../services/Employee/EmployeService1";
import { AlertContext } from "../../../../contexts/AlertContext";
import { useAuth } from "../../../../hooks/useAuth";
import EmployeeForm from "../../Employee/EmployeeForm";
import ModalForm from "../../../../components/ui/ModalForm";
import { useDispatch } from "react-redux";
import { updateOneEmployee } from '../../../../redux/Employee/employeSlice';

const WorkDetails = () => {
    const { id } = useParams(); // Obtener el id de la URL
    const { showAlert } = useContext(AlertContext);
    const [workData, setWorkData] = useState({
        position: "",
        unit: null,
        unitFunction: "",
        direction: "",
        directionFunction: "",
        function: "",
        role: "",
    });

    const { user } = useAuth();
    const dispatch = useDispatch();
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const refreshEmployeeData = async () => {
        try {
            const response = await getEmployee(id);
            const data = response.data || {};
            setWorkData({
                position: data.position?.name || "",
                unit: data.unit || null,
                unitFunction: data.unit?.function || "",
                direction: data.direction?.name || "",
                directionFunction: data.direction?.function || "",
                function: data.position?.function || "",
                role: data.user?.role?.name || "",
            });
        } catch (error) {
            showAlert('Hubo un problema al cargar los datos laborales del empleado. Por favor, intenta nuevamente.', 'error');
        }
    };

    useEffect(() => {
        refreshEmployeeData();
    }, [id]);

    const handleEditSubmit = async (submissionData) => {
        try {
            await dispatch(updateOneEmployee({ id: submissionData.id, submissionData })).unwrap();
            setIsOpenEditModal(false);
            showAlert('Empleado actualizado correctamente.', 'success');
            refreshEmployeeData();
        } catch (error) {
            if (error.errors) {
                setFormErrors(error.errors);
                showAlert('Por favor corrija los errores en el formulario.', 'error');
            } else {
                showAlert('Ocurrió un error en el servidor. Inténtelo de nuevo más tarde.', 'error');
            }
        }
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-b-lg">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SimpleInput
                    label="Dirección"
                    id="direction"
                    value={workData.direction}
                    onChange={(e) => setWorkData({ ...workData, direction: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Función de la Dirección"
                    id="directionFunction"
                    value={workData.directionFunction}
                    onChange={(e) => setWorkData({ ...workData, directionFunction: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                {workData.unit && (
                    <>
                        <SimpleInput
                            label="Unidad"
                            id="unit"
                            value={workData.unit.name}
                            onChange={(e) => setWorkData({ ...workData, unit: { ...workData.unit, name: e.target.value } })}
                            size="medium"
                            disabled={true}
                        />
                        <SimpleInput
                            label="Función de la Unidad"
                            id="unitFunction"
                            value={workData.unitFunction}
                            onChange={(e) => setWorkData({ ...workData, unitFunction: e.target.value })}
                            size="medium"
                            disabled={true}
                        />
                    </>
                )}
                <SimpleInput
                    label="Cargo"
                    id="position"
                    value={workData.position}
                    onChange={(e) => setWorkData({ ...workData, position: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Descripción del Cargo"
                    id="function"
                    value={workData.function}
                    onChange={(e) => setWorkData({ ...workData, function: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Rol dentro del Sistema"
                    id="role"
                    value={workData.role}
                    onChange={(e) => setWorkData({ ...workData, role: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                {user.role === 'Administrador' && (
                    <div className="sm:col-span-2 flex justify-end mb-2">
                        <button
                            className="flex items-center gap-3 bg-gray-200 text-white hover:bg-gray-300 transition-colors rounded-xl py-2 px-5"
                            size="sm"
                            type="button" 
                            onClick={() => setIsOpenEditModal(true)}
                        >
                            <RiEditLine className="h-5 w-5 text-gray-600" />
                            <span className="font-semibold text-gray-600">Editar Información</span>
                        </button>
                    </div>
                )}
            </form>
            <ModalForm
                isOpen={isOpenEditModal}
                maxWidth='max-w-4xl'
                setIsOpen={setIsOpenEditModal}
                title="Editar empleado"
                icon={<RiEditLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
            >
                <EmployeeForm
                    onSubmit={handleEditSubmit}
                    onCancel={() => setIsOpenEditModal(false)}
                    formErrors={formErrors}
                    initialData={{ id }}
                    isEditMode={true}
                />
            </ModalForm>

        </div>
    );
};

export default WorkDetails;