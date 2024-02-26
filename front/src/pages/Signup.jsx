import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='signup'>
      <h1>Sign Up</h1>
      <form className='signup-form' action='post'>
        <label htmlFor="name">Full Name</label> <br />
        <input type="text" name="name" id="name" /> <br />
        <label htmlFor="email">Email</label> <br />
        <input type="email" name="email" id="email" /> <br />
        <label htmlFor="password">Password</label> <br />
        <input type="password" name="password" id="password" /> <br />
        <label htmlFor="confirm-password">Confirm Password</label> <br />
        <input type="password" name="confirm-password" id="confirm-password" /> <br />
        <button type="submit">Sign Up</button>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  )
}

export default Signup
