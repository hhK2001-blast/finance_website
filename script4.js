const API_KEY = '';
const SHEET_ID = '';  // Replace this with your Google Sheet ID
const RANGES = {
    'Graph1': 'Sheet1!A3:B85',
    'Graph2': 'Sheet2!A2:B84',
    'Graph3': 'Sheet3!A2:B84'
};

// One entry per tab: undefined until the tab is first opened, then
// 'loading' while the data is fetched, then the Chart.js instance.
// This stops a tab from fetching its data and drawing a second chart
// on the same canvas every time it is clicked.
const charts = {};

function showMessage(chartId, message) {
    const canvas = document.getElementById(chartId);
    let note = canvas.parentElement.querySelector('.chart-message');
    if (!note) {
        note = document.createElement('p');
        note.className = 'chart-message';
        canvas.parentElement.insertBefore(note, canvas);
    }
    note.textContent = message;
}

function fetchSheetData(tabName, chartId) {
    if (!API_KEY || !SHEET_ID) {
        showMessage(chartId, 'Add your Google Sheets API key and sheet ID to script4.js to load this chart (see the README).');
        return;
    }

    charts[tabName] = 'loading';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGES[tabName]}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error || !data.values) {
                throw new Error(data.error ? data.error.message : 'The range returned no data.');
            }
            const values = data.values;
            const labels = values.slice(1).map(row => row[0]);
            const dataPoints = values.slice(1).map(row => parseFloat(row[1]));

            const oldNote = document.getElementById(chartId).parentElement.querySelector('.chart-message');
            if (oldNote) oldNote.remove();  // clear any error left by an earlier failed attempt
            charts[tabName] = createChart(labels, dataPoints, values[0][0], values[0][1], chartId);
        })
        .catch(error => {
            delete charts[tabName];  // allow a retry the next time the tab is opened
            console.error('Error:', error);
            showMessage(chartId, `Could not load this chart: ${error.message}`);
        });
}

function createChart(labels, data, xAxisLabel, yAxisLabel, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    return new Chart(ctx, {
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

    // Fetch data for the selected tab only if it hasn't been fetched yet
    if (!charts[tabName]) {
        fetchSheetData(tabName, `chart${tabName.slice(-1)}`);
    }
}

// Open the default tab
document.getElementById("defaultOpen").click();
