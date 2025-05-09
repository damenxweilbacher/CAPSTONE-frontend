import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  
  // edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [updatedCarData, setUpdatedCarData] = useState({
    model: '',
    year: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/cars`);
      console.log('Cars data:', response.data);
      setCars(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cars. Please try again later.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/cars/${carId}`);
      
      // update list 
      setCars(cars.filter(car => car.id !== carId));
      
      // success message
      setStatusMessage({
        message: 'Car deleted successfully!',
        type: 'success'
      });
      
      // clear success message after 3 seconds
      setTimeout(() => {
        setStatusMessage({ message: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Error deleting car:', err);
      setStatusMessage({
        message: 'Failed to delete car. Please try again.',
        type: 'error'
      });
      
      // clear error
      setTimeout(() => {
        setStatusMessage({ message: '', type: '' });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (car) => {
    console.log('edit modal:', car);
    setEditingCar(car);
    setUpdatedCarData({
      model: car.model,
      year: car.year
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCar(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCarData({
      ...updatedCarData,
      [name]: value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      console.log('updating car:', updatedCarData);
      const response = await axios.put(`http://localhost:3000/cars/${editingCar.id}`, updatedCarData);
      console.log('updated data:', response.data);
      
      // update the car in the local state
      setCars(cars.map(car => 
        car.id === editingCar.id ? {...car, ...updatedCarData} : car
      ));
      
      // success message
      setStatusMessage({
        message: 'Car updated successfully!',
        type: 'success'
      });
      
      setTimeout(() => {
        setStatusMessage({ message: '', type: '' });
      }, 3000);
      
      closeEditModal();
    } catch (err) {
      console.error('Error updating car:', err);
      setStatusMessage({
        message: 'Failed to update car. Please try again.',
        type: 'error'
      });
      
      // clear error message
      setTimeout(() => {
        setStatusMessage({ message: '', type: '' });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && cars.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your cars...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Manage Your Cars</h2>
      
      {/* car message successful/failed */}
      {statusMessage.message && (
        <div className={`mb-4 p-2 rounded ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {statusMessage.message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}
      
      {cars.length === 0 ? (
        <div className="text-center p-4 border rounded">
          <p className="mb-4">You don't have any cars yet.</p>
          <Link to="/add-car" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add a Car
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Link to="/add-car" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add Another Car
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border text-left">Image</th>
                  <th className="py-2 px-4 border text-left">Year</th>
                  <th className="py-2 px-4 border text-left">Model</th>
                  <th className="py-2 px-4 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">
                      {car.image_url ? (
                        <div className="flex items-center justify-center">
                          <img 
                            src={car.image_url} 
                            alt={car.model}
                            className="w-32 h-32 object-cover rounded"
                            style={{
                              width: '256px',
                              height: '256px',
                              objectFit: 'contain',
                              backgroundColor: '#f8f8f8'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border">{car.year}</td>
                    <td className="py-2 px-4 border">{car.model}</td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => openEditModal(car)}
                        className="bg-blue-500 text-white px-5 py-5 rounded hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        disabled={loading}
                        className="bg-red-500 text-white px-5 py-5 rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

        {/* modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl mb-4">Edit Car</h3>
            
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="model" className="block mb-1">Model:</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={updatedCarData.model}
                  onChange={handleInputChange}
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
                  value={updatedCarData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCars;
