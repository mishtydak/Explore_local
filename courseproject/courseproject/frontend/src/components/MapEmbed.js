/**
 * Map Embed Component
 * Displays Google Maps embed for a location
 */

import React from 'react';

const MapEmbed = ({ latitude, longitude, name }) => {
  if (!latitude || !longitude) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
        Location coordinates not available
      </div>
    );
  }

  // Google Maps Embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'
  }&q=${latitude},${longitude}&zoom=15`;

  // Fallback to static map if embed key not available
  if (
    !process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY'
  ) {
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x400&markers=color:red%7C${latitude},${longitude}&key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
    }`;

    return (
      <div>
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block' }}
        >
          <img
            src={staticMapUrl}
            alt={`Map of ${name}`}
            className="map-embed"
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            onError={(e) => {
              // ✅ SAFETY CHECKS (FIX)
              if (e.target) {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'block';
                }
              }
            }}
          />
        </a>

        <div style={{ display: 'none', padding: '2rem', textAlign: 'center' }}>
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title={`Map of ${name}`}
      className="map-embed"
      src={mapUrl}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default MapEmbed;
