import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Topbar from './Topbar'; // Import Topbar component
import { Modal, Button, Form } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const adjacentPages = 2; // Number of adjacent pages to show
  const pageNumbers = [];

  // Function to add page numbers to the list
  const addPageNumbers = (start, end) => {
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
  };

  // If total pages are less than or equal to 10, display all pages
  if (totalPages <= 10) {
    addPageNumbers(1, totalPages);
  } else {
    // If current page is less than or equal to adjacentPages + 1
    if (currentPage <= adjacentPages + 1) {
      addPageNumbers(1, 1 + 2 * adjacentPages);
    } else if (currentPage >= totalPages - adjacentPages) {
      // If current page is greater than or equal to totalPages - adjacentPages
      addPageNumbers(totalPages - 2 * adjacentPages, totalPages);
    } else {
      // Otherwise, show currentPage and adjacent pages
      addPageNumbers(currentPage - adjacentPages, currentPage + adjacentPages);
    }
  }

  return (
    <nav>
      <ul className="pagination">
        {currentPage !== 1 && (
          <li className="page-item">
            <button onClick={() => paginate(currentPage - 1)} className="page-link">
              &laquo; Previous
            </button>
          </li>
        )}
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        {currentPage !== totalPages && (
          <li className="page-item">
            <button onClick={() => paginate(currentPage + 1)} className="page-link">
              Next &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

function TableDetails() {
  const { tableName } = useParams();
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState(null);
  const [editColumns, setEditColumns] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    if (tableData && tableData.records) {
      setTotalPages(Math.ceil(tableData.records.length / itemsPerPage));
    }
  }, [tableData, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData && tableData.records ? tableData.records.slice(indexOfFirstItem, indexOfLastItem) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (record) => {
    setEditedRecord(record);
    setIsEditing(true);
    // Store columns being edited
    setEditColumns(Object.keys(record));
  };

  // Get the first record in the table data and use its keys to identify the first column
  let uniqueIdentifier;
  if (tableData && tableData.records && tableData.records[0]) {
    uniqueIdentifier = Object.keys(tableData.records[0])[0] || 'id'; // Use 'id' as a fallback identifier
  }

  const handleUpdate = async () => {
    try {
      // Create conditions object with the unique identifier
      const conditions = {};
      conditions[uniqueIdentifier] = editedRecord[uniqueIdentifier];

      // Prepare updated columns object
      const updatedColumns = editColumns.reduce((acc, column) => {
        acc[column] = editedRecord[column];
        return acc;
      }, {});

      // Send the request to update the record
      const response = await fetch(`/tables/${tableName}/records`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conditions, updatedColumns }),
      });

      if (!response.ok) {
        throw new Error('Failed to update record');
      }

      const updatedData = await response.json();
      setTableData(updatedData);

      setIsEditing(false);
      setEditedRecord(null);
      setEditColumns([]);

    } catch (error) {
      console.error('Error updating record:', error);
      setError(error.message);
    }
  };


  const handleClose = () => {
    setIsEditing(false);
    setEditedRecord(null);
    setEditColumns([]);
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Topbar />
        <div className="col py-3 pt-5">
          {error && <div className="alert alert-danger">{error}</div>}
          {tableData && tableData.table && (
            <>
              <h2 className='text-dark text-uppercase'>{tableData.table}</h2>
              {isEditing && (
                <Modal show={isEditing} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Record</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      {editColumns.map((key, index) => (
                        <Form.Group key={index} controlId={`edit-${key}`}>
                          <Form.Label>{key}</Form.Label>
                          <Form.Control
                            type="text"
                            value={editedRecord[key]}
                            onChange={(e) => setEditedRecord({ ...editedRecord, [key]: e.target.value })}
                          />
                        </Form.Group>
                      ))}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                      Update
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
              {tableData.records && tableData.records.length > 0 ? (
                <div className="table table-sm" style={{ width: '100%' }}>
                  <table className="table table-bordered card-table">
                    <thead className='text-uppercase'>
                      <tr>
                        {Object.keys(tableData.records[0]).map((key, index) => (
                          <th key={index}>{key}</th>
                        ))}
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((record, index) => (
                        <tr key={index}>
                          {Object.values(record).map((value, index) => (
                            <td key={index}>{value}</td>
                          ))}
                          <td>
                            <button onClick={() => handleEdit(record)} className="btn btn-primary">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">No records found</div>
              )}
              {tableData.records && tableData.records.length > itemsPerPage && (
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableDetails;
