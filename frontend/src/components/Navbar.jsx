import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Plane, Menu, X, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  ['/', 'Home'], ['/destinations', 'Destinations'], ['/explore', 'Explore'], ['/planner', 'Trip Planner'], ['/about', 'About Us']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const doLogout = () => { logout(); navigate('/'); };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo" aria-label="TravelMate home">
          <span className="logo-mark"><Plane size={18} /></span>
          Travel<b>Mate</b>
        </Link>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
          ))}
          <div className="nav-auth">
            {user ? (
              <>
                <Link to="/favorites" className="icon-link"><Heart size={16} /> Favorites</Link>
                <Link to="/profile" className="icon-link"><User size={16} /> {user.name.split(' ')[0]}</Link>
                <button className="btn btn-outline btn-sm" onClick={doLogout}><LogOut size={15} /> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
