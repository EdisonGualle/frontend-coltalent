
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePhone = (phone) => {
    const phoneRegex = /^[0]{10}$/;
    return phoneRegex.test(phone);
  };
  
  export const validatePassword = (password) => {
    const passwordRegex = /^.{8,}$/;
    return passwordRegex.test(password);
  };