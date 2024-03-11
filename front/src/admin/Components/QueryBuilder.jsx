import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Topbar from './Topbar';

const TableItem = ({ table, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TABLE',
    item: { table },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'TABLE',
    drop: (item) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`draggable-table ${isOver ? 'is-over' : ''}`}
    >
      <div
        ref={drag}
        className={`table-item ${isDragging ? 'is-dragging' : ''}`}
      >
        {table}
      </div>
    </div>
  );
};

const QueryBuilder = () => {
  const [tables, setTables] = useState([]);
  const [query, setQuery] = useState('');
  const [droppedItems, setDroppedItems] = useState([]);
  const [records, setRecords] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [searchRule, setSearchRule] = useState('');
  const [groupRule, setGroupRule] = useState('');

  useEffect(() => {
    fetch('/tables')
      .then(response => response.json())
      .then(data => {
        setTables(data);
      })
      .catch(error => {
        console.error('Error fetching tables:', error);
      });
  }, []);

  const handleRunQuery = () => {
    if (!query.trim()) {
      setError('Query cannot be empty');
      return;
    }

    // Check if the query contains only the table name
    const trimmedQuery = query.trim();
    const tableNames = tables.map(table => table.toLowerCase());
    if (tableNames.includes(trimmedQuery.toLowerCase())) {
      // Query contains only the table name, so fetch all records for that table
      fetch(`/records/${trimmedQuery}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
            setRecords([]);
            setColumns([]);
          } else {
            setError('');
            setRecords(data.records);
            setColumns(Object.keys(data.records[0]));
          }
        })
        .catch(error => {
          console.error('Error fetching records:', error);
        });
    } else {
      // Concatenate search rule and group rule with the query
      const fullQuery = `${query} ${searchRule} ${groupRule}`.trim();
      console.log('Full query:', fullQuery);

      fetch('/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: fullQuery }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            if (data.error === 'Query not found') {
              setError('Query not found');
            } else if (data.error === 'Query syntax error') {
              setError('Query syntax error. Please check your query and try again.');
            } else {
              setError(data.error);
            }
            setRecords([]);
            setColumns([]);
          } else {
            setError('');
            setRecords(data.records);
            setColumns(Object.keys(data.records[0]));
          }
        })
        .catch(error => {
          console.error('Error fetching records:', error);
        });
    }
  };


  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleDropItem = (item) => {
    const updatedQuery = query + item.table + ' ';
    setQuery(updatedQuery);
    setDroppedItems(prevItems => [...prevItems, item]);
  };

  const handleSearchRuleChange = (e) => {
    setSearchRule(e.target.value);
  };

  const handleGroupRuleChange = (e) => {
    setGroupRule(e.target.value);
  };

  // Get current records
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container-fluid">
        <div className="row flex-nowrap">
        <Topbar/>
      <div className='col py-3 px-5 pt-5 p col-lg-10 my-5'>
        <h1 className='mb-4'>Query Builder</h1>
        <h3 className='mb-4 shadow-sm p-3 mb-5 bg-body rounded'>Tables In the Database</h3>
        <div className="row mb-4">
          {tables.map(table => (
            <div key={table} className="col-lg-3 col-md-4 text-capitalize">
              <TableItem table={table} onDrop={handleDropItem} />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <textarea
            value={query}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter your query here"
            rows={4}
          />
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="searchRule">Search Rule:</label>
          <input
            type="text"
            id="searchRule"
            value={searchRule}
            onChange={handleSearchRuleChange}
            className="form-control"
            placeholder="Enter search rule"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="groupRule">Group Rule:</label>
          <input
            type="text"
            id="groupRule"
            value={groupRule}
            onChange={handleGroupRuleChange}
            className="form-control"
            placeholder="Enter group rule"
          />
        </div>
        <div className="mb-4">
          <button onClick={handleRunQuery} className="btn btn-primary">Run Query</button>
        </div>
        <div>
          <h2 className='text-dark mb-3'>Records</h2>
          {records.length === 0 && <p>No records found</p>}
          {records.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <tr key={index}>
                    {columns.map(column => (
                      <td key={column}>{record[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <h2 className='text-dark mb-3'>Dropped Items</h2>
          {droppedItems.map((item, index) => (
            <div key={index} className="bg-light p-2 mb-2">{item.table}</div>
          ))}
        </div>
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {[...Array(Math.ceil(records.length / recordsPerPage)).keys()].map(number => (
              <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(number + 1)} className="page-link">{number + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </div>
      </div>
    </DndProvider>
  );
}

export default QueryBuilder;
