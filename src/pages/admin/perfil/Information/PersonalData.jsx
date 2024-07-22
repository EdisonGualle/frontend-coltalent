import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SimpleInput from "../../../../components/ui/SimpleInput";
import SimpleSelect from "../../../../components/ui/SimpleSelect";
import CustomButton from "../../../../components/ui/Button";
import { RiEditLine } from 'react-icons/ri';
import { getEmployee } from "../../../../services/Employee/EmployeService1";
import { AlertContext } from "../../../../contexts/AlertContext";
import { useAuth } from "../../../../hooks/useAuth";
import EmployeeForm from "../../Employee/EmployeeForm";
import ModalForm from "../../../../components/ui/ModalForm";
import { useDispatch } from "react-redux";
import { updateOneEmployee } from '../../../../redux/Employee/employeSlice';

const PersonalData = () => {
  const { id } = useParams(); // Obtener el id de la URL
  const { showAlert } = useContext(AlertContext);
  const [employeeData, setEmployeeData] = useState({
    identification: "",
    first_name: "",
    second_name: "",
    last_name: "",
    second_last_name: "",
    date_of_birth: "",
    gender: "",
    ethnicity: "",
    marital_status: "",
    nationality: "",
  });

  const { user } = useAuth();
  const dispatch = useDispatch();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const refreshEmployeeData = async () => {
    try {
      const response = await getEmployee(id);
      const data = response.data;
      setEmployeeData({
        ...data,
        contact: {
          personal_phone: data.contact?.personal_phone || "",
          personal_email: data.contact?.personal_email || "",
          home_phone: data.contact?.home_phone || "",
          work_phone: data.contact?.work_phone || ""
        },
        address: {
          sector: data.address?.sector || "",
          main_street: data.address?.main_street || "",
          secondary_street: data.address?.secondary_street || "",
          number: data.address?.number || "",
          reference: data.address?.reference || "",
          parish: {
            nombre: data.address?.parish?.nombre || "",
            canton: {
              name: data.address?.parish?.canton?.name || "",
              province: {
                name: data.address?.parish?.canton?.province?.name || ""
              }
            }
          }
        }
      });
    } catch (error) {
      showAlert('Hubo un problema al cargar los datos del empleado. Por favor, intenta nuevamente.', 'error');
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
    <div className="bg-white p-4 shadow-md rounded-lg">
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <SimpleInput
          label="Cédula de Identidad"
          id="identification"
          placeholder=""
          value={employeeData.identification}
          onChange={(e) => setEmployeeData({ ...employeeData, identification: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Primer Nombre"
          id="first_name"
          placeholder=""
          value={employeeData.first_name}
          onChange={(e) => setEmployeeData({ ...employeeData, first_name: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Segundo Nombre"
          id="second_name"
          placeholder=""
          value={employeeData.second_name}
          onChange={(e) => setEmployeeData({ ...employeeData, second_name: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Primer Apellido"
          id="last_name"
          placeholder=""
          value={employeeData.last_name}
          onChange={(e) => setEmployeeData({ ...employeeData, last_name: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Segundo Apellido"
          id="second_last_name"
          placeholder=""
          value={employeeData.second_last_name}
          onChange={(e) => setEmployeeData({ ...employeeData, second_last_name: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Fecha de Nacimiento"
          id="date_of_birth"
          placeholder=""
          value={employeeData.date_of_birth}
          onChange={(e) => setEmployeeData({ ...employeeData, date_of_birth: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Género"
          id="gender"
          placeholder=""
          value={employeeData.gender}
          onChange={(e) => setEmployeeData({ ...employeeData, gender: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Etnia"
          id="ethnicity"
          placeholder=""
          value={employeeData.ethnicity}
          onChange={(e) => setEmployeeData({ ...employeeData, ethnicity: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Estado Civil"
          id="marital_status"
          placeholder=""
          value={employeeData.marital_status}
          onChange={(e) => setEmployeeData({ ...employeeData, marital_status: e.target.value })}
          size="medium"
          disabled={true}
        />
        <SimpleInput
          label="Nacionalidad"
          id="nationality"
          placeholder=""
          value={employeeData.nationality}
          onChange={(e) => setEmployeeData({ ...employeeData, nationality: e.target.value })}
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

export default PersonalData;