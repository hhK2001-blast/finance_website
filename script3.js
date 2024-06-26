const API_KEY = 'AIzaSyB9P7CpIMQ4E2n8IpFuAA7Mogayy2IEmxQ';
const SHEET_ID = '1Ln4q9Z5mH3C897R-EfoF96deX0Ki10rE4vb5tiF9xrQ';
const RANGE = 'Sheet1!A3:B86';  // Adjust this to your needs

function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const values = data.values;
            let output = '<table>';
            values.forEach(row => {
                output += '<tr>';
                row.forEach(cell => {
                    output += `<td>${cell}</td>`;
                });
                output += '</tr>';
            });
            output += '</table>';
            document.getElementById('output').innerHTML = output;
        })
        .catch(error => console.error('Error:', error));
}

function graphData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const values = data.values;
            const dates = values.map(row => row[0]);
            const prices = values.map(row => parseFloat(row[1]));

            const chartData = {
                labels: dates,
                datasets: [{
                    label: 'Price',
                    data: prices,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            };

            const chartOptions = {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price'
                        }
                    }
                }
            };

            const ctx = document.getElementById('chart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions
            });
        })
        .catch(error => console.error('Error:', error));
}

graphData();