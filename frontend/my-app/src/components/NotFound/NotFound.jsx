import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-code">404</h1>
      <p className="not-found-text">This page doesn't exist.</p>
      <Link to="/" className="not-found-link">Back to Home</Link>
    </div>
  );
}

export default NotFound;