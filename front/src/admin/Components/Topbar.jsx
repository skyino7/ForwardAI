import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-bootstrap'; // Importing Collapse from React Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Person from '../../assets/person.jpg';
import Logout from './Logout';

function Topbar() {
    // const [dashboardOpen, setDashboardOpen] = useState(true);
    const [chartsOpen, setChartsOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [tables, setTables] = useState([]);

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        // Function to fetch user details
        const fetchUserData = async () => {
            try {
                const response = await fetch('/username', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data = await response.json();
                setUserName(data.name);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        // Function to fetch tables from the database
        const fetchTables = async () => {
            try {
                const response = await fetch('/tables');

                if (!response.ok) {
                    throw new Error('Failed to fetch tables');
                }

                const data = await response.json();
                // console.log('Tables:', data.tables);
                setTables(data || []);
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchTables();
    }, []);

    return (
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="#" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline pt-5">FORWARD AI+</span>
                </a>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <a href="/dashboard" className="nav-link align-middle px-0">
                            <i className="fa bi-house"></i>
                            <FontAwesomeIcon icon={["fa", "bars"]} />
                            <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                        </a>
                    </li>
                    {/* <li>
                        <a href="/dashboard" onClick={() => setDashboardOpen(!dashboardOpen)} className="text-white nav-link px-0 align-middle">
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
                    </li> */}
                    <li>
                        <a href="#" className="text-white nav-link px-0 align-middle">
                            <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Analysis</span>
                        </a>
                    </li>
                    <li>
                        <a href="/QueryBuilder" className="text-white nav-link px-0 align-middle">
                            <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Query Builder</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setChartsOpen(!chartsOpen)} aria-expanded={chartsOpen} className="text-white nav-link px-0 align-middle ">
                            <i className="fs-4 bi-bootstrap"></i> <span className="ms-1 d-none d-sm-inline">Charts</span>
                        </a>
                        <Collapse in={chartsOpen}>
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
                                {tables && tables.length === 0 ? (
                                    <li className="w-100">
                                        <span className="nav-link px-0">No tables found</span>
                                    </li>
                                ) : (
                                    tables.map((table, index) => (
                                        <li key={index} className="w-100">
                                            <a href={`/tables/${table}`} className="text-capitalize nav-link px-0"> <span className="d-none d-sm-inline">{table}</span></a>
                                        </li>
                                    ))
                                )}
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
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Topbar;
