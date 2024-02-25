import React from 'react'
import BI from '../assets/BI.jpg'
import './main.css';

const Login = () => {
  return (
    <div className='login'>
      <div>
        <h1>Forward AI+</h1>
        <h3>Sign In</h3>
        <form className='login-form' action='post'>
          <label htmlFor="username">Email</label>
          <input type="text" placeholder="Your Email Address" />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Your Password" />
          <button type="submit">Login</button>
        </form>
      </div>
      <div>
        <img src={BI} alt="" />
      </div>
    </div>
  )
}

export default Login