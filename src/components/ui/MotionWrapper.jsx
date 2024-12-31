import React from "react";
import { motion } from "framer-motion";

const MotionWrapper = ({ children, keyProp }) => {
    return (
        <motion.div
            key={keyProp}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{
                duration: 0.5,
                ease: "easeInOut",
            }}
        >
            {children}
        </motion.div>
    );
};

export default MotionWrapper;
