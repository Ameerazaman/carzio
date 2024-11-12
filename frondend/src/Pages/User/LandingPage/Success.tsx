import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 text-white p-4">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        className="text-6xl text-green-100 mb-4"
      >
        <FaCheckCircle />
      </motion.div>

      {/* Success Message */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-3xl font-bold mb-2"
      >
        Booking Confirmed!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg text-center max-w-md mb-8"
      >
        Thank you for your payment. Your transaction was completed successfully. A confirmation has been sent to your email.
      </motion.p>

      {/* Go Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg transition hover:bg-blue-50"
      >
        Go Back to Home
      </motion.button>
    </div>
  );
};

export default SuccessPage;
