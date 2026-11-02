import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const socials = [
  [Facebook, 'https://www.facebook.com', 'Facebook'], [Instagram, 'https://www.instagram.com', 'Instagram'],
  [Twitter, 'https://twitter.com', 'Twitter'], [Youtube, 'https://www.youtube.com', 'YouTube']
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo light"><span className="logo-mark"><Plane size={18} /></span>Travel<b>Mate</b></Link>
          <p className="footer-about">TravelMate helps you discover destinations, plan budget-friendly itineraries and save the places you love. Explore the World, One Journey at a Time.</p>
          <div className="socials">
            {socials.map(([Icon, href, label]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon size={18} /></a>
            ))}
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link><Link to="/destinations">Destinations</Link><Link to="/explore">Explore</Link>
          <Link to="/planner">Trip Planner</Link><Link to="/about">About Us</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link><Link to="/register">Sign Up</Link><Link to="/profile">My Profile</Link><Link to="/favorites">Saved Destinations</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p><Mail size={15} /> hello@travelmate.app</p>
          <p><Phone size={15} /> +91 98765 43210</p>
          <p><MapPin size={15} /> Bhubaneswar, Odisha, India</p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} TravelMate. All rights reserved.</div>
    </footer>
  );
}
