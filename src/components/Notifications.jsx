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
                console.log("New notification received:", event.notification);
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
                    setNotifications(notifications.map(notification => ({
                        ...notification,
                        read_at: new Date().toISOString(),
                    })));
                })
                .catch(error => console.error("Error al marcar notificaciones como leídas:", error));
        }
    };

    return (
        <Menu
            menuButton={
                <MenuButton className="relative p-2 rounded-lg transition-colors group hover:bg-secondary-50">
                    <RiNotification3Line className="text-secondary-100 group-hover:text-black" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-0.5 right-0 bg-primary py-0.5 px-[5px] box-content text-black rounded-full text-[8px] font-bold">
                            {notifications.length}
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
                                to={`/details/${notification.data.leave_id}`}
                                className="text-gray-300 flex flex-1 items-center gap-4 py-2 px-4 hover:bg-secondary-50 transition-colors rounded-lg"
                            >
                                {notification.data.approver_photo ? (
                                    <img
                                        src={`${import.meta.env.VITE_STORAGE_URL}/${notification.data.approver_photo}`}
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
            {/* <hr className="my-4 border-gray-500 " /> */}
            {/*<MenuItem className="p-0 hover:bg-transparent flex justify-center cursor-default">
                <Link
                    to="/all-notifications"
                    className="text-sm hover:text-yellow-800 transition-colors text-back"
                >
                    Todas las notificaciones
                </Link>
            </MenuItem>*/}
        </Menu>
    );
};

export default Notifications;
