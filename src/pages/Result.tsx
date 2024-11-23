import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { Download, Trophy } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Confetti from 'react-confetti';
import { ChangeEvent, FormEvent } from 'react';

interface UserDetails {
  name: string;
  phone: string;
  email: string;
}

const Result = () => {
  const navigate = useNavigate();
  const { score, resetQuiz, totalQuestions } = useQuiz();
  const [showForm, setShowForm] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    phone: '',
    email: '',
  });
  const certificateRef = useRef<HTMLDivElement>(null);
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${userDetails.name.replace(/\s+/g, '_')}_certificate.pdf`);
    
    resetQuiz();
    navigate('/');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleDownload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 md:p-8">
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={true}
          numberOfPieces={200}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-4xl w-full mx-auto"
      >
        {!showForm ? (
          <div className="text-center">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto text-yellow-500 mb-4 md:mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              Congratulations! You've Passed the Quiz 🎉
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 md:mb-8">
              You scored {score} out of {totalQuestions}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Your Certificate
            </motion.button>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                Enter Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userDetails.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={userDetails.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">Email</label>
                  <input
                    type="email"
                    required
                    value={userDetails.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download Certificate
                </button>
              </div>
            </form>

            <div 
              ref={certificateRef} 
              className="bg-[url('https://images.unsplash.com/photo-1606166325683-e6deb697d301?ixlib=rb-4.0.3')] bg-cover bg-center p-4 sm:p-8 md:p-16 rounded-xl"
            >
              <div className="bg-white/90 p-4 sm:p-6 md:p-8 rounded-lg backdrop-blur-sm">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 sm:mb-6 md:mb-8">
                  Certificate of Completion
                </h2>
                <p className="text-lg sm:text-xl text-center text-gray-700 mb-2 sm:mb-4">
                  This is to certify that
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-indigo-600 mb-2 sm:mb-4">
                  {userDetails.name || '[Your Name]'}
                </p>
                <p className="text-base sm:text-lg md:text-xl text-center text-gray-700 mb-4 sm:mb-6 md:mb-8">
                  has successfully completed the Data Science Quiz
                  with a score of {score} out of {totalQuestions}
                </p>
                <div className="text-center text-gray-600 text-sm sm:text-base">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Result;