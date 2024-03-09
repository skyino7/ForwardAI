import React, { useEffect, useState } from 'react';
import Topbar from './Topbar';
import { useParams } from 'react-router-dom';

function TableDetails({ match }) {
  const { tableName } = useParams();
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch(`/tables/${tableName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch table data');
        }
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setError(error.message);
      }
    };

    fetchTableData();
  }, [tableName]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData ? tableData.records.slice(indexOfFirstItem, indexOfLastItem) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Topbar />
        <div className="col py-3 pt-5 p col-lg-4">
          {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
          {tableData && tableData.table && (
            <>
              <h2 className='text-dark text-uppercase'>{tableData.table}</h2>
              {tableData.records.length === 0 ? (
                <div className="alert alert-info">No records found</div>
              ) : (
                <div className="table table-sm">
                  <table className="table table-bordered">
                    <thead className='text-uppercase'>
                      <tr>
                        {Object.keys(tableData.records[0]).map((key, index) => (
                          <th key={index}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((record, index) => (
                        <tr key={index}>
                          {Object.values(record).map((value, index) => (
                            <td key={index}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tableData.records.length > itemsPerPage && (
                <nav>
                  <ul className="pagination">
                    {Array.from({ length: Math.ceil(tableData.records.length / itemsPerPage) }, (_, i) => i + 1).map((number) => (
                      <li key={number} className="page-item">
                        <button onClick={() => paginate(number)} className="page-link">
                          {number}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableDetails;
