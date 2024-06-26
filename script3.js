const API_KEY = 'api_key';
const SHEET_ID = 'your_sheet_id';  // Replace this with your Google Sheet ID
const RANGE = 'Sheet1!A3:B86';  // Adjust this to your needs

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
    const ctx = document.getElementById('myChart').getContext('2d');
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

fetchSheetData();
