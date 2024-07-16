import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // if (config.method.toLowerCase() === 'post' || config.method.toLowerCase() === 'put' || config.method.toLowerCase() === 'delete') {
    //   try {
    //     await axios.get('https://coltalent.com/backend/public/sanctum/csrf-cookie', {
    //       withCredentials: true
    //     });
    //     const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN=')).split('=')[1];
    //     console.log('Token CSRF obtenido:', csrfToken);
    //     config.headers['X-XSRF-TOKEN'] = csrfToken;
    //   } catch (error) {
    //   }
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
