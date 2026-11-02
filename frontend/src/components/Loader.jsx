import { Plane } from 'lucide-react';

export default function Loader({ full = false, label = 'Loading…' }) {
  return (
    <div className={`loader ${full ? 'loader-full' : ''}`} role="status" aria-live="polite">
      <div className="loader-orbit"><Plane size={22} /></div>
      <p>{label}</p>
    </div>
  );
}
