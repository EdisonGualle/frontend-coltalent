import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { RiMailLine } from "react-icons/ri";
import ResetPasswordService from "../../services/Auth/ResetPasswordService";
import { AlertContext } from '../../contexts/AlertContext';

const ForgetPassword = () => {
  const { showAlert } = useContext(AlertContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await ResetPasswordService.changePassword(email);
      if (response.success) {
        showAlert('Por favor revisa tu correo para restablecer tu contraseña.', 'success', 3000);
      } else {
        setError(response.msg);
      }
    } catch (error) {
      setError(error.response.data.msg);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-secondary-700 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
        <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-secondary-50 mb-8">
          Recuperar <span className="text-primary">contraseña</span>
        </h1>
        <div className="mb-2">
        {successMessage && <p className={`text-${successMessage ? 'green' : 'red'}-500`}>{successMessage}</p>}
        {error && <p className="text-red-300">{error}</p>}
        </div>
        <form className="mb-8" onSubmit={handleSubmit}>
          <div className="relative mb-5">
            <RiMailLine className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              type="email"
              className="py-3 pl-8 pr-4 bg-secondary-50 w-full outline-none rounded-lg"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className={`bg-primary text-black uppercase font-bold text-sm w-full mt-5 py-3 px-4 rounded-lg ${loading ? " opacity-95" : "hover:bg-yellow-400"}`} 
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-primary transition-colors">
            ¿Ya tienes una cuenta?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
