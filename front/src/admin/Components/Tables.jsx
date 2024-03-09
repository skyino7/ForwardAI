import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from './Topbar';

function TableList() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/tables');
        if (!response.ok) {
          throw new Error('Failed to fetch tables');
        }
        const data = await response.json();
        setTables(data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Topbar />
        <div className="col py-3 pt-5 p col-lg-4">
          <h2 className='text-dark text-uppercase fw-bold pb-5'>Tables with Records</h2>
          {tables.map((table, index) => (
            <div key={index}>
              <h3 className='text-capitalize'>{table}</h3>
              <Link to={`/tables/${table}`}>View Records</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableList;
