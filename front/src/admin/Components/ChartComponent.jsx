import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3';

const ChartComponent = () => {
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchColumns = async (table) => {
    try {
      const response = await fetch(`/api/columns/${table}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error(`Error fetching columns for table ${table}:`, error);
    }
  };

  useEffect(() => {
    // fetchData(); // Call fetchData initially when the component mounts
  }, []); // Empty dependency array to trigger the effect only once

  useEffect(() => {
    if (chartData.length > 0) {
      createChart(); // Call createChart when chartData changes
    } else {
      console.log('No data available to create chart.');
    }
  }, [chartData, selectedColumn]); // Dependency on chartData

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/data/${selectedTable}/${selectedColumn}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setChartData(data);
      console.log('Chart data:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createChart = () => {
    if (!chartData || chartData.length === 0) {
      console.log('No data available to create chart.');
      return;
    }

    // Clear previous chart
    d3.select('#chart-container').selectAll('*').remove();

    // Define dimensions and margins
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Sort chartData by selectedColumn
    const sortedChartData = chartData.filter(data => data && data[selectedColumn] !== null && data[selectedColumn] !== undefined);
    sortedChartData.sort((a, b) => a[selectedColumn] - b[selectedColumn]);

    // Create SVG container
    const svg = d3
      .select('#chart-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleLinear()
      .domain(d3.extent(sortedChartData, d => d[selectedColumn]))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(sortedChartData, d => d[selectedColumn])])
      .nice()
      .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Append axes to SVG
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    svg.append('g').attr('class', 'y-axis').call(yAxis);

    // Create line generator
    const line = d3
      .line()
      .x(d => x(d[selectedColumn]))
      .y(d => y(d[selectedColumn]));

    // Append line to SVG
    svg
      .append('path')
      .datum(sortedChartData)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  };


  const handleTableChange = (event) => {
    const selectedTable = event.target.value;
    setSelectedTable(selectedTable);
    fetchColumns(selectedTable);
  };

  const handleColumnChange = (event) => {
    const selectedColumn = event.target.value;
    setSelectedColumn(selectedColumn);
  };

  const handleCreateChart = () => {
    fetchData();
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="tableSelect">Select a table:</label>
            <select className="form-control" id="tableSelect" value={selectedTable} onChange={handleTableChange}>
              <option value="">Select a table</option>
              {tables.map(table => (
                <option key={table} value={table}>{table}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="columnSelect">Select a column:</label>
            <select className="form-control" id="columnSelect" value={selectedColumn} onChange={handleColumnChange}>
              <option value="">Select a column</option>
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleCreateChart}>Create Chart</button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <div id="chart-container"></div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
