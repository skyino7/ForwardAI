import React from 'react'
import BI from '../assets/BI.jpg'
import './main.css';

const Login = () => {
  return (
    <div className='login'>
      <div className='login-form'>
        <h1>Forward AI+</h1>
        <h3>Sign In</h3>
        <form action='post'>
          <label htmlFor="username">Email</label><br />
          <input type="text" placeholder="Your Email Address" /><br />
          <label htmlFor="password">Password</label><br />
          <input type="password" placeholder="Your Password" /><br />
          <button type="submit">Login</button>
        </form>
      </div>
      <div className='login-img'>
        <img src={BI} alt="" />
      </div>
  </div>
  )
}

export default Login