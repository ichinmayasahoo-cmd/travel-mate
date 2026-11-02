import { createContext, useContext, useEffect, useState } from 'react';
import api, { isOffline, errMsg } from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const DEMO_EMAIL = 'demo@travelmate.com';
export const DEMO_PASSWORD = 'Demo@123';

const read = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or blocked */ } };

// Demo mode keeps accounts in this browser only (never use real passwords here)
const demoUsers = () => {
  const users = read('tm_demo_users', []);
  if (!users.some((u) => u.email === DEMO_EMAIL)) users.unshift({ id: 'demo-user', name: 'Demo Traveler', email: DEMO_EMAIL, password: DEMO_PASSWORD });
  return users;
};
const strip = ({ password, ...u }) => u;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('live'); // 'live' = backend + MongoDB, 'demo' = localStorage
  const [favorites, setFavorites] = useState([]);
  const [trips, setTrips] = useState([]);
  const [ready, setReady] = useState(false);

  const loadTrips = async (m, u) => {
    if (m === 'demo') return setTrips(read(`tm_trips_${u.id}`, []));
    try { const { data } = await api.get('/trips'); setTrips(data.trips); } catch { setTrips([]); }
  };

  const start = async (m, u, token) => {
    localStorage.setItem('tm_token', m === 'demo' ? 'demo' : token);
    if (m === 'demo') write('tm_session', u.id);
    setMode(m);
    setUser(strip(u));
    setFavorites(m === 'demo' ? read(`tm_fav_${u.id}`, []) : u.favorites || []);
    await loadTrips(m, u);
  };

  const clear = () => {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_session');
    setUser(null); setFavorites([]); setTrips([]);
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('tm_token');
      try {
        if (token === 'demo') {
          const u = demoUsers().find((x) => x.id === read('tm_session', null));
          if (u) await start('demo', u); else clear();
        } else if (token) {
          const { data } = await api.get('/auth/me');
          await start('live', data.user, token);
        }
      } catch { clear(); }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await start('live', data.user, data.token);
    } catch (err) {
      if (!isOffline(err)) throw new Error(errMsg(err, 'Login failed.'));
      const u = demoUsers().find((x) => x.email === email.trim().toLowerCase() && x.password === password);
      if (!u) throw new Error('Invalid email or password.');
      await start('demo', u);
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      await start('live', data.user, data.token);
    } catch (err) {
      if (!isOffline(err)) throw new Error(errMsg(err, 'Registration failed.'));
      const users = demoUsers();
      const mail = email.trim().toLowerCase();
      if (users.some((x) => x.email === mail)) throw new Error('An account with this email already exists.');
      const u = { id: `demo-${Date.now()}`, name: name.trim(), email: mail, password };
      write('tm_demo_users', [...users, u]);
      await start('demo', u);
    }
  };

  const logout = () => clear();

  const toggleFavorite = async (id) => {
    if (!user) return false;
    const has = favorites.includes(id);
    const prev = favorites;
    const next = has ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(next);
    if (mode === 'demo') write(`tm_fav_${user.id}`, next);
    else {
      try { has ? await api.delete(`/favorites/${id}`) : await api.post(`/favorites/${id}`); } catch { setFavorites(prev); }
    }
    return true;
  };

  const saveTrip = async (form, itinerary) => {
    if (!user) throw new Error('Please log in to save trips.');
    const payload = {
      startingLocation: form.startingLocation, destination: form.destination, startDate: form.startDate,
      endDate: form.endDate, travelers: Number(form.travelers), budget: Number(form.budget),
      preference: form.preference, itinerary
    };
    if (mode === 'demo') {
      const trip = { id: `trip-${Date.now()}`, createdAt: new Date().toISOString(), ...payload };
      const next = [trip, ...trips];
      setTrips(next); write(`tm_trips_${user.id}`, next);
      return trip;
    }
    try {
      const { data } = await api.post('/trips', payload);
      setTrips([data.trip, ...trips]);
      return data.trip;
    } catch (err) { throw new Error(errMsg(err, 'Could not save the trip.')); }
  };

  const deleteTrip = async (id) => {
    const next = trips.filter((t) => t.id !== id);
    if (mode === 'demo') write(`tm_trips_${user.id}`, next);
    else { try { await api.delete(`/trips/${id}`); } catch { return; } }
    setTrips(next);
  };

  const value = { user, mode, ready, favorites, trips, login, register, logout, toggleFavorite, saveTrip, deleteTrip };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
