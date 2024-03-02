import React from 'react'
import Person from '../assets/person.jpg'

const Clients = () => {
  return (
    <div className='clients'>
        <h3>What Customers Say</h3>
        <div className="clients-show">
            <div className='column-client'>
                <div className='content'>
                    <img className='person' src={Person} alt="Person" />
                    <div className="text">
                        <h4>John Doe</h4>
                        <h3>pizzadoe, accra</h3>
                        <h5>Chief executive officer</h5>
                    </div>
                </div>
                <div className='description'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
            </div>
            <div className='column-client'>
                <div className='content'>
                    <img className='person' src={Person} alt="Person" />
                    <div className="text">
                        <h4>SCOTT PARKER</h4>
                        <h3>ANALYTICA ENT.</h3>
                        <h5>Chief FINANCIAL officer</h5>
                    </div>
                </div>
                <div className='description'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
            </div>
            <div className='column-client'>
                <div className='content'>
                    <img className='person' src={Person} alt="Person" />
                    <div className="text">
                        <h4>Levi wood</h4>
                        <h3>datamine comp.</h3>
                        <h5>senior analyst</h5>
                    </div>
                </div>
                <div className='description'>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Clients