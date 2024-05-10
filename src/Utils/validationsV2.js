// Expresión regular para validar solo letras, números y un punto
const usernameRegex = /^[a-zA-Z0-9]+([.]?[a-zA-Z0-9]+)*$/;

export const validateUsername = (username) => {
  // Verificar si el nombre de usuario está vacío
  if (!username.trim()) {
    return 'Por favor, ingresa un nombre de usuario.';
  }

  // Verificar la longitud mínima y máxima
  if (username.length < 4 || username.length > 20) {
    return 'El nombre de usuario debe tener entre 4 y 20 caracteres.';
  }

  // Verificar si cumple con la expresión regular (solo letras, números y un punto)
  if (!usernameRegex.test(username)) {
    return 'El nombre de usuario solo puede contener letras, números y un punto.';
  }

  // Si pasa todas las validaciones, retornar null (sin errores)
  return null;
};


// Expresión regular para validar un correo electrónico
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  // Verificar si el correo electrónico está vacío
  if (!email.trim()) {
    return 'Por favor, ingresa un correo electrónico.';
  }

  // Verificar si cumple con la expresión regular de correo electrónico
  if (!emailRegex.test(email)) {
    return 'Por favor, ingresa un correo electrónico válido.';
  }

  // Si pasa la validación, retornar null (sin errores)
  return null;
};


// Expresión regular para validar solo letras y espacios
const nameRegex = /^[a-zA-Z\s]+$/;

export const validateName = (name) => {
  // Verificar si el nombre está vacío
  if (!name.trim()) {
    return 'Por favor, ingresa un nombre.';
  }

  // Verificar si cumple con la expresión regular (solo letras y espacios)
  if (!nameRegex.test(name)) {
    return 'El nombre solo puede contener letras y espacios.';
  }

  // Si pasa todas las validaciones, retornar null (sin errores)
  return null;
};