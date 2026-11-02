import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Sparkles, Printer, Bookmark, Utensils, Check, AlertTriangle, MapPin, Users, Calendar, RotateCcw } from 'lucide-react';
import Loader from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { generateTrip } from '../services/destinationService.js';
import { destinations } from '../data/destinations.js';
import { PREFERENCES } from '../data/itinerary.js';
import { inr, fmtDate, todayISO } from '../utils/format.js';

const emptyForm = (destination = '') => ({
  startingLocation: '', destination, startDate: '', endDate: '', travelers: 1, budget: '', preference: 'Standard'
});

function validate(f) {
  const e = {};
  if (f.startingLocation.trim().length < 2) e.startingLocation = 'Enter your starting location.';
  if (f.destination.trim().length < 2) e.destination = 'Enter a destination.';
  if (!f.startDate) e.startDate = 'Choose a start date.';
  else if (f.startDate < todayISO()) e.startDate = 'Start date cannot be in the past.';
  if (!f.endDate) e.endDate = 'Choose an end date.';
  else if (f.startDate && f.endDate < f.startDate) e.endDate = 'End date must be on or after the start date.';
  else if (f.startDate && (new Date(f.endDate) - new Date(f.startDate)) / 86400000 > 9) e.endDate = 'Trips can be up to 10 days.';
  const t = Number(f.travelers);
  if (!Number.isInteger(t) || t < 1 || t > 20) e.travelers = 'Enter 1 to 20 travelers.';
  if (!f.budget || Number(f.budget) < 500) e.budget = 'Enter a total budget of at least ₹500.';
  return e;
}

function Field({ label, error, children }) {
  return <label className="field"><span>{label}</span>{children}{error && <em className="error">{error}</em>}</label>;
}

function Result({ it, form, onReset }) {
  const { user, saveTrip } = useAuth();
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState('');
  const c = it.costs;
  const rows = [['Transportation', c.transportation], ['Hotel', c.hotel], ['Food', c.food], ['Attractions', c.attractions]];

  const save = async () => {
    try { await saveTrip(form, it); setSaved(true); setMsg('Trip saved to your profile.'); }
    catch (err) { setMsg(err.message); }
  };

  return (
    <div className="result" id="itinerary">
      <div className="result-head">
        <div>
          <h2>Your trip to {it.destination.name}</h2>
          <p>{it.startingLocation} → {it.destination.name} · {fmtDate(it.startDate)} to {fmtDate(it.endDate)}</p>
          <div className="info-row">
            <span><Calendar size={15} /> {it.days} day{it.days > 1 ? 's' : ''}</span>
            <span><Users size={15} /> {it.travelers} traveler{it.travelers > 1 ? 's' : ''}</span>
            <span><Sparkles size={15} /> {it.preference}</span>
          </div>
        </div>
        <div className="result-actions no-print">
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}><Printer size={15} /> Print</button>
          {user
            ? <button className="btn btn-primary btn-sm" onClick={save} disabled={saved}><Bookmark size={15} /> {saved ? 'Saved' : 'Save Trip'}</button>
            : <Link className="btn btn-primary btn-sm" to="/login" state={{ from: '/planner', message: 'Log in to save your trips.' }}>Log in to save</Link>}
          <button className="btn btn-ghost-dark btn-sm" onClick={onReset}><RotateCcw size={15} /> New trip</button>
        </div>
      </div>
      {msg && <p className="notice no-print">{msg}</p>}

      <div className="result-grid">
        <div className="days">
          {it.plan.map((d) => (
            <article className="day" key={d.day}>
              <div className="day-badge">Day {d.day}</div>
              <div>
                <h3>{d.title}</h3>
                {d.date && <small>{fmtDate(d.date)}</small>}
                <ul>
                  {d.activities.map((a) => <li key={a.name}><MapPin size={15} /> <span>{a.name}</span><b>{a.cost ? `${inr(a.cost)} pp` : 'Free'}</b></li>)}
                </ul>
                <p className="food"><Utensils size={15} /> {d.food}</p>
              </div>
            </article>
          ))}
          <p className="tip"><Sparkles size={15} /> {it.tip}</p>
        </div>

        <aside className="cost-card">
          <h3>Estimated Budget</h3>
          {rows.map(([label, v]) => (
            <div className="cost-row" key={label}>
              <div><span>{label}</span><b>{inr(v)}</b></div>
              <div className="bar"><i style={{ width: `${it.total ? Math.max(4, (v / it.total) * 100) : 0}%` }} /></div>
            </div>
          ))}
          <div className="total"><span>Total estimate</span><strong>{inr(it.total)}</strong></div>
          <small>About {inr(it.perPerson)} per person</small>
          {it.status === 'within' && <p className="status ok"><Check size={16} /> Within your budget of {inr(it.budget)}. You keep {inr(it.difference)}.</p>}
          {it.status === 'over' && (
            <div className="status warn">
              <p><AlertTriangle size={16} /> About {inr(Math.abs(it.difference))} over your budget of {inr(it.budget)}.</p>
              <ul>{it.savingTips.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          )}
          <small className="muted">Estimates only. Real prices vary by season and booking time.</small>
        </aside>
      </div>
    </div>
  );
}

