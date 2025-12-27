/**
 * Leaflet Map Picker
 * Fixed-size map with stable zoom and visible marker
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// ✅ Fix missing marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LeafletMapPicker = ({ onSelect }) => {
  const containerRef = useRef(null);     // DOM element
  const mapInstance = useRef(null);      // Leaflet map
  const markerRef = useRef(null);         // Marker

  useEffect(() => {
    if (mapInstance.current) return; // 🔒 prevent double init (StrictMode)

    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629], // India
      zoom: 5,
    });

    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // ✅ Fix layout jump on zoom
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = L.marker([lat, lng]).addTo(map);

      onSelect(lat, lng);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [onSelect]);

  return (
    <div
      style={{
        width: '100%',
        height: '420px',
        maxHeight: '420px',
        minHeight: '420px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #333',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      ></div>
    </div>
  );
};

export default LeafletMapPicker;
