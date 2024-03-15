import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

const Signup = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
      console.log(responseData.message);

      // Redirect to a verification pending page
      // window.location.href = '/VerificationPending';
      window.location.href = '/login';
      } else if (response.status === 204) {
        console.log('Waiting for Verification');
      } else {
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  return (
    <>
      <Navbar/>
      <div className='signup'>
        <h1>Forward AI+</h1>
        <h3>Register</h3>
        <form className='signup-form' onSubmit={handleSubmit}>

          <label htmlFor="name">Full Name</label> <br />
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required /> <br />

          <label htmlFor="email">Email</label> <br />
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required /> <br />

          <label htmlFor="password">Password</label> <br />
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required /> <br />

          <button type="submit">Sign Up</button>

          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default Signup
