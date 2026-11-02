import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Heart, Zap } from 'lucide-react';

const values = [
  [Globe, 'Discover widely', 'A growing library of destinations across beaches, mountains, heritage towns and cities.'],
  [ShieldCheck, 'Plan honestly', 'Transparent cost estimates so there are no surprises when you travel.'],
  [Heart, 'Save what you love', 'Keep a personal list of destinations and trips ready for when you are.'],
  [Zap, 'Move fast', 'Go from idea to itinerary in under a minute, with no API keys or sign-up needed.']
];

export default function About() {
  return (
    <>
      <section className="page-hero"><div className="container"><h1>About TravelMate</h1><p>Explore the World, One Journey at a Time.</p></div></section>
      <section className="section tight">
        <div className="container narrow">
          <h2>Our story</h2>
          <p className="lead">TravelMate started as a simple question: why is planning a trip harder than taking one? We built a single place to discover destinations, compare budgets and turn dates into a day-by-day plan.</p>
          <p>Whether you are heading to Puri for a weekend, trekking in Manali or exploring Paris, TravelMate gives you a realistic starting point you can adjust and make your own.</p>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="stats">
            <div><strong>8+</strong><span>Destinations</span></div><div><strong>6</strong><span>Travel types</span></div>
            <div><strong>10</strong><span>Max trip days</span></div><div><strong>0</strong><span>Paid APIs needed</span></div>
          </div>
          <div className="features">
            {values.map(([Icon, t, p]) => <div className="feature" key={t}><span className="feature-icon"><Icon size={24} /></span><h3>{t}</h3><p>{p}</p></div>)}
          </div>
        </div>
      </section>
      <section className="container cta"><div><h2>Let’s plan your next trip</h2><p>It takes less than a minute.</p></div><Link to="/planner" className="btn btn-light">Open Trip Planner</Link></section>
    </>
  );
}
