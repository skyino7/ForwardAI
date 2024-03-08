import React from 'react';

class Logout extends React.Component {
  handleLogout = () => {
    fetch('http://localhost:5000/logout', {
      method: 'GET',
      credentials: 'include' // Ensure cookies are sent with the request
    })
    .then(response => {
      if (response.ok) {
        // If logout was successful, redirect to login page
        window.location.href = '/login';
      } else {
        // If logout failed or unexpected response received, log the error
        console.error('Logout failed:', response.statusText);
      }
    })
    .catch(error => console.error(error));
  };

  render() {
    return (
      <a className="dropdown-item" href="#" onClick={this.handleLogout}>Sign out</a>
    );
  }
}

export default Logout;
