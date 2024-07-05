const API_KEY = 'AIzaSyB9P7CpIMQ4E2n8IpFuAA7Mogayy2IEmxQ';
const SHEET_ID = '1Ln4q9Z5mH3C897R-EfoF96deX0Ki10rE4vb5tiF9xrQ';  // Replace this with your Google Sheet ID
const RANGES = {
    'Graph1': 'Sheet1!A3:B1005',
    'Graph2': 'Sheet2!A2:B980',
    'Graph3': 'Sheet3!A2:B1013'
};

let charts = {};
let clickedPoints = [];

function fetchSheetData(range, chartId) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const values = data.values;
            const labels = values.slice(1).map(row => row[0]);
            const dataPoints = values.slice(1).map(row => parseFloat(row[1]));

            createChart(labels, dataPoints, values[0][0], values[0][1], chartId);
        })
        .catch(error => console.error('Error:', error));
}

function createChart(labels, data, xAxisLabel, yAxisLabel, chartId) {
    const margin = {top: 20, right: 30, bottom: 50, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(`#${chartId}`)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
        .domain(labels)
        .range([0, width]);

    const y = d3.scaleLog()
        .domain([d3.min(data) * 0.9, d3.max(data) * 1.1])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("path")
        .datum(data.map((d, i) => ({x: labels[i], y: d})))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
        );

    svg.selectAll("circle")
        .data(data.map((d, i) => ({x: labels[i], y: d})))
        .enter()
        .append("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 4)
            .attr("fill", "steelblue")
            .on("click", function(event, d) {
                handleClick(chartId, d.x, d.y);
            });

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 5)
        .text(xAxisLabel);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height/2)
        .text(yAxisLabel);

    charts[chartId] = svg;
}

function handleClick(chartId, x, y) {
    clickedPoints.push({chartId, x, y});
    if (clickedPoints.length === 2) {
        drawLineBetweenPoints();
        clickedPoints = [];
    }
}

function drawLineBetweenPoints() {
    if (clickedPoints[0].chartId !== clickedPoints[1].chartId) {
        console.log("Points must be on the same graph");
        return;
    }

    const chartId = clickedPoints[0].chartId;
    const svg = charts[chartId];

    svg.append("line")
        .attr("x1", d3.select(svg.node().parentNode).select("g").selectAll("circle").filter(d => d.x === clickedPoints[0].x).attr("cx"))
        .attr("y1", d3.select(svg.node().parentNode).select("g").selectAll("circle").filter(d => d.x === clickedPoints[0].x).attr("cy"))
        .attr("x2", d3.select(svg.node().parentNode).select("g").selectAll("circle").filter(d => d.x === clickedPoints[1].x).attr("cx"))
        .attr("y2", d3.select(svg.node().parentNode).select("g").selectAll("circle").filter(d => d.x === clickedPoints[1].x).attr("cy"))
        .attr("stroke", "red")
        .attr("stroke-width", 2);
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Fetch data for the selected tab if it hasn't been fetched yet
    if (!charts[`chart${tabName.slice(-1)}`]) {
        fetchSheetData(RANGES[tabName], `chart${tabName.slice(-1)}`);
    }
}

// Open the default tab
document.getElementById("defaultOpen").click();