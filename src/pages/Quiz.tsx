import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { quizData } from '../data/quizData';

const Quiz = () => {
  const navigate = useNavigate();
  const { currentQuestion, setCurrentQuestion, score, setScore, answers, setAnswers } = useQuiz();

  const handleAnswer = (selectedOption: number) => {
    const newAnswers = [...answers, quizData[currentQuestion].options[selectedOption]];
    setAnswers(newAnswers);

    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/result');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Question {currentQuestion + 1}/{quizData.length}</span>
            <span className="text-gray-600">Score: {score}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {quizData[currentQuestion].question}
            </h2>

            <div className="grid gap-4">
              {quizData[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(index)}
                  className="p-4 text-left rounded-xl border-2 border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300"
                >
                  <span className="font-medium text-gray-700">{option}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Quiz;