import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        console.log('User Created Successfully');
      } else if (response.status === 204) {
        console.log('User Created Successfully'); // or any other success message
      } else {
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  return (
    <div className='signup'>
      <h1>Sign Up</h1>
      <form className='signup-form' onSubmit={handleSubmit}>

        <label htmlFor="name">Full Name</label> <br />
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required /> <br />

        <label htmlFor="email">Email</label> <br />
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required /> <br />

        <label htmlFor="password">Password</label> <br />
        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required /> <br />

        {/* <label htmlFor="confirmPassword">Confirm Password</label> <br />
        <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} /> <br /> */}

        console.log(name)

        <button type="submit">Sign Up</button>

        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  )
}

export default Signup
