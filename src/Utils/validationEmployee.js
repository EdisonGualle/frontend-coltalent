export function isValidName(name, fieldName) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!name) {
    return `El ${fieldName} es requerido.`;
  }
  if (!regex.test(name)) {
    return `El ${fieldName} contiene caracteres no válidos.`;
  }
  const words = name.trim().split(/\s+/);
  if (words.length > 3) {
    return `El ${fieldName} no puede tener más de tres palabras.`;
  }
  return "";
}

export function isValidDateOfBirth(dateOfBirth, minAge = 16, maxAge = 70) {
  if (!dateOfBirth) {
    return "La fecha de nacimiento es requerida.";
  }

  const date = new Date(dateOfBirth);
  const today = new Date();

  const minAgeDate = new Date();
  minAgeDate.setFullYear(today.getFullYear() - minAge);

  const maxAgeDate = new Date();
  maxAgeDate.setFullYear(today.getFullYear() - maxAge);

  if (date > today) {
    return "La fecha de nacimiento no puede ser en el futuro.";
  }

  if (date > minAgeDate) {
    return `El empleado debe tener al menos ${minAge} años.`;
  }

  if (date < maxAgeDate) {
    return `La edad máxima permitida es de ${maxAge} años.`;
  }

  return "";
}

export function isValidEthnicity(ethnicity) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
    if (ethnicity && !regex.test(ethnicity)) {
      return "La etnia contiene caracteres no válidos.";
    }
    return "";
  }
  
  export function isValidNationality(nationality) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (nationality && !regex.test(nationality)) {
      return "La nacionalidad contiene caracteres no válidos.";
    }
    return "";
  }


export function isValidGender(gender) {
    if (!gender) {
      return "El género es requerido.";
    }
    return "";
  }
  

export function isValidNumber(number) {
  if (number && (isNaN(number) || number < 0)) {
    return "No es un número válido.";
  }
  return "";
}

export function isValidProvince(province) {
  if (!province) {
    return "La provincia es requerida.";
  }
  return "";
}

export function isValidCanton(canton) {
  if (!canton) {
    return "El cantón es requerido.";
  }
  return "";
}

export function isValidParish(parish) {
  if (!parish) {
    return "La parroquia es requerida.";
  }
  return "";
}

export function isValidDirection(direction) {
  if (!direction) {
      return "La dirección es obligatoria.";
  }
  return "";
}

export function isValidUnit(unit) {
  if (!unit) {
      return "La unidad es obligatoria.";
  }
  return "";
}

export function isValidPosition(position) {
  if (!position) {
      return "El cargo es obligatorio.";
  }
  return "";
}
