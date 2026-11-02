import { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Droplets, Wind } from 'lucide-react';
import { fetchWeather } from '../services/destinationService.js';
import Loader from './Loader.jsx';

const pickIcon = (c = '') => {
  const s = c.toLowerCase();
  if (s.includes('rain') || s.includes('drizzle') || s.includes('storm')) return CloudRain;
  if (s.includes('snow')) return Snowflake;
  if (s.includes('cloud') || s.includes('mist') || s.includes('haze') || s.includes('fog')) return Cloud;
  return Sun;
};

export default function WeatherCard({ city }) {
  const [w, setW] = useState(null);
  useEffect(() => {
    let alive = true;
    setW(null);
    fetchWeather(city).then((x) => alive && setW(x));
    return () => { alive = false; };
  }, [city]);

  if (!w) return <div className="weather-card"><Loader label="Checking weather…" /></div>;
  const Icon = pickIcon(w.condition);
  return (
    <div className="weather-card">
      <div className="weather-head">
        <h3>Weather in {w.city}</h3>
        {w.demo && <span className="pill">Demo</span>}
      </div>
      <div className="weather-main">
        <Icon size={46} />
        <div><strong>{w.temp}°C</strong><span>{w.condition}</span></div>
      </div>
      <div className="weather-meta">
        <span><Droplets size={15} /> Humidity {w.humidity}%</span>
        {w.wind != null && <span><Wind size={15} /> Wind {w.wind} km/h</span>}
      </div>
      {w.demo && <p className="weather-note">{w.note || 'Demo weather shown. Add an OpenWeather API key for live data.'}</p>}
    </div>
  );
}
