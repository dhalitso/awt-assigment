import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function MapComponent({
  properties = [],
  onSelectProperty,
  center = [-25.9602, 32.5855], // Maputo center
  zoom = 13,
  selectedPropertyId = null
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // 1. Initialize Map if not already initialized
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView(center, zoom);

      // 2. Add OpenStreetMap Premium Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team'
      }).addTo(mapRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run once on mount

  // 3. Update Center/Zoom when props change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // 4. Manage Markers and popups
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};

    // Custom SVG Purple Pin Icon
    const purpleIcon = L.divIcon({
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary); filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.15));">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/>
          <circle cx="12" cy="10" r="3" fill="var(--color-primary-light)" />
        </svg>
      `,
      className: 'custom-map-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -32]
    });

    const activeIcon = L.divIcon({
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-danger); filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.25));">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/>
          <circle cx="12" cy="10" r="3" fill="#ffffff" />
        </svg>
      `,
      className: 'custom-map-marker active',
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -40]
    });

    properties.forEach(p => {
      if (!p.lat || !p.lng) return;

      const isActive = selectedPropertyId === p.id;
      const marker = L.marker([p.lat, p.lng], {
        icon: isActive ? activeIcon : purpleIcon
      }).addTo(mapRef.current);

      // Create popup content DOM node to attach native React callback
      const popupDiv = document.createElement('div');
      popupDiv.className = 'map-popup-card';
      
      const formattedPrice = p.price.toLocaleString('pt-MZ') + ' MTn';
      const period = p.pricePeriod ? `/${p.pricePeriod}` : '';
      
      popupDiv.innerHTML = `
        <img src="${p.images[0]}" class="map-popup-img" alt="${p.title}" />
        <div class="map-popup-body" style="padding: 10px; font-family: var(--font-body)">
          <div class="map-popup-price" style="color: var(--color-primary); font-weight: 700; font-family: var(--font-title); font-size: 0.95rem;">${formattedPrice}${period}</div>
          <div class="map-popup-title" style="font-size: 0.8rem; font-weight: 600; color: var(--color-text); margin: 2px 0 6px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.2;">${p.title}</div>
          <button class="btn-popup-nav" style="width: 100%; border: none; background: var(--color-primary); color: white; padding: 6px 12px; font-size: 0.75rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            Ver Detalhes
          </button>
        </div>
      `;

      // Bind details navigation click event
      const navBtn = popupDiv.querySelector('.btn-popup-nav');
      if (navBtn) {
        navBtn.onclick = (e) => {
          e.stopPropagation();
          onSelectProperty(p.id);
        };
      }

      marker.bindPopup(popupDiv);
      markersRef.current[p.id] = marker;

      // Automatically open popup if this property is actively selected
      if (isActive) {
        marker.openPopup();
      }
    });
  }, [properties, selectedPropertyId, onSelectProperty]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div 
        ref={mapContainerRef} 
        className="leaflet-container-custom" 
        style={{ width: '100%', height: '100%', minHeight: '350px', zIndex: 1 }}
      />
    </div>
  );
}
