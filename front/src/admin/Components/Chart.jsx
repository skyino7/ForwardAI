import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const Chart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/data');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    drawChart();
  }, [data]);

  const drawChart = () => {
    // Clear previous chart
    d3.select('#chart-container').selectAll('*').remove();

    // Define dimensions and margins
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3
      .select('#chart-container')
      .append('svg')
      .attr('width', '300px') // Use Bootstrap class to make SVG responsive
      .attr('height', '250px') // Use Bootstrap class to make SVG responsive
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`) // Use viewBox for responsiveness
      .attr('preserveAspectRatio', 'xMidYMid') // Use preserveAspectRatio for responsiveness
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.revenue)])
      .nice()
      .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Append axes to SVG
    svg
      .append('g')
      .attr('class', 'x-axis') // Add Bootstrap class for styling
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    svg.append('g').attr('class', 'y-axis').call(yAxis); // Add Bootstrap class for styling

    // Create line generator
    const line = d3
      .line()
      .x(d => x(d.month) + x.bandwidth() / 2)
      .y(d => y(d.revenue));

    // Append line to SVG
    svg
      .append('path')
      .datum(data)
      .attr('class', 'line') // Add Bootstrap class for styling
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  };

  return(
    <div className="container">
        <div className="row">
            <div className="col-sm-4">
                <h3>Revenue by Month</h3>
                <div id="chart-container"></div>
            </div>
        </div>
    </div>
  );
};

export default Chart;
