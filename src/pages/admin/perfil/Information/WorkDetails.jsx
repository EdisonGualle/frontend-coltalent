import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SimpleInput from "../../../../components/ui/SimpleInput";
import { RiEditLine } from 'react-icons/ri';
import { getEmployee } from "../../../../services/Employee/EmployeService1";
import { AlertContext } from "../../../../contexts/AlertContext";
import { useAuth } from "../../../../hooks/useAuth";

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

    useEffect(() => {
        const fetchEmployeeData = async () => {
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

        fetchEmployeeData();
    }, [id]);

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
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
                        >
                            <RiEditLine className="h-5 w-5 text-gray-600" />
                            <span className="font-semibold text-gray-600">Editar Información</span>
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default WorkDetails;