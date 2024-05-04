import AxiosInstance from "../axiosInstance";

const getUsers = async () => {
  try {
    const response = await AxiosInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};



const createUser = async (newUser) => {
  try {
    const response = await AxiosInstance.post('/users', newUser);
    return response.data;
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};


const updateUser = async (updatedUser, userId) => {
  try {
    const response = await AxiosInstance.put(`/users/${userId}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};

const disableUser = async (user) => {
  try {
    const response = await AxiosInstance.put(`/users/${user}/disable`);
    return response.data.data;
  } catch (error) {
    console.error('Error al deshabilitar el usuario:', error);
    throw error;
  } 
}

const enableUser = async (user) => {
  try {
    const response = await AxiosInstance.put(`/users/${user}/enable`);
    return response.data.data;
  } catch (error) {
    console.error('Error al habilitar el usuario:', error);
    throw error;
  }
}

const deleteUser = async (user) => {
  try {
    const response = await AxiosInstance.delete(`/users/${user}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw error;
  }
}

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

export { getUsers, getUserConfiguration, uploadUserPhoto, disableUser, enableUser, deleteUser, updateUser, createUser };


