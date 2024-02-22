import React from 'react'
import Person from '../assets/person.jpg'

const Clients = () => {
  return (
    <div className='clients'>
        <h3>What Customers Say</h3>
        <div className="choose-m">
            <div className='column-choose'>
                <img className='person' src={Person} alt="image" />
                <h4>John Doe</h4>
                <h3>pizzadoe, accra</h3>
                <h5>Chief executive officer</h5>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>
            <div className='column-choose'>
                <h3>Tailored</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className='column-choose'>
                <h3>Easy Data Integration</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>
    </div>
  )
}

export default Clients