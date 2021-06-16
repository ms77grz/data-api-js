const express = require('express');
const fetch = require('node-fetch');
const Datastore = require('nedb');
require('dotenv').config();

// INITIATE EXPRESS
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

// INITIATE DB
const database = new Datastore('database.db');
database.loadDatabase();

// RETURN ALL RECORDS FROM DB
app.get('/api', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  });
});

// WRITE TO DB
app.post('/api', (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  res.json(data);
});

// GET DATA FROM OPEN WEATHER API SERVICE
app.get('/weather/:coords', async (req, res) => {
  const [lat, lon] = req.params.coords.split(',');
  // GET WEATHER
  const openWeatherAPI = {
    token: process.env.WEATHER_TOKEN,
    baseUrl: 'https://api.openweathermap.org/data/2.5/',
  };
  const weatherQuery = `${openWeatherAPI.baseUrl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherAPI.token}`;
  const weatherResponse = await fetch(weatherQuery);
  const weatherData = await weatherResponse.json();
  // GET AIR QUALITY
  const airAPI = {
    token: process.env.AIR_TOKEN,
    baseUrl: 'https://api.waqi.info/feed/',
  };
  const airQuery = `${airAPI.baseUrl}${weatherData.name}/?token=${airAPI.token}`;
  const airResponse = await fetch(airQuery);
  const airData = await airResponse.json();
  res.json({
    weather: weatherData,
    air: airData,
  });
});
