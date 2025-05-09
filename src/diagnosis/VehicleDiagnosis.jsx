import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function VehicleDiagnosis() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // when users select from array of categories , the ID is then added to the URL and sent to the backend for get requests.
  const diagnosisCategories = [
    { id: 'Engine', name: 'Engine', icon: '🔧' },
    { id: 'Tires', name: 'Tires', icon: '🛞' },
    { id: 'Battery', name: 'Battery', icon: '🔋' },
    { id: 'Fluids', name: 'Fluids', icon: '💧' }
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cars'); // retrieve all cars from backend
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to fetch your cars');
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="container text-center">
        <p>Loading your cars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          {error}
        </div>
        <Link to="/add-car">
          <button>Add a Car</button>
        </Link>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="container text-center">
        <h1>Vehicle Diagnosis</h1>
        <div className="card">
          <p>You don't have any cars yet.</p>
          <Link to="/add-car">
            <button>Add Your First Car</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className = 'font-bold'> Try find your issue with our vehicle diagnostics app! </h1>
      
      <div className="card">
        <h2>Select Your Car</h2>
        <select 
          value={selectedCar} 
          onChange={(e) => setSelectedCar(e.target.value)}
        >
          <option value="">Select a car</option>
          {cars.map(car => (
            <option key={car.id} value={car.id}>
              {car.manufacturer} {car.model} ({car.year})
            </option>
          ))}
        </select>
      </div>
      
      {selectedCar && (
        <div className="card">
          <h2>Select Diagnosis Category</h2>
          <div className="grid grid-2 mt-4">
            {diagnosisCategories.map(category => (
              <Link 
                key={category.id} 
                to={`/diagnosis/${category.id}?car=${selectedCar}`}
                className="card flex items-center gap-4"
              >
                <div className="text-center" style={{ fontSize: '2rem' }}>
                  {category.icon}
                </div>
                <div>
                  <h3>{category.name}</h3>
                  <p>Diagnose {category.name.toLowerCase()} issues</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleDiagnosis;
