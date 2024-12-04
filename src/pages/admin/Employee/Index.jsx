import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { RiGalleryView2, RiUserAddLine, RiListView, RiFileExcel2Line, RiDownloadLine } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import EmployeeList from './components/Card/EmployeeList';
import EmployeeTable from './components/Table/EmployeTable';
import ModalForm from '../../../components/ui/ModalForm';
import EmployeeForm from './EmployeeForm';
import { createNewEmployee, fetchEmployees } from '../../../redux/Employee/employeSlice';
import { AlertContext } from '../../../contexts/AlertContext';
import ExportConfigForm from './ExportConfigForm';
import { exportEmployees } from '../../../services/Exports/employeeExportService';

const EmployeeIndex = () => {
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const [showList, setShowList] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);


  const handleViewChange = (view) => {
    setShowList(view === 'list' || view === 'gallery');
  };

  const handleOpenCreateModal = () => {
    setFormErrors({});
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setFormErrors({});
    setIsOpenModal(false);
  };

  
  const handleOpenExportModal = () => {
    setIsExportModalOpen(true);
  };

  const handleCloseExportModal = () => {
    setIsExportModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      await dispatch(createNewEmployee(formData)).unwrap();
      dispatch(fetchEmployees()); 
      setIsOpenModal(false);
      showAlert('Empleado creado exitosamente.', 'success');
    } catch (error) {
      if (error.errors) {
        setFormErrors(error.errors);
        showAlert('Por favor corrija los errores en el formulario.', 'error');
      } else {
        showAlert('Ocurrió un error en el servidor. Inténtelo de nuevo más tarde.', 'error');
      }
    }
  };
  
  

  const handleExportSubmit = async (exportParams) => {
    try {
      const blob = await exportEmployees(exportParams);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setIsExportModalOpen(false);
      showAlert('Exportación exitosa.', 'success');
    } catch (error) {
      showAlert('Ocurrió un error al exportar los datos. Inténtelo de nuevo más tarde.', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto mb-4">
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de empleados
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver información sobre todos los empleados
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center bg-cyan-500 text-white hover:bg-cyan-600 transition-colors rounded-xl"
              size="sm"
              onClick={() => handleViewChange('gallery')}
            >
              <RiGalleryView2 className="h-5 w-5" />
            </Button>
            <Button
              className="flex items-center bg-teal-500 text-white hover:bg-teal-600 transition-colors rounded-xl"
              size="sm"
              onClick={() => handleViewChange('table')}
            >
              <RiListView className="h-5 w-5" />
            </Button>
            <Button
              className="flex items-center gap-3 bg-green-500 text-white hover:bg-green-600 transition-colors rounded-xl py-2 px-5"
              size="sm"
              onClick={handleOpenExportModal}
            >
              <RiFileExcel2Line className="h-5 w-5" />
              <span className="font-semibold">Reporte</span>
            </Button>
            <Button
              className="flex items-center gap-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-xl py-2 px-5"
              size="sm"
              onClick={handleOpenCreateModal}
            >
              <RiUserAddLine className="h-5 w-5" />
              <span className="font-semibold">Nuevo Empleado</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="flex-1 overflow-y-auto">
        {showList ? (
          <EmployeeList />
        ) : (
          <EmployeeTable />
        )}
      </div>
      <ModalForm
        isOpen={isOpenModal}
        maxWidth='max-w-4xl'
        setIsOpen={setIsOpenModal}
        title="Crear nuevo empleado"
        icon={<RiUserAddLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
      >
        <EmployeeForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          formErrors={formErrors}
        />
      </ModalForm>

      <ModalForm
        isOpen={isExportModalOpen}
        
        setIsOpen={setIsExportModalOpen}
        title="Configuración de reporte de empleados"
        icon={<RiDownloadLine className="w-6 h-6 flex items-center justify-center rounded-full text-blue-500" />}
      >
        <ExportConfigForm
          onSubmit={handleExportSubmit}
          onCancel={handleCloseExportModal}
        />
      </ModalForm>

    </div>
  );
};

export default EmployeeIndex;