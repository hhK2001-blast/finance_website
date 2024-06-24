const ctx = document.getElementById('stockChart').getContext('2d');
let chart;

// Function to create or update the chart
function updateChart(labels, data) {
    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stock Price',
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
}

// Function to generate dummy data
function generateDummyData() {
    const labels = [];
    const data = [];
    const now = new Date();
    for (let i = 0; i < 10; i++) {
        const date = new Date(now.getTime() - (9 - i) * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString());
        data.push(Math.random() * 100 + 100); // Random price between 100 and 200
    }
    return { labels, data };
}

// Function to update with dummy data
function updateWithDummyData() {
    const { labels, data } = generateDummyData();
    updateChart(labels, data);
}

// Update with dummy data initially and then every 5 seconds
updateWithDummyData();
setInterval(updateWithDummyData, 5000);