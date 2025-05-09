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
import { CarsFooter } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col">
        <Navbar />
        <div className="content flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-car" element={<AddCar />} />
            <Route path="/delete-car" element={<DeleteCar />} />
            <Route path="/diagnosis" element={<VehicleDiagnosis />} />
            <Route path="/category/:categoryName" element={<CategoryQuiz />} />
            <Route path="/diagnosis/:category" element={<DiagnosisQuiz />} />
            <Route path="/diagnoses/:category" element={<DiagnosisResult />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <CarsFooter />
      </div>
    </Router>
  );
}

export default App;

