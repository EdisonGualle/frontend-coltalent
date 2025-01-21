// src/config/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const token = localStorage.getItem('token');

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'b94aee3806b7858f02be',
    cluster: 'sa1',
    forceTLS: true,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                fetch('http://localhost:8000/broadcasting/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name,
                    }),
                })
                    .then((response) => {
                        if (response.status !== 200) {
                            throw new Error('Authorization failed');
                        }
                        return response.json();
                    })
                    .then((data) => {
                        callback(false, data);
                    })
                    .catch((error) => {
                        console.error('Authorization error:', error);
                        callback(true, null);
                    });
            },
        };
    },
});


export default echo;