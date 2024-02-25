import React from 'react'

const Login = () => {
  return (
    <>
      <h1>Login</h1>
      <form className='login-form' action='post'>
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Username" />
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default Login