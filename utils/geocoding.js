const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "your-app-name"
    }
  });

  const data = await response.json();

  if (!data.length) {
    return null;
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  };
}

module.exports = geocodeLocation;
