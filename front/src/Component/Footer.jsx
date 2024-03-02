import React from 'react'
import './Comp.css';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className='footer'>
        <p>Forward AI+</p>
        <div className='center'>
          {/* <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/solutions">Solutions</Link></li>
          <li><Link to="/contact">Contact</Link></li> */}
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
        </div>
        <p className='back-to-top'><Link to="/">Back To Top</Link></p>
    </div>
  )
}

export default Footer