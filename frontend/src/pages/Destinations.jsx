import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import DestinationCard from '../components/DestinationCard.jsx';
import Loader from '../components/Loader.jsx';
import { useDestinations } from '../services/destinationService.js';
import { CATEGORIES } from '../utils/categories.js';

const band = (b) => (b <= 15000 ? 'low' : b <= 50000 ? 'mid' : 'high');

export default function Destinations() {
  const [params, setParams] = useSearchParams();
  const { list, loading } = useDestinations();
  const q = params.get('q') || '';
  const country = params.get('country') || '';
  const category = params.get('category') || '';
  const budget = params.get('budget') || '';
  const sort = params.get('sort') || 'popularity';

  const set = (k, v) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v); else p.delete(k);
    setParams(p, { replace: true });
  };
  const countries = useMemo(() => [...new Set(list.map((d) => d.country))].sort(), [list]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = list.filter((d) =>
      (!s || [d.name, d.region, d.country, d.category, d.description].join(' ').toLowerCase().includes(s)) &&
      (!country || d.country === country) &&
      (!category || d.category === category || (d.tags || []).includes(category)) &&
      (!budget || band(d.budget) === budget)
    );
    const sorters = {
      popularity: (a, b) => b.popularity - a.popularity,
      rating: (a, b) => b.rating - a.rating,
      'budget-asc': (a, b) => a.budget - b.budget,
      'budget-desc': (a, b) => b.budget - a.budget,
      name: (a, b) => a.name.localeCompare(b.name)
    };
    return out.sort(sorters[sort] || sorters.popularity);
  }, [list, q, country, category, budget, sort]);

  const hasFilters = q || country || category || budget || sort !== 'popularity';

  return (
    <>
      <section className="page-hero"><div className="container"><h1>Destination Explorer</h1><p>Search, filter and sort to find the trip that fits you.</p></div></section>
      <section className="section tight">
        <div className="container">
          <div className="filters">
            <label className="search-box"><Search size={18} />
              <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search destinations…" aria-label="Search destinations" />
            </label>
            <select value={country} onChange={(e) => set('country', e.target.value)} aria-label="Filter by country">
              <option value="">All countries</option>
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={budget} onChange={(e) => set('budget', e.target.value)} aria-label="Filter by budget">
              <option value="">Any budget</option>
              <option value="low">Up to ₹15,000</option>
              <option value="mid">₹15,000 – ₹50,000</option>
              <option value="high">Above ₹50,000</option>
            </select>
            <select value={sort} onChange={(e) => set('sort', e.target.value)} aria-label="Sort destinations">
              <option value="popularity">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="budget-asc">Budget: low to high</option>
              <option value="budget-desc">Budget: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
          <div className="chips">
            <button className={`chip ${!category ? 'on' : ''}`} onClick={() => set('category', '')}>All types</button>
            {CATEGORIES.map((c) => <button key={c} className={`chip ${category === c ? 'on' : ''}`} onClick={() => set('category', c)}>{c}</button>)}
          </div>
          <div className="result-bar">
            <span><SlidersHorizontal size={15} /> {loading ? 'Loading…' : `${results.length} destination${results.length === 1 ? '' : 's'} found`}</span>
            {hasFilters && <button className="link-btn" onClick={() => setParams({}, { replace: true })}><X size={14} /> Clear filters</button>}
          </div>
          {loading ? <Loader label="Loading destinations…" /> : results.length ? (
            <div className="grid-cards">{results.map((d) => <DestinationCard key={d.id} d={d} />)}</div>
          ) : (
            <div className="empty"><h3>No destinations match your filters</h3><p>Try a different search or clear the filters.</p>
              <button className="btn btn-primary" onClick={() => setParams({}, { replace: true })}>Clear filters</button></div>
          )}
        </div>
      </section>
    </>
  );
}
