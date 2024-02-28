import React from 'react'
import './Comp.css';
import Start from '../assets/started.png'
import { Link } from 'react-router-dom';

const Started = () => {
  return (
    <div className='started'>
        <div className='text-start'>
            <h2>GET HELP WITH OUR BUSINESS INTELLIGENCE
            <br />AND ANALYTICS TOOL </h2>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.</p>

            <p><Link to="/signup">Get Started</Link></p>
        </div>

        <div className="start-img">
            <img src={Start} alt="" height={400}/>
        </div>

    </div>
  )
}

export default Started