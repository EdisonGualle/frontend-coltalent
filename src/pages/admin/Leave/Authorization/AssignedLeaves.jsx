import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardHeader, Typography } from "@material-tailwind/react";
import { RiCheckLine, RiCloseLine, RiIndeterminateCircleLine } from 'react-icons/ri';
import LeaveTable from '../components/Table/LeaveTable';
import { getColumns } from './Table/getColumns';
import { useAuth } from '../../../../hooks/useAuth';
import { fetchAssignedLeaves, setAssignedLeaveFilter, updateCache, clearCache } from '../../../../redux/Leave/assignedLeavesSlice';
import { getAuthorizationCellStyle } from './Table/authorizationColumnsStyles';
import ActionModal from './Table/ActionModal';

const AssignedLeaves = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { leaves, filter, loading, error, cache } = useSelector((state) => state.assignedLeaves);
  const [currentFilter, setCurrentFilter] = useState('pendientes');
  const [columns, setColumns] = useState(getColumns(user.role, 'pendientes'));
  const [modalData, setModalData] = useState(null);  // Estado para los datos del modal
  const [modalAction, setModalAction] = useState('');  // Estado para la acción del modal
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para controlar la visibilidad del modal

  useEffect(() => {
    if (!cache[currentFilter]) {
      dispatch(fetchAssignedLeaves({ employeeId: user.employee_id, filter: currentFilter }));
    } else {
      dispatch(setAssignedLeaveFilter(currentFilter));
    }
  }, [dispatch, user.employee_id, currentFilter, cache]);

  useEffect(() => {
    setColumns(getColumns(user.role, currentFilter));
  }, [currentFilter, user.role]);

  const handleActionClick = (leave, action) => {
    setModalData(leave);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    // Limpia el caché y vuelve a obtener los datos actualizados
    dispatch(clearCache());
    ['pendientes', 'aprobados', 'rechazados', 'historial'].forEach(filter => {
      dispatch(fetchAssignedLeaves({ employeeId: user.employee_id, filter })).then(response => {
        dispatch(updateCache({ filter, data: response.payload.data }));
      });
    });
  };

  const actions = [
    {
      label: 'Aprobar',
      icon: <RiCheckLine className="text-green-600 h-4 w-4" />,
      onClick: (leave) => handleActionClick(leave, 'Aprobar'),
      className: 'bg-green-100 hover:bg-green-200 cursor-pointer',
    },
    {
      label: 'Rechazar',
      icon: <RiCloseLine className="text-red-600 h-4 w-4" />,
      onClick: (leave) => handleActionClick(leave, 'Rechazar'),
      className: 'bg-red-100 hover:bg-red-200 cursor-pointer',
    },
    // {
    //   label: 'Corregir',
    //   icon: <RiIndeterminateCircleLine className="text-orange-600 h-4 w-4" />,
    //   onClick: (leave) => handleActionClick(leave, 'Corregir'),
    //   className: 'bg-orange-100 hover:bg-orange-200 cursor-pointer',
    // }
  ];

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setColumns(getColumns(user.role, filter)); // Actualiza las columnas cada vez que se cambia el filtro
    if (!cache[filter]) {
      dispatch(fetchAssignedLeaves({ employeeId: user.employee_id, filter }));
    } else {
      dispatch(setAssignedLeaveFilter(filter));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setModalAction('');
  };

  return (
    <div>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Autorización de permisos
            </Typography>
            <Typography color="gray" className="mt-1">
              Aquí puedes ver las solicitudes de permisos que te han sido asignadas.
            </Typography>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-2">
          {['pendientes', 'aprobados', 'rechazados', 'historial'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ease-in-out
                ${currentFilter === filter
                  ? 'bg-secondary-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
              `}
            >
              {(() => {
                switch (filter) {
                  case 'pendientes':
                    return 'Solicitudes Pendientes';
                  case 'aprobados':
                    return 'Solicitudes Aprobadas';
                  case 'rechazados':
                    return 'Solicitudes Rechazadas';
                  case 'historial':
                    return 'Historial de Solicitudes';
                  default:
                    return `Solicitudes ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
                }
              })()}
            </button>
          ))}
        </div>
      </CardHeader>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <LeaveTable
          key={currentFilter} // Asegura que el componente se re-monte cuando el filtro cambie
          columns={columns}
          getCellStyle={getAuthorizationCellStyle}
          data={leaves}
          actions={currentFilter === 'pendientes' ? actions : []}
          showActions={currentFilter === 'pendientes'}
          showFilters={false}
          showExport={false}
          showAddNew={false}
          showColumnOptions={false}
          onDelete={null}
        />
      )}
      {isModalOpen && (
        <ActionModal
          action={modalAction}
          data={modalData}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AssignedLeaves;