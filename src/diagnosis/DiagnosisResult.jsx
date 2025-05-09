import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function DiagnosisResult() {
  const { category } = useParams();
  const location = useLocation();
  const state = location.state;
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        console.log("Fetching diagnosis for category:", category);
        const response = await axios.get(`http://localhost:3000/category/${category}/diagnoses`); 
        // sends request to backend for diagnosis
        console.log("Diagnosis data from backend:", response.data);
        // logs data received from the backend
        setDiagnosisData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching diagnosis:", err);
        setError("Failed to load diagnosis results");
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [category]);

  if (loading) {
    return <div className="container">Loading diagnosis results...</div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  // Function to extract name from the data structure
  const extractName = () => {
    if (!diagnosisData) return "Diagnosis Result";
    
    // Try different possible paths to find the name
    if (diagnosisData.name) return diagnosisData.name;
    if (diagnosisData.diagnosis && diagnosisData.diagnosis.name) return diagnosisData.diagnosis.name;
    if (Array.isArray(diagnosisData) && diagnosisData.length > 0 && diagnosisData[0].name) return diagnosisData[0].name;
    
    // If we can't find a name, return a default
    return "Diagnosis Result";
  };

  // Function to extract description from the data structure
  const extractDescription = () => {
    if (!diagnosisData) return "No description available";
    
    // Try different possible paths to find the description
    let description;
    
    if (diagnosisData.description) {
      description = diagnosisData.description;
    } else if (diagnosisData.diagnosis && diagnosisData.diagnosis.description) {
      description = diagnosisData.diagnosis.description;
    } else if (Array.isArray(diagnosisData) && diagnosisData.length > 0 && diagnosisData[0].description) {
      description = diagnosisData[0].description;
    } else {
      return "No description available";
    }
    
    // Format the description based on its type
    if (typeof description === 'object') {
      return JSON.stringify(description, null, 2);
    } else {
      return description;
    }
  };

  const diagnosisName = extractName();
  const formattedDescription = extractDescription();

  return (
    <div className="container">    
      <div className="card">
      <h1> Vehicle Status: {state.passedThreshold ? "Issues detected" : "No major issues detected"}</h1>
      <h2>{diagnosisName}</h2>
        <h3>{formattedDescription}</h3>
      </div>

      
      {state && (
        <div className="card">
          <h2>Quiz Statistics</h2>
          <p>You are receiving this result because you answered YES to {state.yesAnswers} / {state.totalQuestions} questions</p>
        </div>
      )}
      
      <div>
        <Link to="/diagnosis">
          <button>Back to Diagnosis Options</button>
        </Link>
      </div>
    </div>
  );
}

export default DiagnosisResult;