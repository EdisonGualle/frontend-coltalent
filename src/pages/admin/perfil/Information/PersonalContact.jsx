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

const PersonalContact = () => {
    const { id } = useParams(); // Obtener el id de la URL
    const { showAlert } = useContext(AlertContext);
    const [contactData, setContactData] = useState({
        personal_phone: "",
        personal_email: "",
        home_phone: "",
        work_phone: "",
    });

    const { user } = useAuth();
    const dispatch = useDispatch();
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});
   
    const refreshEmployeeData = async () => {
        try {
            const response = await getEmployee(id);
            const data = response.data || {};
            setContactData({
                personal_phone: data.contact?.personal_phone || "",
                personal_email: data.contact?.personal_email || "",
                home_phone: data.contact?.home_phone || "",
                work_phone: data.contact?.work_phone || "",
            });
        } catch (error) {
            showAlert('Hubo un problema al cargar los datos de contacto del empleado. Por favor, intenta nuevamente.', 'error');
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
                    label="Teléfono Personal"
                    id="personal_phone"
                    value={contactData.personal_phone}
                    onChange={(e) => setContactData({ ...contactData, personal_phone: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Correo Personal"
                    id="personal_email"
                    value={contactData.personal_email}
                    onChange={(e) => setContactData({ ...contactData, personal_email: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Teléfono de Casa"
                    id="home_phone"
                    value={contactData.home_phone}
                    onChange={(e) => setContactData({ ...contactData, home_phone: e.target.value })}
                    size="medium"
                    disabled={true}
                />
                <SimpleInput
                    label="Teléfono de Trabajo"
                    id="work_phone"
                    value={contactData.work_phone}
                    onChange={(e) => setContactData({ ...contactData, work_phone: e.target.value })}
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

export default PersonalContact;