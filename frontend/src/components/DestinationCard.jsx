import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import SmartImage from './SmartImage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { inr } from '../utils/format.js';

export default function DestinationCard({ d }) {
  const { favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const fav = favorites.includes(d.id);

  const onFav = async () => {
    const ok = await toggleFavorite(d.id);
    if (!ok) navigate('/login', { state: { from: loc.pathname + loc.search, message: 'Please log in to save favorite destinations.' } });
  };

  return (
    <article className="dest-card">
      <div className="dest-img">
        <SmartImage src={d.image} alt={d.name} />
        <span className="badge">{d.category}</span>
        <button className={`fav-btn ${fav ? 'active' : ''}`} onClick={onFav} aria-label={fav ? `Remove ${d.name} from favorites` : `Add ${d.name} to favorites`}>
          <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="dest-body">
        <div className="dest-top">
          <h3>{d.name}</h3>
          <span className="rating"><Star size={14} fill="currentColor" /> {d.rating}</span>
        </div>
        <p className="loc"><MapPin size={14} /> {d.region && d.region !== d.country ? `${d.region}, ` : ''}{d.country}</p>
        <p className="desc">{d.description}</p>
        <div className="dest-foot">
          <div><small>Est. budget</small><strong>{inr(d.budget)}</strong></div>
          <Link to={`/destinations/${d.id}`} className="btn btn-primary btn-sm">Explore</Link>
        </div>
      </div>
    </article>
  );
}
