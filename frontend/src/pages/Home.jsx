import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, Wallet, Mountain, CalendarCheck, Star, Plane } from 'lucide-react';
import DestinationCard from '../components/DestinationCard.jsx';
import Loader from '../components/Loader.jsx';
import { useDestinations } from '../services/destinationService.js';

const features = [
  [Compass, 'Personalized travel plans', 'Day-by-day itineraries shaped by where you go and how you like to travel.'],
  [Wallet, 'Budget-friendly trips', 'See transport, hotel, food and attraction costs before you book anything.'],
  [Mountain, 'Beautiful destinations', 'From Puri’s beaches to the Alps of Kashmir and the streets of Paris.'],
  [CalendarCheck, 'Easy trip planning', 'Pick your dates and budget, then get a ready-to-follow plan in seconds.']
];
const reviews = [
  ['Ananya Das', 'Bhubaneswar', 'I planned a 3-day Puri trip under ₹5,000 and the itinerary was spot on. Konark and Chilika were highlights.'],
  ['Rohit Mehra', 'Delhi', 'The cost breakdown helped us decide between Manali and Kashmir in minutes. Very handy for group trips.'],
  ['Sofia Martins', 'Lisbon', 'Saving favorites and checking the weather before a Bali trip made planning feel effortless.']
];

export default function Home() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { list, loading } = useDestinations();
  const search = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/destinations?q=${encodeURIComponent(q.trim())}` : '/destinations');
  };

  return (
    <>
      <section className="hero">
        <div className="hero-shape s1" /><div className="hero-shape s2" />
        <div className="container hero-inner">
          <p className="hero-tag"><Plane size={15} /> Explore the World, One Journey at a Time.</p>
          <h1>Discover Your Next Adventure</h1>
          <p className="hero-sub">Explore breathtaking destinations and create unforgettable travel experiences.</p>
          <form className="hero-search" onSubmit={search}>
            <Search size={20} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Puri, Goa, Bali, Paris…" aria-label="Search destinations" />
            <button className="btn btn-accent" type="submit">Search</button>
          </form>
          <div className="hero-actions">
            <Link to="/destinations" className="btn btn-light">Explore Now</Link>
            <Link to="/planner" className="btn btn-ghost">Plan a Trip</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2>Popular Destinations</h2><p>Hand-picked places travelers love, with realistic budgets to match.</p></div>
          {loading ? <Loader label="Loading destinations…" /> : (
            <div className="grid-cards">{list.map((d) => <DestinationCard key={d.id} d={d} />)}</div>
          )}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head"><h2>Why Choose TravelMate?</h2><p>Everything you need to go from “where to?” to “all booked”.</p></div>
          <div className="features">
            {features.map(([Icon, t, p]) => (
              <div className="feature" key={t}><span className="feature-icon"><Icon size={24} /></span><h3>{t}</h3><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2>What Travelers Say</h2><p>Sample stories from the TravelMate community.</p></div>
          <div className="reviews">
            {reviews.map(([name, city, text]) => (
              <figure className="review" key={name}>
                <div className="stars">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                <blockquote>“{text}”</blockquote>
                <figcaption><span className="avatar">{name[0]}</span><div><b>{name}</b><small>{city}</small></div></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container cta">
        <div>
          <h2>Ready for your next journey?</h2>
          <p>Tell us where, when and your budget. We’ll build the plan.</p>
        </div>
        <Link to="/planner" className="btn btn-light">Start Planning</Link>
      </section>
    </>
  );
}
