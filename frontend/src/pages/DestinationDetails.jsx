import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { MapPin, Star, Heart, Clock, CalendarCheck, Check, ArrowLeft } from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDestinations } from '../services/destinationService.js';
import { inr } from '../utils/format.js';

export default function DestinationDetails() {
  const { id } = useParams();
  const { list, loading } = useDestinations();
  const { favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  if (loading) return <Loader full label="Loading destination…" />;
  const d = list.find((x) => x.id === id);
  if (!d) {
    return (
      <div className="container empty tall"><h2>Destination not found</h2><p>We couldn’t find “{id}”. It may have been removed.</p>
        <Link to="/destinations" className="btn btn-primary">Browse destinations</Link></div>
    );
  }
  const fav = favorites.includes(d.id);
  const onFav = async () => {
    const ok = await toggleFavorite(d.id);
    if (!ok) navigate('/login', { state: { from: loc.pathname, message: 'Please log in to save favorite destinations.' } });
  };
  const related = list.filter((x) => x.id !== d.id && (x.category === d.category || x.country === d.country)).slice(0, 3);

  return (
    <>
      <section className="detail-hero">
        <SmartImage src={d.image} alt={d.name} />
        <div className="detail-overlay" />
        <div className="container detail-hero-inner">
          <Link to="/destinations" className="back"><ArrowLeft size={16} /> All destinations</Link>
          <span className="badge">{d.category}</span>
          <h1>{d.name}</h1>
          <p><MapPin size={16} /> {d.region && d.region !== d.country ? `${d.region}, ` : ''}{d.country} &nbsp; <Star size={16} fill="currentColor" /> {d.rating}</p>
        </div>
      </section>

      <section className="section tight">
        <div className="container detail-grid">
          <div>
            <h2>About {d.name}</h2>
            <p className="lead">{d.description}</p>
            <div className="info-row">
              <span><Clock size={16} /> Suggested stay: {d.duration}</span>
              <span><CalendarCheck size={16} /> Best time: {d.bestTime}</span>
            </div>
            <h3>Top highlights</h3>
            <ul className="checklist">{(d.highlights || []).map((h) => <li key={h}><Check size={16} /> {h}</li>)}</ul>
            <h3>Sample itinerary</h3>
            <div className="mini-plan">
              {(d.plan || []).map((p, i) => (
                <div key={p.title} className="mini-day"><b>Day {i + 1}</b><div><strong>{p.title}</strong><p>{p.activities.map((a) => a.name).join(' · ')}</p></div></div>
              ))}
            </div>
          </div>
          <aside className="side">
            <div className="side-card">
              <small>Estimated budget per person</small>
              <strong className="price">{inr(d.budget)}</strong>
              <Link to={`/planner?destination=${encodeURIComponent(d.name)}`} className="btn btn-primary block">Plan a Trip to {d.name}</Link>
              <button className={`btn btn-outline block ${fav ? 'is-fav' : ''}`} onClick={onFav}>
                <Heart size={16} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved to Favorites' : 'Add to Favorites'}
              </button>
            </div>
            <WeatherCard city={d.name} />
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section alt">
          <div className="container"><div className="section-head"><h2>You might also like</h2></div>
            <div className="grid-cards">{related.map((r) => <DestinationCard key={r.id} d={r} />)}</div></div>
        </section>
      )}
    </>
  );
}
