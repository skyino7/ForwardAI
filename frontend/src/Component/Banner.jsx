import React from 'react';
import './Comp.css';
import dataImg from '../assets/data.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

const Banner = () => {
  return (
    <div className='banner'>
        <div className='data'>
            <h3>Forward AI+</h3>
            <h1>DATA SPEAKS</h1>
            <p>LET’S HELP YOU UNDERSTAND IT</p>
            <button><FontAwesomeIcon icon={faArrowCircleRight} /> Get Started</button>
        </div>
        <div className="analytics">
            <img src={dataImg} alt="Analytics" />
        </div>
    </div>
  )
}

export default Banner