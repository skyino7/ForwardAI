import React, { useState } from 'react'
import BI from '../assets/BI.jpg'
import './main.css';
import { Navigate } from 'react-router-dom';

const Login = () => {

  const [redirect, setRedirect] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/login',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok){
        console.log('Login Successful');
        setRedirect(true);
      } else {
        console.log('Login Failed')
      }
    } catch (err) {
      console.error('Error:', err)
    }
  };

  if (redirect){
    return <Navigate to={'/dashboard'} />
  }

  return (
    <div className='login'>
      <div className='login-form'>
        <h1>Forward AI+</h1>
        <h3>Sign In</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} /><br />
          <label htmlFor="password">Password</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange}/><br />
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