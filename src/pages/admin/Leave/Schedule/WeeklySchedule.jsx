import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEmployeeSchedule } from "../../../../redux/Calendar/weeklyScheduleSlince.js";
import LoadingIndicator from "../../../../components/ui/LoadingIndicator";
import { FaSun, FaSignOutAlt, FaCoffee } from "react-icons/fa";
import { CardHeader, Typography } from "@material-tailwind/react";

const WeeklySchedule = () => {
    const dispatch = useDispatch();
    const { weeklySchedule, fetchStatus, hasFetchedAll } = useSelector(
        (state) => state.weeklySchedule
    );
    const { id: employee_id } = useParams();

    // Obtener el día actual en español (Lunes, Martes, etc.)
    const today = new Date()
        .toLocaleDateString("es-ES", { weekday: "long" })
        .replace(/^\w/, (c) => c.toUpperCase()); // Capitalizar la primera letra

    useEffect(() => {
        if (!hasFetchedAll) {
            dispatch(fetchEmployeeSchedule(employee_id));
        }
    }, [dispatch, hasFetchedAll, employee_id]);

    if (fetchStatus === "loading") {
        return <LoadingIndicator />;
    }

    if (fetchStatus === "failed") {
        return <div className="text-red-500">Error al cargar el horario semanal</div>;
    }

    if (!weeklySchedule || !Array.isArray(weeklySchedule.data) || weeklySchedule.data.length === 0) {
        return <div className="text-gray-500">No hay datos disponibles para este empleado.</div>;
    }

    return (
        <div className="m-3">
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0 mx-0 bg-gray-100">
                <div className="mb-2 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray" className="font-semibold">
                            Horario semanal
                        </Typography>
                    </div>
                </div>
            </CardHeader>
            <div className="grid grid-cols-1 gap-4">
                {weeklySchedule.data.map((schedule) => (
                    <div
                        key={schedule.date}
                        className={`rounded-lg p-4 ${
                            schedule.day_name === today
                                ? "bg-white border border-blue-200 shadow-sm"
                                : "bg-white border-gray-200"
                        }`}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span
                                className={`text-lg font-bold ${
                                    schedule.day_name === today ? "text-blue-600" : "text-gray-700"
                                }`}
                            >
                                {schedule.day_name}
                            </span>
                        </div>
                        {schedule.type === "work_day" ? (
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 bg-green-50 p-2 rounded-md">
                                    <FaSun className="text-green-600" />
                                    <div>
                                        <p className="text-xs text-green-800">Entrada</p>
                                        <p className="text-sm font-semibold text-green-600">
                                            {schedule.work_schedule.start_time}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-red-50 p-2 rounded-md">
                                    <FaSignOutAlt className="text-red-600" />
                                    <div>
                                        <p className="text-xs text-red-800">Salida</p>
                                        <p className="text-sm font-semibold text-red-600">
                                            {schedule.work_schedule.end_time}
                                        </p>
                                    </div>
                                </div>
                                {schedule.work_schedule.break_start_time &&
                                    schedule.work_schedule.break_end_time && (
                                        <div className="flex items-center gap-2 bg-orange-50 p-2 rounded-md">
                                            <FaCoffee className="text-orange-600" />
                                            <div>
                                                <p className="text-xs text-orange-800">Descanso</p>
                                                <p className="text-sm font-semibold text-orange-600">
                                                    {schedule.work_schedule.break_start_time} -{" "}
                                                    {schedule.work_schedule.break_end_time}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">Día de descanso</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklySchedule;
