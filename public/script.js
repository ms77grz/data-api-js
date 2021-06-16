// GET CURRENT GEOLOCATION
let lat, lon;
if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    const {
      coords: { latitude: lat, longitude: lon },
    } = position;

    const { weather, air } = await getWeather(lat, lon);

    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = lon;

    document.getElementById('city').textContent = weather.name;
    document.getElementById('summary').textContent = weather.weather[0].main;
    document.getElementById('temperature').textContent = weather.main.temp;

    try {
      const pm25Value = air.data.forecast.daily.pm25[2].avg;
      document.getElementById('pm25').textContent = pm25Value;
    } catch (error) {
      document.getElementById('pm25').textContent = 'NO DATA';
    }

    sendData(lat, lon, weather, air);
  });
} else {
  console.log('geolocation not available');
}

// SEND DATA TO BACKEND
async function sendData(lat, lon, weather, air = 'no data') {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lon, weather, air }),
  };
  const response = await fetch('/api', options);
  const data = await response.json();
}

// GET WEATHER FUNCTION
async function getWeather(lat, lon) {
  const query = `/weather/${lat},${lon}`;
  const response = await fetch(query);
  const { weather, air } = await response.json();
  return { weather, air };
}
