import React from 'react'
import './Comp.css';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <div className='container-fluid footer text-white'>
        <p className='text-center mt-3 px-5'>Forward AI+</p>
        <div className='text-center mt-3'>
          {/* <ul className="nav justify-content-center">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/features">Features</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/solutions">Solutions</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
          </ul>
          */}
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
        </div>
        <p className='text-center mt-3 px-5'>
          <Link className="btn btn-primary" to="/" role="button">Back To Top</Link>
        </p>
    </div>
  )
}

export default Footer