import * as d3 from 'd3';

// Import d3.js library

// Define the URL for the data from Yahoo Finance
const url = 'https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?range=1y';

// Fetch the data from Yahoo Finance
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Extract the closing prices from the data
        const closingPrices = data.chart.result[0].indicators.quote[0].close;

        // Format the date values
        const dates = data.chart.result[0].timestamp.map(timestamp => new Date(timestamp * 1000));

        // Create the SVG container
        const svg = d3.select('body')
            .append('svg')
            .attr('width', 800)
            .attr('height', 400);

        // Define the scales for x and y axes
        const xScale = d3.scaleTime()
            .domain(d3.extent(dates))
            .range([0, 800]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(closingPrices), d3.max(closingPrices)])
            .range([400, 0]);

        // Define the line generator
        const line = d3.line()
            .x((d, i) => xScale(dates[i]))
            .y(d => yScale(d));

        // Append the line to the SVG container
        svg.append('path')
            .datum(closingPrices)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);
    })
    .catch(error => {
        console.error('Error:', error);
    });