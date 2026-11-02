import { Link } from 'react-router-dom';
import SmartImage from '../components/SmartImage.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import Loader from '../components/Loader.jsx';
import { useDestinations } from '../services/destinationService.js';
import { CATEGORIES, CATEGORY_ICONS } from '../utils/categories.js';

export default function Explore() {
  const { list, loading } = useDestinations();
  if (loading) return <Loader full label="Loading…" />;
  const top = [...list].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const cheap = [...list].sort((a, b) => a.budget - b.budget).slice(0, 3);

  return (
    <>
      <section className="page-hero"><div className="container"><h1>Explore by Travel Type</h1><p>Pick a mood and see where it takes you.</p></div></section>
      <section className="section tight">
        <div className="container">
          <div className="cat-grid">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c];
              const items = list.filter((d) => d.category === c || (d.tags || []).includes(c));
              const cover = items[0];
              return (
                <Link key={c} to={`/destinations?category=${c}`} className="cat-tile">
                  <SmartImage src={cover?.image} alt={c} />
                  <div className="cat-over"><Icon size={26} /><h3>{c}</h3><span>{items.length} destination{items.length === 1 ? '' : 's'}</span></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="section-head"><h2>Top Rated</h2><p>The destinations travelers rate highest.</p></div>
          <div className="grid-cards">{top.map((d) => <DestinationCard key={d.id} d={d} />)}</div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head"><h2>Budget-Friendly Picks</h2><p>Great trips that go easy on your wallet.</p></div>
          <div className="grid-cards">{cheap.map((d) => <DestinationCard key={d.id} d={d} />)}</div>
        </div>
      </section>
    </>
  );
}
