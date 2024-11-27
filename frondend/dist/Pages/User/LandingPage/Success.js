import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
var SuccessPage = function () {
    var navigate = useNavigate();
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 text-white p-4", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: 'spring', stiffness: 100, damping: 10 }, className: "text-6xl text-green-100 mb-4", children: _jsx(FaCheckCircle, {}) }), _jsx(motion.h1, { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2, duration: 0.6 }, className: "text-3xl font-bold mb-2", children: "Booking Confirmed!" }), _jsx(motion.p, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4, duration: 0.6 }, className: "text-lg text-center max-w-md mb-8", children: "Thank you for your payment. Your transaction was completed successfully. A confirmation has been sent to your email." }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: function () { return navigate('/'); }, className: "bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg transition hover:bg-blue-50", children: "Go Back to Home" })] }));
};
export default SuccessPage;
