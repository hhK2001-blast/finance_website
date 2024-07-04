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
    const ctx = document.getElementById(chartId).getContext('2d');
    charts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: yAxisLabel,
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xAxisLabel
                    }
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: yAxisLabel
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const clickedElement = elements[0];
                    const index = clickedElement.index;
                    const value = data[index];
                    handleClick(chartId, index, value);
                }
            }
        }
    });
}

function handleClick(chartId, index, value) {
    clickedPoints.push({chartId, index, value});
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
    const chart = charts[chartId];

    chart.data.datasets.push({
        label: 'Drawn Line',
        data: [
            {x: chart.data.labels[clickedPoints[0].index], y: clickedPoints[0].value},
            {x: chart.data.labels[clickedPoints[1].index], y: clickedPoints[1].value}
        ],
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        pointRadius: 0
    });

    chart.update();
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