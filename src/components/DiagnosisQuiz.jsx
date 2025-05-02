import { useState } from 'react';
import DiagnosisResult from './DiagnosisResult'; 

function DiagnosticQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalDiagnosis, setFinalDiagnosis] = useState(null);

}