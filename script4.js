const API_KEY = 'AIzaSyB9P7CpIMQ4E2n8IpFuAA7Mogayy2IEmxQ';
const SHEET_ID = '1Ln4q9Z5mH3C897R-EfoF96deX0Ki10rE4vb5tiF9xrQ';  // Replace this with your Google Sheet ID
const RANGES = {
    'Graph1': 'Sheet1!A3:B85',
    'Graph2': 'Sheet2!A2:B84',
    'Graph3': 'Sheet3!A2:B84'
};

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
    new Chart(ctx, {
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
                    title: {
                        display: true,
                        text: yAxisLabel
                    },
                    beginAtZero: false
                }
            }
        }
    });
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
    if (!document.getElementById(`chart${tabName.slice(-1)}`).chart) {
        fetchSheetData(RANGES[tabName], `chart${tabName.slice(-1)}`);
    }
}

// Open the default tab
document.getElementById("defaultOpen").click();