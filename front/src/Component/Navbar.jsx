import React from 'react';
import './Comp.css';
// import Login from "./pages/Login";
import { Link } from "react-router-dom";

const navbar = () => {
  return (
    <div className='navbar'>
        <p>Forward AI+</p>
        <div className='nav-right'>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/solutions">Solutions</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </div>
        <p className='end'><Link to="/signup">Sign Up</Link></p>
    </div>
  )
}

export default navbar