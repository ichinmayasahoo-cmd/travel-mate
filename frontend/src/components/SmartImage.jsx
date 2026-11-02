import { useState } from 'react';

// Shows the image; if it fails to load, shows a coloured placeholder instead of a broken icon
export default function SmartImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        <span>{(alt || 'T').charAt(0)}</span>
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
