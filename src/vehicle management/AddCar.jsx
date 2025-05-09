import React, { useState } from 'react';
import axios from 'axios';

function AddCar() {
  const [car, setCar] = useState({ 
    model: '',
    year: '',
    manufacturer_id: ''
  }); // set input fields as blank
  const [manufacturers] = useState([
    { id: 1, name: 'Toyota' },
    { id: 2, name: 'BMW' }
  ]);  // when selecting manufacturer, id is sent to backend rather than name.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({
      ...car,
      [name]: name === 'manufacturer_id' ? (value ? parseInt(value) : null) : value
    });
    console.log('Form data:', car);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!car.manufacturer_id) {
        throw new Error("Please select a manufacturer");
      }

      const carData = {
        model: car.model.trim(),
        year: car.year.trim(),
        manufacturer_id: car.manufacturer_id
      };

      console.log("handling vehicle data to backend:", carData);

      const response = await axios.post("http://localhost:3000/cars", carData);
      console.log('API Response:', response.data);
      
      setCar({ model: '', year: '', manufacturer_id: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('API Error:', err.response?.data || err);
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Add Your Car</h2>
      
      {error && <div>{error}</div>}
      {success && <div>Car added successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="model">Car Model:</label>
          <input
            type="text"
            id="model"
            name="model"
            value={car.model}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={car.year}
            onChange={handleChange}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>
        
        <div>
          <label htmlFor="manufacturer_id">Manufacturer:</label>
          <select
            id="manufacturer_id"
            name="manufacturer_id"
            value={car.manufacturer_id || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Adding Car...' : 'Add Car'}
        </button>
      </form>
    </div>
  );
}

export default AddCar;
