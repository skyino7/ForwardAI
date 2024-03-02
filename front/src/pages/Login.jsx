import React, { useState } from 'react'
import BI from '../assets/BI.jpg'
import './main.css';
import { Navigate, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();
  // const [redirect, setRedirect] = useState(false)
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
        // setRedirect(true);
        setMessage('Login Successful');
        navigate('/Dashboard')
      } else {
        setMessage('Login Failed')
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage('An error occurred during login. Please try again.');
    }
  };

  // if (redirect){
  //   return <Navigate to={'/dashboard'} />
  //   // window.location.href = '/admin/dashboard';
  // }

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
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </form>
        {message && <div className="message">{message}</div>}
      </div>
      <div className='login-img'>
        <img src={BI} alt="" />
      </div>
  </div>
  )
}

export default Login