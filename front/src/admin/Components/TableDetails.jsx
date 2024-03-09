import React, { useEffect, useState } from 'react';
import Topbar from './Topbar';
import { useParams } from 'react-router-dom';

function TableDetails({ match }) {
  const { tableName } = useParams();
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        // const tableName = match?.params?.tableName;
        console.log('Table name:', tableName);

        const response = await fetch(`/tables/${tableName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch table data');
        }
        const data = await response.json();
        console.log(tableName);
        setTableData(data);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setError(error.message);
      }
    };

    fetchTableData();
  }, [tableName]);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Topbar />
        <div className="col py-3 pt-5 p col-lg-4">
          {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
          {tableData && tableData.table && (
            <>
              <h2 className='text-dark text-uppercase'>{tableData.table}</h2>
              {tableData.records && tableData.records.map((record, index) => (
                <div key={index}>
                  {/* <h3>{index + 1}</h3> */}
                  <table className="table table-bordered">
                    <thead className='text-uppercase'>
                      <tr>
                        {Object.keys(record).map((key, index) => (
                          <th key={index}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {Object.values(record).map((value, index) => (
                          <td key={index}>{value}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableDetails;
