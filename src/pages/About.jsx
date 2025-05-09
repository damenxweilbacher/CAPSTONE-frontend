import React from 'react';
import { Link } from 'react-router-dom';
import 'src/components/Navbar.css';

function About() {
  return (
    <div className="container">
      <h1 className = "font-bold" >About</h1>
      
      <div className="card">
        <p>
          This app was built to help firts time car owners how to diagnose simple vehicle issues. With the 4 categories, you are prompted a quiz. Your answers are then examined and a diagnosis will be given out according to your answers.
        </p>
      </div>
      
      <div className="card">
        <h2 className="disclaimer-text font-bold"> ⚠ Disclaimer ⚠</h2>
        <p>
          This app is only built to diagnose simple vehicle issues. Should you have any issues that stem deeper than the 4 listed, please reach out to a professional mechanic for further assistance.
        </p>
      </div>
      
      <div className="card">
        <h2 className=" reach-out-text font-bold">Reach Out!</h2>
        <p>
          If you have any questions or feedback on how I can improve this app, please don't be afraid to reach out!
        </p>
        <br />
          <h3> Damen Weilbacher </h3>
          <h3> Junior Software Engineer at Code School of Guam / Toyota Technician </h3>
            <br/>
            <p> "LinkedIn": 
              <a href="https://www.linkedin.com/in/damen-weilbacher-82078734a/">https://www.linkedin.com/in/damen-weilbacher-82078734a/</a> 
            </p>
            <p> "GitHub": 
              <a href="https://github.com/damenweilbacher">https://github.com/damenweilbacher</a> 
            </p>
            <p>
            "Email": 
            <a href="mailto:weilbachers74@gmail.com">weilbachers74@gmail.com</a>
            </p>
      </div>
    </div>  
  );
}

export default About;
