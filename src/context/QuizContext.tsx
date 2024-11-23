import React, { createContext, useContext, ReactNode, useState } from 'react';
import { quizData } from '../data/quizData';

interface QuizContextType {
  currentQuestion: number;
  score: number;
  answers: string[];
  totalQuestions: number;
  setCurrentQuestion: (index: number) => void;
  setScore: (score: number) => void;
  setAnswers: (answers: string[]) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
  };

  return (
    <QuizContext.Provider
      value={{
        currentQuestion,
        score,
        answers,
        totalQuestions: quizData.length,
        setCurrentQuestion,
        setScore,
        setAnswers,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};