export default function TripPlanner() {
  const [params] = useSearchParams();
  const loc = useLocation();
  const [form, setForm] = useState(emptyForm(params.get('destination') || ''));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(loc.state?.itinerary || null);

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: '' }); };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setServerError('');
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      const [it] = await Promise.all([generateTrip(form), new Promise((r) => setTimeout(r, 700))]);
      setResult(it);
      setTimeout(() => document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setForm(emptyForm()); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <section className="page-hero no-print"><div className="container"><h1>Smart Trip Planner</h1><p>Tell us the basics and get a day-by-day plan with a cost estimate. No sign-up required.</p></div></section>
      <section className="section tight">
        <div className="container">
          {!result && (
            <form className="planner-form" onSubmit={submit} noValidate>
              <Field label="Starting location" error={errors.startingLocation}>
                <input value={form.startingLocation} onChange={set('startingLocation')} placeholder="e.g. Bhubaneswar" />
              </Field>
              <Field label="Destination" error={errors.destination}>
                <input list="dest-list" value={form.destination} onChange={set('destination')} placeholder="e.g. Puri" />
                <datalist id="dest-list">{destinations.map((d) => <option key={d.id} value={d.name} />)}</datalist>
              </Field>
              <Field label="Travel start date" error={errors.startDate}><input type="date" min={todayISO()} value={form.startDate} onChange={set('startDate')} /></Field>
              <Field label="Travel end date" error={errors.endDate}><input type="date" min={form.startDate || todayISO()} value={form.endDate} onChange={set('endDate')} /></Field>
              <Field label="Number of travelers" error={errors.travelers}><input type="number" min="1" max="20" value={form.travelers} onChange={set('travelers')} /></Field>
              <Field label="Total budget (₹)" error={errors.budget}><input type="number" min="0" step="500" value={form.budget} onChange={set('budget')} placeholder="e.g. 5000" /></Field>
              <Field label="Travel preference"><select value={form.preference} onChange={set('preference')}>{PREFERENCES.map((p) => <option key={p}>{p}</option>)}</select></Field>
              <div className="field submit-field">
                {serverError && <em className="error">{serverError}</em>}
                <button className="btn btn-primary btn-lg" type="submit" disabled={loading}><Sparkles size={18} /> {loading ? 'Planning…' : 'Generate My Trip'}</button>
              </div>
            </form>
          )}
          {loading && <Loader label="Building your itinerary…" />}
          {result && !loading && <Result it={result} form={form} onReset={reset} />}
        </div>
      </section>
    </>
  );
}
