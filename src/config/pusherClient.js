import Pusher from 'pusher-js';

export function createPusherClient(userId) {
  if (!userId) {
    return null;
  }

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  });

  return pusher.subscribe(`private-notifications.${userId}`);
}
