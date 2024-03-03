import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch verification data from the backend API
    const fetchData = async () => {
      try {
        const response = await fetch('/verify/:token');
        const data = await response.json();

        if (data.success) {
          navigate('/Dashboard');
        } else {
          console.error('Verification failed:', data.message);
        }
      } catch (error) {
        console.error('Error fetching verification data:', error);
      } finally {
        setIsLoading(false); // Set loading state to false after data fetching
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Verification Successful!</h2>
          <p>Your account has been verified. Redirecting to the dashboard...</p>
          <p>
            If you're not redirected automatically, click{' '}
            <Link to="/Dashboard">here</Link> to go to the dashboard.
          </p>
        </div>
      )}
    </div>
  );
};

export default Confirmation;
