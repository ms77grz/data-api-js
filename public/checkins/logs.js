// INITIATE LEAFLET MAP ON OPENSTEETSMAP
const mymap = L.map('mymap').setView([0, 0], 3);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

// const marker = L.marker([0, 0]).addTo(mymap);

// marker.setLatLng([lat, lon]);
// mymap.setView([lat, lon], 15);

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for ({ lat, lon, weather, air } of data) {
    const marker = L.marker([lat, lon]).addTo(mymap);
    let txt = `<p>
      The weather here in ${weather.name} at
      ${lat}&deg;, ${lon}&deg;<em>
        ${weather.weather[0].main} with a temperature of
        ${weather.main.temp} &deg;C.
      </em>
      The average concentration of particulate matter (pm25) is ${
        air?.data?.forecast?.daily?.pm25[2]?.avg
          ? air.data.forecast.daily.pm25[2].avg
          : 'NO DATA AVAILABLE'
      }
    </p>`;
    marker.bindPopup(txt);
  }
}

getData();
