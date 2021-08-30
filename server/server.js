// import dependencies and initialize express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');


const { DateTime } = require("luxon");

require('dotenv').config();

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_API_KEY= process.env.GOOGLE_API_KEY;

const healthRoutes = require('./routes/health-route');

const app = express();

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "webapp", "build")));

// routes and api calls
app.use('/health', healthRoutes);

// // default path to serve up index.html (single page application)
// app.all('', (req, res) => {
//   res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'));
// });

app.get('/api/dashboard', async function (req, res) {
  await Promise.all([getProgress('US', 4, 3, 'M/d/yyyy', 'UTC-6'), getProgress('Australia', 3, 4, 'd/M/yyyy', 'UTC+10')])
        .then(results => {
            let progress = {...results[0], ...results[1]};
            res.send(progress)
        })
        .catch(err => {
            console.error("Internal server error: ", err)
            // render some error page here
            res.sendStatus(500);
        });
});


function getProgress(region, distanceKmCol, distanceMilesCol, dateFormat, timezone) {
    function getNumber(v) {
        if (v.trim() !== "") {
            let number = parseFloat(v);
            if (isNaN(number)) {
                return 0;
            }
            return number;
        }
        return 0;
    }

    return axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${region}!A2:J5000?key=${GOOGLE_API_KEY}`)
        .then(response => {
            let individual = {};
            let totalTime = 0;
            let totalDistance_km = 0;
            let totalDistance_miles = 0;
            let totalActivities = 0;

            const rawData = response.data.values
                .map(row => ({
                    date: DateTime.fromFormat(row[0], dateFormat, {zone: "UTC", setZone: true}),
                    name: row[1].toLowerCase(),
                    time: getNumber(row[2]),
                    distance_km: getNumber(row[distanceKmCol]),
                    distance_miles:getNumber(row[distanceMilesCol])
                }))
                .filter(row => row.name);

            rawData
                .forEach(row => {
                    totalTime += row.time;
                    totalDistance_km += row.distance_km;
                    totalDistance_miles += row.distance_miles;
                    totalActivities++;
                    if (individual.hasOwnProperty(row.name)) {
                        individual[row.name].time += row.time;
                        individual[row.name].distance_km += row.distance_km;
                        individual[row.name].distance_miles += row.distance_miles;
                        individual[row.name].activities++;
                        if (individual[row.name].date < row.date) {
                            individual[row.name].date = row.date;
                        }
                    } else {
                        individual[row.name] = {
                            date: row.date,
                            id: row.name,
                            name: row.name,
                            time: row.time,
                            distance_km: row.distance_km,
                            distance_miles: row.distance_miles,
                            activities: 1
                        }
                    }
                });

            const result = {};
            result[region.toLowerCase()] = {
                individual: Object.values(individual),
                raw: rawData,
                totalTime,
                totalDistance_km,
                totalDistance_miles
            };
            return result;
        });
}



// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App UI available http://localhost:${port}`);
});

if (process.env.NODE_ENV === 'production') {
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'webapp/build', 'index.html'));
  });
}

module.exports = app;
