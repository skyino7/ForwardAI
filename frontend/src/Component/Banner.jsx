import React from 'react';
import './Comp.css';
import dataImg from '../assets/data.png'

const Banner = () => {
  return (
    <div className='banner'>
        <div className='data'>
            <h3>Forward AI+</h3>
            <h1>DATA SPEAKS</h1>
            <p>LET’S HELP YOU UNDERSTAND IT</p>
            <button>Get Started</button>
        </div>
        <div className="analytics">
            <img src={dataImg} alt="Analytics" />
        </div>
    </div>
  )
}

export default Banner