import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import AddCar from './vehicle management/AddCar';
import DeleteCar from './vehicle management/DeleteCar';
import VehicleDiagnosis from './diagnosis/VehicleDiagnosis';
import DiagnosisQuiz from './diagnosis/DiagnosisQuiz';
import DiagnosisResult from './diagnosis/DiagnosisResult';
import CategoryQuiz from './diagnosis/CategoryQuiz';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Home route */}
            <Route path="/" element={<Home />} />
            
            {/* Car management routes */}
            <Route path="/add-car" element={<AddCar />} />
            <Route path="/delete-car" element={<DeleteCar />} />
            
            {/* Diagnosis routes */}
            <Route path="/diagnosis" element={<VehicleDiagnosis />} />
            <Route path="/category/:categoryName" element={<CategoryQuiz />} />
            <Route path="/diagnosis/:category" element={<DiagnosisQuiz />} />
            
            {/* Results routes */}
            <Route path="/diagnoses/:category" element={<DiagnosisResult />} />
            
            {/* About route */}
            <Route path="/about" element={<About />} />
            
            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

