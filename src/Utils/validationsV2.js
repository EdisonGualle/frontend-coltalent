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
    return 'El correo electrónico es requerido.';
  }

  // Verificar si cumple con la expresión regular de correo electrónico
  if (!emailRegex.test(email)) {
    return 'Por favor, ingresa un correo electrónico válido.';
  }

  // Si pasa la validación, retornar null (sin errores)
  return null;
};

// Expresión regular para validar un nombre con letras y espacios 
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

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

// Expresión regular para validar números de teléfono fijo en Ecuador
const landlinePhoneRegex = /^(0[2-7])([0-9]{7})$/;
export const validateLandlinePhone = (phone) => {
  // Si el número de teléfono no se proporciona, considerarlo válido
  if (!phone) {
    return null;
  }

  // Verificar si cumple con la expresión regular
  if (!landlinePhoneRegex.test(phone)) {
    return 'El número de teléfono fijo no es válido.';
  }

  // Si pasa todas las validaciones, retornar null (sin errores)
  return null;
};

// Expresión regular para validar números de teléfono móvil en Ecuador
const mobilePhoneRegex = /^(?:\+593|0)9\d{8}$/;
export const validateMobilePhone = (phone) => {
  // Verificar si el número de teléfono está vacío
  if (!phone.trim()) {
    return 'El número de celular es requerido.';
  }

  // Verificar si cumple con la expresión regular
  if (!mobilePhoneRegex.test(phone)) {
    return 'El número de celular no es válido.';
  }

  // Si pasa todas las validaciones, retornar null (sin errores)
  return null;
};



export const validateLanguage = (language) => {
    
    // Lista de idiomas permitidos
const allowedLanguages = [
  "Quechua", "Ingles", "Español", "Portugues", "Ruso", "Frances", "Arabe", "Chino",
  "quechua", "ingles", "español", "portugues", "ruso", "frances", "arabe", "chino",
  "Español", "Portugués", "Francés", "Árabe",
  "español", "portugués", "francés", "árabe"
];


    // Verificar si el idioma está en la lista de idiomas permitidos
    if (!allowedLanguages.includes(language)) {
        return 'El idioma ingresado no está permitido.';
    }

    // Si pasa todas las validaciones, retornar null (sin errores)
    return null;
};

export const validateNames = (name) => {
  // Verificar si cumple con la expresión regular (solo letras y espacios)
  if (!nameRegex.test(name)) {
    return 'El nombre solo puede contener letras y espacios.';
  }

  // Si pasa todas las validaciones, retornar null (sin errores)
  return null;
};

// Expresión regular para validar la descripción
const descriptionRegex = /^[a-zA-Z\s.,;:!?'()-]+$/;

// Función para validar la descripción
export const validateDescripcion = (description) => {

  // Si pasa todas las validaciones, retornar null (sin errores)
  return null;
};
