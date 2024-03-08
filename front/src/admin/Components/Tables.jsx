import React, { useState, useEffect } from 'react';
import Topbar from './Topbar';

function TableList() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:3000/tables');
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
        <Topbar/>
        <div class="col py-3 pt-5 p col-lg-4">
          <h2 className='text-dark'>Tables with Records</h2>
          {tables.map((table, index) => (
            <div key={index}>
              <h3>{table.table}</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    {table.records.length > 0 && Object.keys(table.records[0]).map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.records.map((record, index) => (
                    <tr key={index}>
                      {Object.values(record).map((value, index) => (
                        <td key={index}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableList;
