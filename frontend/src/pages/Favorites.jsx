import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import DestinationCard from '../components/DestinationCard.jsx';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDestinations } from '../services/destinationService.js';

export default function Favorites() {
  const { favorites } = useAuth();
  const { list, loading } = useDestinations();
  const saved = list.filter((d) => favorites.includes(d.id));

  return (
    <>
      <section className="page-hero"><div className="container"><h1>Saved Destinations</h1><p>Your personal shortlist of places to visit.</p></div></section>
      <section className="section tight">
        <div className="container">
          {loading ? <Loader /> : saved.length ? (
            <div className="grid-cards">{saved.map((d) => <DestinationCard key={d.id} d={d} />)}</div>
          ) : (
            <div className="empty"><Heart size={30} /><h3>No favorites yet</h3><p>Tap the heart on any destination to save it here.</p><Link to="/destinations" className="btn btn-primary">Browse destinations</Link></div>
          )}
        </div>
      </section>
    </>
  );
}
