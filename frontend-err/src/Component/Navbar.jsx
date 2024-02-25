import React from 'react';
import { Link } from 'react-router-dom';
import './Comp.css';
import login from '../pages/login';

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
        <a className='end' href={login}>Sign Up</a>
    </div>
  )
}

export default navbar