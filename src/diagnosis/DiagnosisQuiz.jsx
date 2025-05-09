import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function DiagnosisQuiz() {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get carId from query params or location state
  const carId = new URLSearchParams(location.search).get('car') || location.state?.carId;
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!carId) {
      setError('No car selected. Please select a car first.');
      setLoading(false);
      return;
    }

    // retrieve car details
    axios.get(`http://localhost:3000/cars/${carId}`)
      .then(response => {
        setCar(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load car details');
        setLoading(false);
        console.error(err);
      });
  }, [carId]);

  useEffect(() => {
    const selectedCategory = category;
    if (selectedCategory) {
      console.log(`Fetching prompts for category: ${selectedCategory}`);
      axios
        .get(`http://localhost:3000/category/${selectedCategory}/diagnosis_prompts`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          console.log("API Response:", res);
          console.log("Response data:", res.data);
          setPrompts(res.data);
          setAnswers({}); // reset answers when category changes
          setCurrentQuestionIndex(0); // 
        })
        .catch((err) => {
          console.error("Error fetching prompts:", err);
          console.error("Error details:", err.response || err.message);
          setError("Failed to load diagnosis questions");
        });
    }
  }, [category]);

  const handleAnswerChange = (promptId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [promptId]: answer,
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < prompts.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // if last question, submit the answers
      handleSubmit();
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const yesAnswers = Object.values(answers).filter((a) => a === "Yes").length;
    const totalQuestions = prompts.length;
    const passedThreshold = yesAnswers >= 4;

    navigate(`/diagnoses/${category}`, {
      state: {
        yesAnswers,
        totalQuestions,
        passedThreshold,
        car: car,
      }
    });
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  // get current question
  const currentPrompt = prompts[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === prompts.length - 1;
  const isAnswered = currentPrompt ? !!answers[currentPrompt.id] : false;

  return (
    <div className="p-4">
      {car && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            {car.year} {car.manufacturer?.name} {car.model}
          </h2>
          <p className="text-gray-600">Diagnosing: {category}</p>
        </div>
      )}
      
      {prompts.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-4">{category} Diagnosis</h3>
          
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / prompts.length) * 100}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Question {currentQuestionIndex + 1} of {prompts.length}</p>
          </div>
          
          {currentPrompt && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <p className="text-lg mb-4">{currentPrompt.question}</p>
              
              <div className="space-x-4 mb-4">
                {["Yes", "No"].map((option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`prompt-${currentPrompt.id}`}
                      value={option}
                      checked={answers[currentPrompt.id] === option}
                      onChange={() => handleAnswerChange(currentPrompt.id, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  {isLastQuestion ? 'Submit' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {prompts.length === 0 && !loading && (
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-4">No diagnosis questions available for this category.</p>
          <button 
            onClick={() => navigate('/diagnosis')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to Diagnosis
          </button>
        </div>
      )}
    </div>
  );
}

export default DiagnosisQuiz;
