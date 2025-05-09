import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

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
        const response = await axios.get(`${API_BASE_URL}/category/${category}/diagnoses`); 
        // sends request to backend for diagnosis
        console.log("Diagnosis data from backend:", response.data);
        
        // 4-second delay 
        setTimeout(() => {
          setDiagnosisData(response.data);
          setLoading(false);
        }, 4000); 
        
      } catch (err) {
        console.error("Error fetching diagnosis:", err);
        
        // add delay for error state
        setTimeout(() => {
          setError("Failed to load diagnosis results");
          setLoading(false);
        }, 4000);
      }
    };

    fetchDiagnosis();
  }, [category]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your diagnosis results...</p>
      </div>
    );
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  // extract name from data 
  const extractName = () => {
    if (!diagnosisData) return "Diagnosis Result";
    
    if (diagnosisData.name) return diagnosisData.name;
    if (diagnosisData.diagnosis && diagnosisData.diagnosis.name) return diagnosisData.diagnosis.name;
    if (Array.isArray(diagnosisData) && diagnosisData.length > 0 && diagnosisData[0].name) return diagnosisData[0].name;
    
    return "Diagnosis Result";
  };

  const extractDescription = () => {
    if (!diagnosisData) return "No description available";
    
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
    
    // format data to print out correctly instead of entire object
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
        <h1 className='font-bold'> Vehicle Status: {state.passedThreshold ? "Issues detected" : "No major issues detected"}</h1>
        
        {state.passedThreshold ? (
          <>
            <h2 className='font-bold'>{diagnosisName}</h2>
            <h3 className='font-bold'>{formattedDescription}</h3>
          </>  // will only display if determined that vehicle is still in good condition.
        ) : (
          <p className="mt-4">Your vehicle appears to be in good condition based on your responses.</p>
        )}
      </div>

      {state && (
        <div className="card">
          <h2 className='font-bold'>Quiz Statistics</h2>
          <p>You are receiving this result because you answered YES to {state.yesAnswers} / {state.totalQuestions} questions</p>
        </div>
      )}

      <div>
        <h2 className='font-bold'> If you need more help regarding your vehicle, please contact:</h2>
        <p> Toyota Service Guam: (671) 649-6410 </p>
        <p> BMW Service Guam: (671) 649-6410</p>
      </div>
      
      <br/> 

      <div>
        <Link to="/diagnosis">
          <button className='font-bold'>Back to Diagnosis Options</button>
        </Link>
      </div>
    </div>
  );
}

export default DiagnosisResult;
