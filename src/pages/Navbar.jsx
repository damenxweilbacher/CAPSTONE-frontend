import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'src/components/Navbar.css';

function Navbar() {
  const location = useLocation();
  
  // Function to check if a link is active
  const isActive = (path) => location.pathname === path ? 'active' : '';
  
  return (
    <nav>
      <div>
        <div>
          <h1>
             ADS by D.W 2025©
          </h1>
        </div>
        <div>
          <Link to="/" className={isActive('/')}>
            Home
          </Link>
          <Link to="/add-car" className={isActive('/add-car')}>
            Add Car
          </Link>
          <Link to="/delete-car" className={isActive('/delete-car')}>
            Manage Cars
          </Link>
          <Link to="/diagnosis" className={isActive('/diagnosis')}>
            Vehicle Diagnosis
          </Link>
          <Link to="/about" className={isActive('/about')}>
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
