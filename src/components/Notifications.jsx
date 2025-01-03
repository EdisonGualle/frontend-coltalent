// src/components/Notifications.js
import React, { useEffect, useState } from "react";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Link } from "react-router-dom";
import { RiNotification3Line, RiUser3Fill } from "react-icons/ri";
import echo from "../config/echo";
import { useAuth } from "../hooks/useAuth";
import { getUnreadNotifications, markNotificationsAsRead } from "../services/NotificationService";
import { useDispatch } from 'react-redux'; // Import useDispatch
import { fetchAssignedLeaves, updateCache, clearCache } from '../redux/Leave/assignedLeavesSlice'; // Import actions

const notificationTypeColors = {
    'Primera aprobación': 'text-blue-600',
    'Aprobación final': 'text-green-600',
    'Solicitud rechazada': 'text-red-600',
    'Solicitud para corrección': 'text-yellow-600',
    'Solicitud pendiente': 'text-amber-600',
};

const notificationTypeLabels = {
    'Primera aprobación': 'Primera aprobación',
    'Aprobación final': 'Aprobación final',
    'Rechazado': 'Solicitud rechazada',
    'Corregir': 'Solicitud para corrección',
    'Solicitud pendiente': 'Solicitud pendiente',
};

const Notifications = () => {
    const { user } = useAuth();
    const dispatch = useDispatch(); // Initialize useDispatch
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            // Obtener notificaciones no leídas
            getUnreadNotifications()
                .then(data => setNotifications(data))
                .catch(error => console.error("Error al obtener notificaciones:", error));

            // Configurar canal de Echo para recibir nuevas notificaciones en tiempo real
            const channel = echo.private(`notifications.${user.id}`);

            channel.listen('NotificationEvent', (event) => {
                setNotifications((prev) => [event.notification, ...prev]);

                // Dispatch action to update the assigned leaves
                dispatch(clearCache());
                ['pendientes', 'aprobados', 'rechazados'].forEach(filter => {
                    dispatch(fetchAssignedLeaves({ employeeId: user.employee_id, filter })).then(response => {
                        dispatch(updateCache({ filter, data: response.payload.data }));
                    });
                });
            });

            return () => {
                channel.stopListening('NotificationEvent');
                echo.leave(`notifications.${user.id}`);
            };
        }
    }, [user, dispatch]);

    // Marcar notificaciones como leídas cuando el usuario abre el menú de notificaciones
    const handleOpenMenu = () => {
        const unreadNotifications = notifications.filter(notification => !notification.read_at);
        const notificationIds = unreadNotifications.map(notification => notification.id);

        if (notificationIds.length > 0) {
            markNotificationsAsRead(notificationIds)
                .then(() => {
                    // Actualizar estado local para marcar las notificaciones como leídas
                    setNotifications(notifications.map(notification => {
                        if (notificationIds.includes(notification.id)) {
                            return { ...notification, read_at: new Date().toISOString() };
                        }
                        return notification;
                    }));
                })
                .catch(error => console.error("Error al marcar notificaciones como leídas:", error));
        }
    };

    return (
        <Menu
            menuButton={
                <MenuButton className="relative p-2 rounded-lg transition-colors group hover:bg-gray-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        className="text-gray-500 w-6 h-6 group-hover:text-gray-700"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.8 25.8 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.4 4.4 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
                            opacity=".5"
                        ></path>
                        <path
                            fill="currentColor"
                            d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
                        ></path>
                    </svg>
                    {notifications.filter(notification => !notification.read_at).length > 0 && (
                        <span className="absolute -top-0.5 right-0 bg-primary py-0.5 px-[5px] box-content text-black rounded-full text-[8px] font-bold">
                            {notifications.filter(notification => !notification.read_at).length}
                        </span>
                    )}
                </MenuButton>
            }
            align="end"
            arrow
            transition
            arrowClassName="bg-gray-300"
            menuClassName="bg-gray-300 p-4 w-72"
            onMenuChange={(e) => e.open && handleOpenMenu()}
        >
            <h1 className="text-back text-center font-medium">
                Notificaciones ({notifications.length})
            </h1>
            <hr className="my-4 border-gray-500" />
            <div className="max-h-[calc(3*100px)] overflow-y-auto custom-scrollbar-notification">
                {notifications.length === 0 ? (
                    <p className="text-center text-gray-500">¡Estás al día!</p>
                ) : (
                    notifications.map((notification, index) => (
                        <MenuItem key={index} className="p-0 hover:bg-transparent">
                            <Link
                                // to={`/details/${notification.data.leave_id}`}
                                className="text-gray-300 flex flex-1 items-center gap-4 py-2 px-4 hover:bg-secondary-50 transition-colors rounded-lg"
                            >
                                {notification.data.approver_photo || notification.data.applicant_photo ? (
                                    <img
                                        src={`${import.meta.env.VITE_STORAGE_URL}/${notification.data.approver_photo || notification.data.applicant_photo}`}
                                        className="w-8 h-8 object-cover rounded-full border border-slate-500"
                                        alt="Avatar"
                                    />
                                ) : (
                                    <div className="p-2 bg-slate-200 rounded-full border border-slate-500">
                                        <RiUser3Fill className="w-4 h-4 text-gray-500 bg-gray-200 rounded-full object-cover" />
                                    </div>
                                )}
                                <div className="text-sm flex flex-col w-full">
                                    <div className="flex justify-between w-full">
                                        <span className={notificationTypeColors[notification.type] || 'text-blue-600'}>
                                            {notificationTypeLabels[notification.type] || notification.type}
                                        </span>

                                        <span className="text-[8px] text-black text-right flex-shrink-0">
                                            {notification.created_at}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-xs break-words">
                                        {notification.data.message}
                                    </p>
                                </div>
                            </Link>
                        </MenuItem>
                    ))
                )}
            </div>
        </Menu>
    );
};

export default Notifications;
