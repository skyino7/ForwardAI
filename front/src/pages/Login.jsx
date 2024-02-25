import React from 'react'
import BI from '../assets/BI.jpg'

const Login = () => {
  return (
    <div className='login'>
      <div>
        <h1>Login</h1>
        <form className='login-form' action='post'>
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" />
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