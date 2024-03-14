import React, { useState } from 'react';
import Topbar from './Topbar';

function NaturalQuery() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
  <div className="container-fluid">
    <div className="row flex-nowrap">
        <Topbar/>
          <div className="container mt-4 col py-3">
            <h1>Natural Language Query</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-primary rounded mt-3" type="submit">Submit</button>
              </div>
            </form>
            {results.length > 0 && (
              <div>
                <h2>Results</h2>
                <ul className="list-group">
                  {results.map((result, index) => (
                    <li key={index} className="list-group-item">{JSON.stringify(result)}</li>
                  ))}
                </ul>
              </div>
      )}
    </div>
  </div>
  </div>
  );
}

export default NaturalQuery;
