import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from '../context/AuthContext.jsx';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const from = loc.state?.from || '/';

  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!emailRe.test(form.email.trim())) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Enter your password.';
    setErrors(errs); setError('');
    if (Object.keys(errs).length) return;
    setBusy(true);
    try { await login(form.email, form.password); navigate(from, { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <section className="auth">
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>Welcome back</h1>
        <p className="muted">Log in to save favorites and trips.</p>
        {loc.state?.message && <p className="notice">{loc.state.message}</p>}
        {error && <p className="alert">{error}</p>}
        <label className="field"><span>Email</span>
          <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          {errors.email && <em className="error">{errors.email}</em>}</label>
        <label className="field"><span>Password</span>
          <input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" />
          {errors.password && <em className="error">{errors.password}</em>}</label>
        <button className="btn btn-primary block" disabled={busy}><LogIn size={16} /> {busy ? 'Logging in…' : 'Login'}</button>
        <button type="button" className="btn btn-outline block" onClick={() => setForm({ email: DEMO_EMAIL, password: DEMO_PASSWORD })}>Use demo account</button>
        <p className="switch">New to TravelMate? <Link to="/register" state={loc.state}>Create an account</Link></p>
      </form>
    </section>
  );
}
