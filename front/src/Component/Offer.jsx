import React from 'react';
import './Comp.css';

const Offer = () => {
  return (
    <div className='offer'>
      <h3>
        What We Offer
      </h3>
      <div className="offer-m">
        <div className='column'>
          <h3>Data Analyzer</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className='column'>
          <h3>Query Builder</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className='column'>
          <h3>Business Insights</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className='column'>
          <h3>Business intelligence</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </div>
  )
}

export default Offer;