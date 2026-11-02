import { useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Loader from './components/Loader.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Destinations from './pages/Destinations.jsx';
import DestinationDetails from './pages/DestinationDetails.jsx';
import Explore from './pages/Explore.jsx';
import TripPlanner from './pages/TripPlanner.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Favorites from './pages/Favorites.jsx';
import NotFound from './pages/NotFound.jsx';

function Layout() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <>
      <Navbar />
      <main className="page"><Outlet /></main>
      <Footer />
    </>
  );
}

function Protected({ children }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <Loader full />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname, message: 'Please log in to continue.' }} />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<DestinationDetails />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/planner" element={<TripPlanner />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
