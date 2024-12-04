import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <div className="flex items-center space-x-4 py-2">
            {/* Ícono animado */}
            <motion.div
                className="relative w-8 h-8"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <div className="absolute inset-0 w-full h-full rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
                <div className="absolute inset-0 w-full h-full animate-ping rounded-full border-4 border-indigo-300 opacity-20"></div>
            </motion.div>

            {/* Texto elegante */}
            <div>
                <p className="text-base font-semibold text-gray-700">
                    Cargando información
                </p>
                <p className="text-sm text-gray-500">
                    Por favor espere un momento...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
