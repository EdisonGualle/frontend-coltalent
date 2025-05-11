import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CardHeader, Typography } from "@material-tailwind/react";
import {historyColumns, historyFilters} from './historyColumns';
import { fetchLeaveHistory, setLeaveHistoryFilter, updateCache, clearCache } from '../../../../redux/Leave/leaveHistorySlince';
import { getHistoryCellStyle } from './historyComumnStyles';
import PermissionDetailModal from '../Authorization/PermissionDetails/PermissionDetailModal';
import LoadingIndicator from '../../../../components/ui/LoadingIndicator';
import renderHistoryActions from './renderHistoryActions';
import MotionWrapper from '../../../../components/ui/MotionWrapper';
import LeaveTable from '../Table/LeaveTable';
import { exportToExcel } from "../../Subrogations/Table/exportToExcel";
import { exportToPdf } from "../../Subrogations/Table/exportToPdf";

const History = () => {
  const { id: employeeId } = useParams(); // Obtener employeeId desde la ruta
  const dispatch = useDispatch();
  const leaveHistory = useSelector((state) => state.leaveHistory) || {};
  const { leaves = [], filter, loading, error, cache = {} } = leaveHistory;
  const [currentFilter, setCurrentFilter] = useState('pendientes');
  const [columns, setColumns] = useState(historyColumns.pendientes);

  const [detailModalData, setDetailModalData] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (!cache[currentFilter]) {
      dispatch(fetchLeaveHistory({ employeeId, filter: currentFilter }))
        .then(response => {
          dispatch(updateCache({ filter: currentFilter, data: response.payload.data }));
        });
    } else {
      dispatch(setLeaveHistoryFilter(currentFilter));
    }
  }, [dispatch, employeeId, currentFilter, cache]);

  useEffect(() => {
    setColumns(historyColumns[currentFilter]);
  }, [currentFilter]);

  // Manejo del permiso seleccionado
  const handleViewDetails = (leave) => {
    setDetailModalData(leave); // Pasa el permiso seleccionado
    setIsDetailModalOpen(true); // Abre el modal
  };

  // Manejo de cierre del modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailModalData(null);
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setColumns(historyColumns[filter]);
    if (!cache[filter]) {
      dispatch(fetchLeaveHistory({ employeeId, filter }))
        .then(response => {
          dispatch(updateCache({ filter, data: response.payload.data }));
        });
    } else {
      dispatch(setLeaveHistoryFilter(filter));
    }
  };

  const handleExport = (data, columns, options = {}) => {
    const { filename = "historial_permisos", sheetName = "Historial de Permisos", format = "excel" } = options;
  
    // Generar un identificador único basado en la fecha y hora actual
    const uniqueId = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const baseFilename = filename.replace(/\.(xlsx|pdf)$/, ""); // Eliminar extensión si existe
    const uniqueFilename = `${baseFilename}_${uniqueId}`;
  
    // Manejar exportación según el formato
    if (format === "excel") {
      exportToExcel(data, columns, {
        filename: `${uniqueFilename}.xlsx`,
        sheetName,
      });
    } else if (format === "pdf") {
      exportToPdf(data, columns, {
        filename: `${uniqueFilename}.pdf`,
        title: sheetName,
        subtitle: "Historial de permisos de los empleados",
      });
    }
  };

  
  return (
    <div className='m-3'>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Historial de permisos
            </Typography>
            <Typography color="gray" className="mt-1">
              Aquí puedes ver el historial de tus permisos.
            </Typography>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-2">
          {['pendientes', 'aprobados', 'rechazados', 'historial'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={` px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-in-out
              ${currentFilter === filter
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-800'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-50 `}
            >
              {(() => {
                switch (filter) {
                  case 'pendientes':
                    return 'Pendientes';
                  case 'aprobados':
                    return 'Aprobadas';
                  case 'rechazados':
                    return 'Rechazadas';
                  case 'historial':
                    return 'Historial';
                  default:
                    return filter.charAt(0).toUpperCase() + filter.slice(1);
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
            getCellStyle={getHistoryCellStyle}
            data={leaves}
            showActions={true}
            showFilters={true}
            dynamicFilterColumns={historyFilters[currentFilter]}
            showExport={true}
            showAddNew={false}
            showColumnOptions={false}
            actions={(row) =>
              renderHistoryActions({
                row,
                handleViewDetails
              })
            }
            exportFunction={(data, columns, format) =>
              handleExport(data, columns, {
                filename: "historial_permisos",
                sheetName: "Historial de Permisos",
                format,
              })
            }
            exportAllColumns={false}
          />
        )}
      </MotionWrapper>
      {isDetailModalOpen && (
        <PermissionDetailModal
          data={detailModalData}
          onClose={closeDetailModal}
        />
      )}
    </div>
  );
};

export default History;
