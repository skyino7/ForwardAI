import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-bootstrap'; // Importing Collapse from React Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Person from '../../assets/person.jpg'
import Logout from './Logout';

function Topbar() {
    const [dashboardOpen, setDashboardOpen] = useState(true);
    const [bootstrapOpen, setBootstrapOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [userName, setUserName] = useState('');

    const logout = () => {
        console.log('Logging out...');
        window.location.href = '/login';
    };

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

    useEffect(() => {
        // Function to fetch user details
        const Username = async () => {
            try {
                const response = await fetch('/username', { // Adjust the URL to your API endpoint
                    method: 'GET',
                    credentials: 'include', // Include cookies if your authentication relies on them
                    headers: {
                        'Content-Type': 'application/json',
                        // Include any necessary headers, such as authentication tokens
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data = await response.json();
                setUserName(data.name); // Assuming the response contains a "name" field
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        Username();
    }, []);

    return (
      <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                  <span className="fs-5 d-none d-sm-inline pt-5">FORWARD AI+</span>
              </a>
              <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                  <li className="nav-item">
                      <a href="#" className="nav-link align-middle px-0">
                          <i className="fas-4 bi-house"></i>
                          <FontAwesomeIcon icon={["fas", "bars"]} />
                          <span className="ms-1 d-none d-sm-inline">Home</span>
                      </a>
                  </li>
                  <li>
                      <a href="#" onClick={() => setDashboardOpen(!dashboardOpen)} className="text-white nav-link px-0 align-middle">
                          <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                      </a>
                      <Collapse in={dashboardOpen}>
                          <ul className="collapse show nav flex-column ms-1" id="submenu1">
                              <li className="w-100">
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 1 </a>
                              </li>
                              <li>
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2 </a>
                              </li>
                          </ul>
                      </Collapse>
                  </li>
                  <li>
                      <a href="#" className="text-white nav-link px-0 align-middle">
                          <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Analysis</span>
                      </a>
                  </li>
                  <li>
                      <a href="#" onClick={() => setBootstrapOpen(!bootstrapOpen)} aria-expanded={bootstrapOpen} className="text-white nav-link px-0 align-middle ">
                          <i className="fs-4 bi-bootstrap"></i> <span className="ms-1 d-none d-sm-inline">Charts</span>
                      </a>
                      <Collapse in={bootstrapOpen}>
                          <ul className="collapse nav flex-column ms-1" id="submenu2">
                              <li className="w-100">
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 1</a>
                              </li>
                              <li>
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2</a>
                              </li>
                          </ul>
                      </Collapse>
                  </li>
                  <li>
                      <a href="#" onClick={() => setProductsOpen(!productsOpen)} className="text-white nav-link px-0 align-middle">
                          <i className="fs-4 bi-grid"></i> <span className="ms-1 d-none d-sm-inline">Tables</span>
                      </a>
                      <Collapse in={productsOpen}>
                          <ul className="collapse nav flex-column ms-1" id="submenu3">
                              <li className="w-100">
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 1</a>
                              </li>
                              <li>
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 2</a>
                              </li>
                              <li>
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 3</a>
                              </li>
                              <li>
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 4</a>
                              </li>
                          </ul>
                      </Collapse>
                  </li>
                  <li>
                      <a href="#" className="text-white nav-link px-0 align-middle">
                          <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Database</span>
                      </a>
                  </li>
              </ul>
              <hr />
              <div className="dropdown pb-4">
                  <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={Person} alt="hugenerd" width="30" height="30" className="rounded-circle" />
                      <span className="d-none d-sm-inline mx-1">{userName}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                      <li><a className="dropdown-item" href="#">New project...</a></li>
                      <li><a className="dropdown-item" href="#">Settings</a></li>
                      <li><a className="dropdown-item" href="#">Profile</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" href="#" id='logoutButton' onClick={logout}>Sign out</a></li>
                      {/* <Logout/> */}
                  </ul>
              </div>
          </div>
      </div>
    );
}

export default Topbar;
