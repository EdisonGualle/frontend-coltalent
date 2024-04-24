import AxiosInstance from "../axiosInstance";

const getUserConfiguration = async (user) => {
  try {
    const response = await AxiosInstance.get(`/users/${user}/configuration`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la configuración de usuario:', error);
    throw error;
  }
};

const uploadUserPhoto = async (user, photoFile) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await AxiosInstance.post(`/users/${user}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error al subir la foto de usuario:', error);
    throw error;
  }
};
export { getUserConfiguration, uploadUserPhoto };