import { useEffect, useState } from 'react';
import api from './api';
import { destinations as localDestinations } from '../data/destinations.js';
import { generateItinerary, findDestination } from '../data/itinerary.js';

let cache = null;

export async function fetchDestinations() {
  if (cache) return cache;
  try {
    const { data } = await api.get('/destinations');
    if (Array.isArray(data.destinations) && data.destinations.length) {
      cache = data.destinations;
      return cache;
    }
  } catch {
    /* backend offline - use built-in data */
  }
  cache = localDestinations;
  return cache;
}

export function useDestinations() {
  const [list, setList] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    let alive = true;
    fetchDestinations().then((d) => { if (alive) { setList(d); setLoading(false); } });
    return () => { alive = false; };
  }, []);
  return { list, loading };
}

export async function generateTrip(input) {
  try {
    const { data } = await api.post('/trips/generate', input);
    return data.itinerary;
  } catch (err) {
    if (err.response && err.response.status < 500) throw new Error(err.response.data?.message || 'Could not generate the trip.');
    return generateItinerary(input); // offline fallback
  }
}

export async function fetchWeather(city) {
  try {
    const { data } = await api.get('/weather', { params: { city } });
    return data;
  } catch {
    const d = findDestination(city);
    const w = d?.weather || { temp: 28, condition: 'Partly Cloudy', humidity: 65 };
    return { demo: true, city: d?.name || city, ...w, wind: 10, note: 'Demo weather – start the backend and add an OpenWeather key for live data.' };
  }
}
