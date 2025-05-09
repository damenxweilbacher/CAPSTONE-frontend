import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

// images
const carImages = {
  // toyota 
  'Camry': 'https://www.toyota.com.sg/showroom/new-models/-/media/5cd7dc8c91314feabdf095c5924abd69.png',
  'Corolla': 'https://bucket.dealervenom.com/copeland-toyota/C430752_8X8_Front.webp?auto=compress%2Cformat&ixlib=php-3.3.1',
  'Tacoma': 'https://www.toyota.com/content/dam/toyota/upcoming-vehicles/tacoma/jellies/TAC_MY24_0032_V001_jzTzdzsEY1EiT_vA5kD0moF1R4wliwg.png',
  'Supra': 'https://www.buyatoyota.com/sharpr/config/pub/3d/toyota/1009284/1006872/Exterior/2/680_383_PNG/7438e9f64210cc26a1ddac11cec61adbba066a0e6f0472baaa9f840ef94e116d.png',
  'Tundra': 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tundra/Truck/trim_1794_Edition_86f045/color/Midnight%20Black%20Metallic-218-26%2C28%2C33-640-en_US.jpg?impolicy=downsize_bkpt&imdensity=1&w=520',
  // bmw
  '3 Series': 'https://www.bmw.co.uk/content/dam/bmw/marketGB/bmw_co_uk/bmw-cars/3-series/G80_M3_Competition_M_xDrive_Saloon_Sao_Paulo_Yellow.png',
  '5 Series': 'https://www.bmw-egypt.com/content/dam/bmw/common/all-models/5-series/sedan/2023/ice2_Titan-Bronze_810-501.png',
  'X3': 'https://imgd.aeplcdn.com/1056x594/n/uxqp0fb_1809621.jpg?q=80',
  'X5': 'https://di-uploads-pod23.dealerinspire.com/bmwofowingsmills/uploads/2023/06/TRANSPARENT_cc_2024BMS220013_01_1280_475-1-1024x768.png',
  // can add more models for flexibility. keeping basic for now to avoid confusion
};

// default images 
const manufacturerDefaultImages = {
  1: 'https://pngimg.com/d/toyota_PNG1944.png', // toyota
  2: 'https://w1.pngwing.com/pngs/126/784/png-transparent-luxury-bmw-car-bmw-m3-bmw-3-series-bmw-m5-bmw-m1-bmw-m6.png',    // bmw
  // add more manufacturers later
};

function AddCar() {
  const [car, setCar] = useState({ 
    model: '',
    year: '',
    manufacturer_id: ''
  });
  const [manufacturers] = useState([
    { id: 1, name: 'Toyota' },
    { id: 2, name: 'BMW' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [carImage, setCarImage] = useState('');
  
  // update car image when model or manufacturer changes
  useEffect(() => {
    if (car.model) {
      const modelKey = Object.keys(carImages).find(
        key => car.model.toLowerCase().includes(key.toLowerCase())
      );
      if (modelKey) {
        setCarImage(carImages[modelKey]);
      } else if (car.manufacturer_id) {
        setCarImage(manufacturerDefaultImages[car.manufacturer_id] || '');
      } else {
        setCarImage('');
      }
    } else {
      setCarImage('');
    }
  }, [car.model, car.manufacturer_id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({
      ...car,
      [name]: name === 'manufacturer_id' ? (value ? parseInt(value) : null) : value
    });
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
        manufacturer_id: car.manufacturer_id,
        image_url: carImage 
      };

      console.log("handling vehicle data to backend:", carData);

      const response = await axios.post(`${API_BASE_URL}/cars`, carData);
      console.log('information received from backend:', response.data);
      
      setCar({ model: '', year: '', manufacturer_id: '' });
      setCarImage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('error in the backend:', err.response?.data || err);
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add Your Car</h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">Car added successfully!</div>}
      
      <div className="flex flex-col md:flex-row gap-6">
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-4">
            <label htmlFor="model" className="block mb-1">Car Model:</label>
            <input
              type="text"
              id="model"
              name="model"
              value={car.model}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="year" className="block mb-1">Year:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={car.year}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="manufacturer_id" className="block mb-1">Manufacturer:</label>
            <select
              id="manufacturer_id"
              name="manufacturer_id"
              value={car.manufacturer_id || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Adding Car...' : 'Add Car'}
          </button>
        </form>
        
        <div className="flex-1 flex items-center justify-center">
          {carImage ? (
            <div className="text-center">
              <img 
                src={carImage} 
                alt={car.model} 
                className="max-w-full max-h-64 object-contain mx-auto border rounded shadow-md"
              />
              <p className="mt-2 text-sm text-gray-600">Preview image for {car.model}</p>
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded">
              <p className="text-gray-500">
                {car.model ? 
                  "No image available for this model" : 
                  "We'll try to find an image that best describes your model!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddCar;
