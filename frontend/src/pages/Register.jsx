import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const from = loc.state?.from || '/';

  if (user) return <Navigate to={from} replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!emailRe.test(form.email.trim())) errs.email = 'Enter a valid email address.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.';
    setErrors(errs); setError('');
    if (Object.keys(errs).length) return;
    setBusy(true);
    try { await register(form.name, form.email, form.password); navigate(from, { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const field = (k, label, type, ph, ac) => (
    <label className="field"><span>{label}</span>
      <input type={type} autoComplete={ac} value={form[k]} onChange={set(k)} placeholder={ph} />
      {errors[k] && <em className="error">{errors[k]}</em>}</label>
  );

  return (
    <section className="auth">
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>Create your account</h1>
        <p className="muted">Start saving destinations and trips in seconds.</p>
        {error && <p className="alert">{error}</p>}
        {field('name', 'Full name', 'text', 'Your name', 'name')}
        {field('email', 'Email', 'email', 'you@example.com', 'email')}
        {field('password', 'Password', 'password', 'At least 6 characters', 'new-password')}
        {field('confirm', 'Confirm password', 'password', 'Repeat your password', 'new-password')}
        <button className="btn btn-primary block" disabled={busy}><UserPlus size={16} /> {busy ? 'Creating account…' : 'Sign Up'}</button>
        <p className="switch">Already have an account? <Link to="/login" state={loc.state}>Login</Link></p>
      </form>
    </section>
  );
}
