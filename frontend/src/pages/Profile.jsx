import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Heart, Map, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { inr, fmtDate } from '../utils/format.js';

export default function Profile() {
  const { user, mode, favorites, trips, logout, deleteTrip } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <section className="page-hero"><div className="container"><h1>My Profile</h1><p>Your account, saved trips and favorites.</p></div></section>
      <section className="section tight">
        <div className="container profile-grid">
          <aside className="side-card">
            <span className="avatar big">{user.name[0].toUpperCase()}</span>
            <h2>{user.name}</h2>
            <p className="muted">{user.email}</p>
            <span className="pill">{mode === 'demo' ? 'Demo mode (saved in this browser)' : 'Synced with database'}</span>
            <div className="stat-pair"><div><strong>{favorites.length}</strong><span>Favorites</span></div><div><strong>{trips.length}</strong><span>Trips</span></div></div>
            <Link to="/favorites" className="btn btn-outline block"><Heart size={16} /> Saved destinations</Link>
            <button className="btn btn-ghost-dark block" onClick={() => { logout(); navigate('/'); }}><LogOut size={16} /> Logout</button>
          </aside>
          <div>
            <h2>Saved trips</h2>
            {trips.length === 0 ? (
              <div className="empty"><Map size={30} /><h3>No saved trips yet</h3><p>Generate an itinerary and press “Save Trip”.</p><Link to="/planner" className="btn btn-primary">Plan a trip</Link></div>
            ) : (
              <div className="trip-list">
                {trips.map((t) => (
                  <article className="trip-item" key={t.id}>
                    <div>
                      <h3>{t.itinerary?.destination?.name || t.destination}</h3>
                      <p>{t.startingLocation} · {fmtDate(t.startDate)} – {fmtDate(t.endDate)} · {t.travelers} traveler{t.travelers > 1 ? 's' : ''}</p>
                      <strong>{inr(t.itinerary?.total)}</strong> <small className="muted">estimated total</small>
                    </div>
                    <div className="trip-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => navigate('/planner', { state: { itinerary: t.itinerary } })}><Eye size={15} /> View</button>
                      <button className="btn btn-ghost-dark btn-sm" onClick={() => deleteTrip(t.id)} aria-label="Delete trip"><Trash2 size={15} /></button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
