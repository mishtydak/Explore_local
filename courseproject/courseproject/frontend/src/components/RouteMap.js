import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapPreview = ({ placeLat, placeLon, placeName, userLocation }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  /* ===============================
     MAP INITIALIZATION (ONCE)
     =============================== */
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(
      [placeLat || 20, placeLon || 78],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Open Google Maps on map click
    map.on("click", () => {
      if (placeLat == null || placeLon == null) return;

      const lat = parseFloat(placeLat);
      const lon = parseFloat(placeLon);

      const url =
        userLocation?.latitude != null
          ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${lat},${lon}`
          : `https://www.google.com/maps?q=${lat},${lon}`;

      window.open(url, "_blank");
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  /* ===============================
     MARKER UPDATE
     =============================== */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || placeLat == null || placeLon == null) return;

    // Remove old marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    const lat = parseFloat(placeLat);
    const lon = parseFloat(placeLon);

    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(placeName || "Destination");

    marker.on("click", () => {
      const url =
        userLocation?.latitude != null
          ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${lat},${lon}`
          : `https://www.google.com/maps?q=${lat},${lon}`;
      window.open(url, "_blank");
    });

    markerRef.current = marker;
    map.setView([lat, lon], 13);
  }, [placeLat, placeLon, placeName, userLocation]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "350px",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid #333",
        }}
      />
    </div>
  );
};

export default MapPreview;
