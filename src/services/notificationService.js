import AxiosInstance from "./axiosInstance";

// Obtener notificaciones no leídas
const getUnreadNotifications = async () => {
    try {
        const response = await AxiosInstance.get("/notifications/unread");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Marcar notificaciones como leídas
const markNotificationsAsRead = async (notificationIds) => {
    try {
        const response = await AxiosInstance.post("/notifications/read", { notification_ids: notificationIds });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getUnreadNotifications, markNotificationsAsRead };
