// Notifications.js
import React, { useEffect, useState } from 'react';
import echo from '../config/echo'; // Importa la configuración de Echo
import { useAuth } from '../hooks/useAuth';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user || !user.id) {
            console.error('Usuario no autenticado.');
            return;
        }

        const channelName = `private-notifications.${user.id}`;
        const channel = echo.private(channelName);

        console.log(`Suscrito al canal: ${channelName}`);

        channel.listen('NotificationEvent', (data) => {
            console.log('Notificación recibida:', data);
            setNotifications((prevNotifications) => [...prevNotifications, data]);
        });

        return () => {
            echo.leaveChannel(channelName);
        };
    }, [user]);

    return (
        <div>
            <h1>Notificaciones</h1>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
