import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';

function CategoryQuiz() {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get carId from query params
  const searchParams = new URLSearchParams(location.search);
  const carId = searchParams.get('car') || searchParams.get('carId') || location.state?.carId;
  
  const [selectedCar, setSelectedCar] = useState(carId);
  const [selectedCategory, setSelectedCategory] = useState(categoryName);
  const [prompts, setPrompts] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Fetch car details if needed
  const [car, setCar] = useState(null);
  
  useEffect(() => {
    if (selectedCar && !car) {
      axios.get(`${API_BASE_URL}/cars/${selectedCar}`)
        .then(response => {
          setCar(response.data);
        })
        .catch(err => {
          console.error("Error fetching car details:", err);
          setError("Failed to load car details");
        });
    }
  }, [selectedCar, car]);

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      console.log(`Fetching prompts for category: ${selectedCategory}`);
      axios
        .get(`${API_BASE_URL}/category/${selectedCategory}/diagnosis_prompts`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          console.log("information received from backend:", res);
          setPrompts(res.data);
          setAnswers({}); // reset answers when category changes
          setCurrentQuestionIndex(0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("error fetching prompts:", err);
          console.error("error details:", err.response || err.message);
          setError("failed to load diagnosis questions");
          setLoading(false);
        });
    }
  }, [selectedCategory]);

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

    navigate(`/diagnoses/${selectedCategory}`, {
      state: {
        yesAnswers, // calculates diagnosis and sends to backend to receive the diagnosis desc
        totalQuestions,
        passedThreshold,
        car: car,
      }
    });
  };

  if (loading) {
    return (
      <div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {error}
      </div>
    );
  }

  // get current question
  const currentPrompt = prompts[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === prompts.length - 1;
  const isAnswered = currentPrompt ? !!answers[currentPrompt.id] : false;

  return (
    <div>
      {car && (
        <div>
          <h2>{car.year} {car.model}</h2>
          <p>Diagnosing: {selectedCategory}</p>
        </div>
      )}

      {selectedCategory && prompts.length > 0 && (
        <>
          <h3 className = "font-bold">{selectedCategory} Diagnosis</h3>
          
          <div>
            <div>
              <div></div>
            </div>
            <p>Question {currentQuestionIndex + 1} of {prompts.length}</p>
          </div>
          
          {currentPrompt && (
            <div>
              <p>{currentPrompt.question}</p>
              
              <div>
                {["Yes", "No"].map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name={`prompt-${currentPrompt.id}`}
                      value={option}
                      checked={answers[currentPrompt.id] === option}
                      onChange={() => handleAnswerChange(currentPrompt.id, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              
              <div className="flex space-x-4">
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

      {selectedCategory && prompts.length === 0 && !loading && (
        <div>
          <p>No diagnosis questions available for this category.</p>
          <button onClick={() => navigate('/diagnosis')}>
            Back to Diagnosis
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryQuiz;

