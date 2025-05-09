import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1 className="text-center">Welcome to the Auto Diagnostics System! (ADS)</h1>
      <h2 className="text-center mb-4"> Your online solution for diagnosing car problems you may not know about :D </h2>
       
      <div className="card mt-4">
        <h2 className = "font-bold">HOW IT WORKS: </h2>
        <ol>
          <h3> 1. Add your car to our library </h3>
          <h3> 2. Select a diagnostic category that best matches you </h3>
          <h3> 3. Answer our questions to the best of your knowledge </h3>
          <h3> 4. Get your diagnosis results! </h3>
        </ol>

        <p className="mb-4">Get started by adding your car to the system! </p>
        
        <Link to="/add-car">
          <button className="button">Get Started!</button>
        </Link>
      
      </div>
    </div>
  );
}

export default Home;
