import React from 'react';
import './Comp.css';
// import Login from './pages/login';
// import { Link } from "react-router-dom";

const navbar = () => {
  return (
    <div className='navbar'>
        <p>Forward AI+</p>
        <div className='nav-right'>
            <a href='#'>Home</a>
            <a href='#'>About</a>
            <a href='#'>Features</a>
            <a href='#'>Solutions</a>
            <a href='#'>Contact</a>
        </div>
        <a className='end' href="./pages/login">Sign Up</a>
        {/* <Link to="./pages/login" /> */}
    </div>
  )
}

export default navbar