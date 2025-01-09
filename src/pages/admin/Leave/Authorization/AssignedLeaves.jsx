import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardHeader, Typography } from "@material-tailwind/react";
import { getColumns } from './Table/getColumns';
import { useAuth } from '../../../../hooks/useAuth';
import { fetchAssignedLeaves, setAssignedLeaveFilter, updateCache, clearCache } from '../../../../redux/Leave/assignedLeavesSlice';
import { getAuthorizationCellStyle } from './Table/authorizationColumnsStyles';
import ActionModal from './Table/ActionModal';
import PermissionDetailModal from './PermissionDetails/PermissionDetailModal';
import LoadingIndicator from '../../../../components/ui/LoadingIndicator';
import renderAssignedLeavesActions from './Table/renderAssignedLeavesActions';
import MotionWrapper from '../../../../components/ui/MotionWrapper';
import LeaveTable from '../Table/LeaveTable';

const AssignedLeaves = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { leaves, filter, loading, error, cache } = useSelector((state) => state.assignedLeaves);

  const [currentFilter, setCurrentFilter] = useState('pendientes');
  const [columns, setColumns] = useState(getColumns(user.role, 'pendientes'));

  // Estado para acciones del modal
  const [actionModalData, setActionModalData] = useState(null); // Datos del modal de acciones
  const [actionModalAction, setActionModalAction] = useState(''); // Acción (Aprobar/Rechazar)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false); // Control de visibilidad del modal de acciones

  // Estado para el modal de detalles (Ver más)
  const [detailModalData, setDetailModalData] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
    setActionModalData(leave);
    setActionModalAction(action);
    setIsActionModalOpen(true);
  };

  const handleViewDetails = (leave) => {
    setDetailModalData(leave);
    setIsDetailModalOpen(true);
  };

  const handleSuccess = () => {
    // Limpia el caché y vuelve a obtener los datos actualizados
    dispatch(clearCache());
    ['pendientes', 'aprobados', 'rechazados', 'historial'].forEach((filter) => {
      dispatch(fetchAssignedLeaves({ employeeId: user.employee_id, filter })).then((response) => {
        dispatch(updateCache({ filter, data: response.payload.data }));
      });
    });
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setColumns(getColumns(user.role, filter)); // Actualiza las columnas cada vez que se cambia el filtro
    if (!cache[filter]) {
      dispatch(fetchAssignedLeaves({ employeeId: user.employee_id, filter }));
    } else {
      dispatch(setAssignedLeaveFilter(filter));
    }
  };

  const closeActionModal = () => {
    setIsActionModalOpen(false);
    setActionModalData(null);
    setActionModalAction('');
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailModalData(null);
  };

  return (
    <div>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100 mb-2">
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
              className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ease-in-out ${currentFilter === filter
                ? 'bg-secondary-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-200 hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
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
      <MotionWrapper keyProp={currentFilter}>
        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <LeaveTable
            key={currentFilter}
            columns={columns}
            getCellStyle={getAuthorizationCellStyle}
            data={leaves}
            showActions={true}
            showFilters={false}
            showExport={false}
            showAddNew={false}
            showColumnOptions={false}
            actions={(row) =>
              renderAssignedLeavesActions({
                row,
                handleViewDetails,
                handleActionClick,
                currentFilter,
              })
            }
          />
        )}
      </MotionWrapper>
      {isActionModalOpen && (
        <ActionModal
          action={actionModalAction}
          data={actionModalData}
          onClose={closeActionModal}
          onSuccess={handleSuccess}
        />
      )}
      {isDetailModalOpen && (
        <PermissionDetailModal
          data={detailModalData}
          onClose={closeDetailModal}
        />
      )}
    </div>
  );
};

export default AssignedLeaves;
