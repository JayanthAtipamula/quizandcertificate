import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center"
      >
        <Brain className="w-20 h-20 mx-auto text-indigo-600 mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Take Your Data Science Quiz and Get a Certificate!
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Test your knowledge in data science and earn a certificate to showcase your expertise.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/quiz')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold 
            py-3 px-8 rounded-full text-lg 
            shadow-lg hover:shadow-xl transition-all duration-300
            relative overflow-hidden
            animate-pulse-slow
            hover:animate-none
            before:absolute before:inset-0
            before:bg-gradient-to-r before:from-white/20 before:via-white/0 before:to-white/20
            before:animate-shimmer
            after:absolute after:inset-0 
            after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent 
            after:blur-md after:opacity-0 hover:after:opacity-100
            after:transition-opacity after:duration-500"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Start Quiz
          </span>
        </motion.button>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800">10 Questions</h3>
            <p className="text-gray-600">Carefully curated</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800">Certificate</h3>
            <p className="text-gray-600">Upon completion</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800">Instant Results</h3>
            <p className="text-gray-600">Real-time feedback</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;