import React from 'react'
import './Comp.css';

const Choose = () => {
  return (
    <div className='choose'>
        <h3>Why Choose Forward AI+?</h3>

        <div className="choose-m">
            <div className='column-choose'>
                <h3>Easy To Use</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
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

        <div className="choose-m chospac">
            <div className='column-choose'>
                <h3>Security</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className='column-choose'>
                <h3>Privacy</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className='column-choose'>
                <h3>Single Sign-On</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>

    </div>
  )
}

export default Choose