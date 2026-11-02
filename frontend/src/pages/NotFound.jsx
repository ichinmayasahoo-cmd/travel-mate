import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container empty tall">
      <h1>404</h1><h2>This page took a wrong turn</h2><p>The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
