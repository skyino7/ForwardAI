import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='signup'>
      <h1>Sign Up</h1>
      <form className='signup-form' action='post'>
        <label htmlFor="name">Full Name</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input type="password" name="confirm-password" id="confirm-password" />
        <button type="submit">Sign Up</button>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  )
}

export default Signup