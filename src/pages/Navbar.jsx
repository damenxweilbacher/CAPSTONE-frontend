import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'src/components/Navbar.css';

function Navbar() {
  const location = useLocation();
  
  // check if link is active
  const isActive = (path) => location.pathname === path ? 'active' : '';
  
  return (
    <nav>
      <div>
        <div>
          <h1 className = "copyrighted name font-bold" font-family = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif">
             ADS by D.W 
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
