# Financial Graphing Website

A small website that charts the long-run history of three stock market indices, so that you can judge whether each market looks overvalued or undervalued compared with its own past performance.

Built by Aviv Silman and Almantas Pivrikas in June 2024.

## What it does

- Shows one tab each for the **S&P 500** (United States), **TOPIX** (Japan) and the **ASX 300** (Australia).
- When a tab is opened for the first time, the page fetches that index's data from a Google Sheet through the Google Sheets API (v4) and draws it as a line chart with [Chart.js](https://www.chartjs.org/).
- Each chart is loaded once and kept, so switching between tabs is instant and doesn't call the API again.
- If the API key or sheet ID is missing, or a request fails, the tab shows a message explaining why, instead of a blank chart.

`Screenshot 2024-06-21 164459.png` is a reference chart from the start of the project: the S&P 500 on a logarithmic scale, with a long-run trend line drawn against it.

## Tech stack

- HTML, CSS and vanilla JavaScript, with no build step
- Chart.js, loaded from the jsDelivr CDN
- Google Sheets API v4 as the data source

We first tried pulling prices from Yahoo Finance, then moved the data into Google Sheets so that we controlled the source and its format.

## Project structure

| File | Purpose |
| --- | --- |
| `main.html` | Page layout: header, the three tabs and a canvas for each chart |
| `script4.js` | Fetches each index's data from Google Sheets, draws the charts and switches tabs |
| `styles.css` | Page and tab styling |
| `.vscode/launch.json` | Launches Chrome against `http://localhost:8080` for debugging in VS Code |

## Running it locally

The API key and sheet ID are deliberately left blank in this repository, so you need your own before the charts will load.

1. **Prepare the Google Sheet.** Create a sheet with three tabs named `Sheet1`, `Sheet2` and `Sheet3` (S&P 500, TOPIX and ASX 300). On each tab, put a header row with the x-axis label in column A and the y-axis label in column B, followed by one row per data point (for example, a date in column A and the index value in column B). The ranges the site reads are set in `RANGES` at the top of `script4.js`:

   | Tab | Index | Range |
   | --- | --- | --- |
   | `Sheet1` | S&P 500 | `A3:B85` (header in row 3) |
   | `Sheet2` | TOPIX | `A2:B84` (header in row 2) |
   | `Sheet3` | ASX 300 | `A2:B84` (header in row 2) |

2. **Share the sheet** so that anyone with the link can view it. An API key can only read sheets that are shared this way.

3. **Create an API key.** In the [Google Cloud Console](https://console.cloud.google.com/), enable the Google Sheets API for a project and create an API key. Restrict the key to the Sheets API (and, ideally, to your site's address), because a key in front-end code is visible to anyone who opens the page.

4. **Add the key and sheet ID** to the top of `script4.js`. The sheet ID is the long string in the sheet's URL, between `/d/` and `/edit`.

   ```js
   const API_KEY = 'your-api-key';
   const SHEET_ID = 'your-sheet-id';
   ```

   Don't commit your real key.

5. **Serve the folder** and open the page:

   ```bash
   python -m http.server 8080
   ```

   Then go to `http://localhost:8080/main.html`.

## Ideas for next steps

- Draw a long-run trend line on each chart and show how far the current value sits above or below it.
- Use a logarithmic y-axis, so that growth over a century reads as a straight line.
- Move the API call behind a small server so that the key isn't exposed in the browser.

## Licence

Released under the GNU General Public License v3.0. See [LICENSE](LICENSE).
