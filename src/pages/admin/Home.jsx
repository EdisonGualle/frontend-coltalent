import React, { useEffect, useState, useRef } from "react";
import {
  RiUserLine,
  RiBuildingLine,
  RiGroupLine,
  RiTeamLine,
  RiBriefcaseLine,
  RiFileList3Line,
  RiFileListLine,    // Total de permisos solicitados
  RiCheckboxCircleLine,  // Permisos aprobados
  RiCloseCircleLine  // Permisos rechazados
} from "react-icons/ri";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { getCompleteDashboardStatistics } from "../../services/dashboardStatisticsService";
import { useAuth } from "../../hooks/useAuth";
import LoadingIndicator from '../../components/ui/LoadingIndicator'
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [barData, setBarData] = useState(null);
  const [horizontalBarData, setHorizontalBarData] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);  // Estado de carga
  const barRef = useRef(null);
  const horizontalBarRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const stats = await getCompleteDashboardStatistics(user.employee_id);
        setStatistics(stats);

        const barLabels = stats.aprobacionesPorMes.data.map(item => item.mes);
        const aprobados = stats.aprobacionesPorMes.data.map(item => item.Aprobados);
        const rechazados = stats.aprobacionesPorMes.data.map(item => item.Rechazados);
        const totalPermisos = stats.aprobacionesPorMes.data.map(item => item.Total_Permisos);

        const horizontalBarLabels = stats.aprobacionesPorTipo.data.map(item => item.Tipo);
        const cantidades = stats.aprobacionesPorTipo.data.map(item => item.Cantidad);

        setBarData({
          labels: barLabels,
          datasets: [
            {
              label: "Aprobados",
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              data: aprobados,
              stack: 'Stack 0',
            },
            {
              label: "Rechazados",
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              data: rechazados,
              stack: 'Stack 0',
            },
            {
              label: "Total Permisos",
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              data: totalPermisos,
              stack: 'Stack 1',
            },
          ],
        });

        setHorizontalBarData({
          labels: horizontalBarLabels,
          datasets: [
            {
              label: "Cantidad de permisos",
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              data: cantidades,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);  // Desactivar estado de carga
      }
    };

    fetchStatistics();
  }, [user.employee_id]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cantidad de solicitudes de permisos por Mes",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const horizontalBarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cantidad de solicitudes de permisos por Tipo",
      },
    },
    indexAxis: 'y', // Configuración para barras horizontales
  };

  return (
    <div className="mx-auto">
      <div className="mt-6">
        {loading ? (
         <LoadingIndicator />
        ) : (
          <>
            <div className="mb-6 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

              {user.role === 'Administrador' && (
                <>

                  {/* Usuarios */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiUserLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased  font-sans text-sm leading-normal font-semibold text-blue-gray-600">Usuarios</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.totalUsuarios}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to="/usuarios" className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>

                  {/* Empleados */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiGroupLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Empleados</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.totalEmpleados}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to="/empleados" className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>

                  {/* Direcciones */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiBuildingLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Direcciones</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.totalDirecciones}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to="/direcciones" className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>

                  {/* Unidades */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiTeamLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Unidades</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.totalUnidades}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to="/unidades" className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>

                  {/* Cargos */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-600 to-purple-400 text-white shadow-purple-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiBriefcaseLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Cargos</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.totalCargos}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to="/cargos" className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>

                  {/* Tipos de Permisos */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-teal-600 to-teal-400 text-white shadow-teal-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiFileList3Line className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Tipos de Permisos</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.totalTiposPermisos}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to="/permisos/tipos" className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>
                </>
              )}

              {user.role !== 'Empleado' && (
                <>
                  {/* Total de Solicitudes de Permisos */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-600 to-gray-400 text-white shadow-gray-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiFileList3Line className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Solicitudes de Permisos</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.totalSolicitudesPermisos}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to="/permisos/autorizaciones" className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>
                </>
              )}

              {/* Permisos solicitados por un empleado */}

              {user.role !== 'Administrador' && (
                <>
                  {/* Permisos Solicitados */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiFileListLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Permisos Solicitados</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.solicitudesPermisos.totalSolicitudes}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to={`/permisos/${user.employee_id}/historial`} className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>

                  {/* Permisos aprobados*/}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiCheckboxCircleLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Permisos Aprobados</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.solicitudesPermisos.totalAprobados}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to={`/permisos/${user.employee_id}/historial`} className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>

                  {/* Permisos rechazados */}
                  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-red-600 to-red-400 text-white shadow-red-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                      <RiCloseCircleLine className="w-6 h-6 text-white" />
                    </div>
                    <div className="pe-2 text-right">
                      <p className="block antialiased font-sans text-sm leading-normal font-semibold text-blue-gray-600">Permisos rechazados</p>
                      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{statistics.solicitudesPermisos.totalRechazados}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-2 flex justify-end items-center">
                      <Link to={`/permisos/${user.employee_id}/historial`} className="text-gray-500 hover:text-gray-700 text-xs">Ver más</Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {user.role !== 'Empleado' && (
              <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  {barData && <Bar ref={barRef} data={barData} options={barOptions} />}
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md">
                  {horizontalBarData && <Bar ref={horizontalBarRef} data={horizontalBarData} options={horizontalBarOptions} />}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
