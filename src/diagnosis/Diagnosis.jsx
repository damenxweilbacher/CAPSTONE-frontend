import { useState } from 'react';
import CarSelection from './CarSelection';
import DiagnosisQuiz from './DiagnosisQuiz';
import DiagnosisResult from './DiagnosisResult';

function Diagnosis() {
  const [car, setCar] = useState(null);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1); // Track the current step explicitly

  const reset = () => {
    setCar(null);
    setResult(null);
    setStep(1);
  };

  const handleCarSelect = (selectedCar) => {
    setCar(selectedCar);
    setStep(2);
  };

  const handleDiagnosis = (diagnosis) => {
    setResult(diagnosis);
    setStep(3);
  };

  return (
    <div className="diagnosis-container">
      {step === 1 && (
        <CarSelection onSelect={handleCarSelect} />
      )}
      {step === 2 && (
        <DiagnosisQuiz car={car} onDiagnose={handleDiagnosis} />
      )}
      {step === 3 && (
        <DiagnosisResult result={result} car={car} onReset={reset} />
      )}
    </div>
  );
}

export default Diagnosis;
