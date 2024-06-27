const API_KEY = 'AIzaSyB9P7CpIMQ4E2n8IpFuAA7Mogayy2IEmxQ';
const SHEET_ID = '1Ln4q9Z5mH3C897R-EfoF96deX0Ki10rE4vb5tiF9xrQ';  // Replace this with your Google Sheet ID
const RANGE = 'Sheet1!A3:B85';  // Adjust this to your needs

function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const values = data.values;
            const labels = values.slice(1).map(row => row[0]);
            const dataPoints = values.slice(1).map(row => parseFloat(row[1]));

            createChart(labels, dataPoints, values[0][0], values[0][1]);
        })
        .catch(error => console.error('Error:', error));
}

function createChart(labels, data, xAxisLabel, yAxisLabel) {
    const ctx = document.getElementById('myChart1').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'S&P 500 Index over last 4 months',
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
                        text: 'time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'S&P 500 Index'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

fetchSheetData();
