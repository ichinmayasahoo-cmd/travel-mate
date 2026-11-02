import { destinations } from '../data/destinations.js';
import { asyncHandler } from '../middleware/errorHandler.js';

function demoWeather(city, note) {
  const d = destinations.find((x) => x.name.toLowerCase() === String(city).toLowerCase());
  const w = d?.weather || { temp: 28, condition: 'Partly Cloudy', humidity: 65 };
  return { demo: true, city: d?.name || city, temp: w.temp, condition: w.condition, humidity: w.humidity, wind: 10, note };
}

export const getWeather = asyncHandler(async (req, res) => {
  const city = String(req.query.city || '').trim();
  if (!city) return res.status(400).json({ message: 'City is required.' });
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return res.json(demoWeather(city, 'Demo weather – add OPENWEATHER_API_KEY for live data.'));
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`OpenWeather responded ${r.status}`);
    const j = await r.json();
    res.json({
      demo: false,
      city: j.name,
      temp: Math.round(j.main.temp),
      condition: j.weather?.[0]?.main || 'Clear',
      description: j.weather?.[0]?.description || '',
      humidity: j.main.humidity,
      wind: Math.round((j.wind?.speed || 0) * 3.6)
    });
  } catch (err) {
    res.json(demoWeather(city, 'Live weather is unavailable right now. Showing demo weather.'));
  }
});
