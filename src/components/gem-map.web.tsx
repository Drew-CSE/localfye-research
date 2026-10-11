import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./gem-map.css";

type Gem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  address: string;
  hours: string;
  color: string;
  position: [number, number];
};

const defaultCenter: [number, number] = [40.73, -73.99];
const demoGems = [
  { id: "coffee", name: "Maple Mug Cafe", category: "Coffee shop", description: "A cozy spot for fresh coffee, pastries, and a quiet break.", price: "$3-$7 per drink", address: "18 Maple Lane", hours: "7:00 AM-6:00 PM", color: "#8b4513", latitudeOffset: 0.002, longitudeOffset: -0.003 },
  { id: "food", name: "Corner Grill", category: "Fast food", description: "A casual stop for burgers, crispy fries, and quick meals.", price: "$8-$14 per meal", address: "42 Market Street", hours: "11:00 AM-10:00 PM", color: "#d04424", latitudeOffset: -0.002, longitudeOffset: 0.003 },
];

export default function GemMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const addMarkerRef = useRef<((gem: Gem) => void) | null>(null);
  const centerRef = useRef<[number, number]>(defaultCenter);
  const [mapReady, setMapReady] = useState(false);
  const [addedGems, setAddedGems] = useState<Gem[]>([]);
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [locationMessage, setLocationMessage] = useState("Finding your location...");

  useEffect(() => {
    let active = true;
    let map: LeafletMap | undefined;
    let resizeObserver: ResizeObserver | undefined;

    async function initializeMap() {
      const L = await import("leaflet");
      if (!active || !containerRef.current) return;

      map = L.map(containerRef.current).setView(defaultCenter, 15);
      const currentMap = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(currentMap);
      const userMarkers = new Map<string, Marker>();

      function createMarker(gem: Gem) {
        const pin = document.createElement("div");
        pin.className = "localfye-pin";
        // Only the internal color is inserted into markup. User text stays plain text.
        pin.innerHTML = `<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 1C7 1 1 7 1 14c0 10 13 21 13 21s13-11 13-21C27 7 21 1 14 1Z" fill="${gem.color}" stroke="white" stroke-width="2"/><circle cx="14" cy="14" r="5" fill="white"/></svg>`;
        const label = document.createElement("span");
        label.className = "localfye-pin-label";
        label.textContent = gem.name;
        pin.appendChild(label);
        const icon = L.divIcon({
          className: "localfye-pin-icon",
          html: pin,
          iconSize: [160, 64],
          iconAnchor: [80, 36],
        });
        return L.marker(gem.position, { icon, title: gem.name, alt: gem.name })
          .on("click", () => {
            if (!active) return;
            setShowForm(false);
            setSelectedGem(gem);
          })
          .addTo(currentMap);
      }

      let currentDemoGems: Gem[] = [];
      let demoMarkers: Marker[] = [];

      function frameAllPins() {
        const positions = [
          centerRef.current,
          ...demoMarkers.map((marker) => marker.getLatLng()),
          ...Array.from(userMarkers.values(), (marker) => marker.getLatLng()),
        ];
        currentMap.fitBounds(L.latLngBounds(positions), { padding: [90, 80], maxZoom: 16 });
      }

      function centerDemoGems(center: [number, number]) {
        centerRef.current = center;
        demoMarkers.forEach((marker) => marker.remove());
        currentDemoGems = demoGems.map((gem) => ({
          ...gem,
          position: [center[0] + gem.latitudeOffset, center[1] + gem.longitudeOffset],
        }));
        demoMarkers = currentDemoGems.map(createMarker);
        frameAllPins();
      }

      addMarkerRef.current = (gem) => {
        if (!active || userMarkers.has(gem.id)) return;
        userMarkers.set(gem.id, createMarker(gem));
        frameAllPins();
      };
      centerDemoGems(defaultCenter);
      resizeObserver = new ResizeObserver(() => currentMap.invalidateSize());
      resizeObserver.observe(containerRef.current);

      if (!window.isSecureContext || !navigator.geolocation) {
        setLocationMessage(!window.isSecureContext
          ? "Open the app on localhost or HTTPS to use your location. Showing the default map."
          : "Your browser does not support location. Showing the default map.");
        setMapReady(true);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!active) return;
          const center: [number, number] = [position.coords.latitude, position.coords.longitude];
          L.circleMarker(center, {
            radius: 7, color: "#ffffff", weight: 2, fillColor: "#2563eb", fillOpacity: 1,
          }).bindTooltip("Your location").addTo(currentMap);
          centerDemoGems(center);
          setLocationMessage("");
          setMapReady(true);
        },
        (error) => {
          if (!active) return;
          if (error.code === error.PERMISSION_DENIED) {
            setLocationMessage("Location permission was denied. Allow location in your browser's site settings and reload. Showing the default map.");
          } else if (error.code === error.TIMEOUT) {
            setLocationMessage("Finding your location took too long. Reload to try again. Showing the default map.");
          } else {
            setLocationMessage("Your location could not be found. Check your device's location settings and reload. Showing the default map.");
          }
          setMapReady(true);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
      );
    }

    initializeMap().catch(() => {
      if (active) setLocationMessage("The map could not load. Please reload to try again.");
    });
    return () => {
      active = false;
      addMarkerRef.current = null;
      resizeObserver?.disconnect();
      map?.remove();
    };
  }, []);

  // Keep each submitted Gem in state and add its marker without rebuilding the map.
  useEffect(() => {
    if (!mapReady) return;
    addedGems.forEach((gem) => addMarkerRef.current?.(gem));
  }, [addedGems, mapReady]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mapReady) return;
    const data = new FormData(event.currentTarget);
    const read = (field: string) => String(data.get(field) ?? "").trim();
    const details = {
      name: read("name"), category: read("category"), description: read("description"),
      price: read("price"), address: read("address"), hours: read("hours"),
    };
    if (Object.values(details).some((value) => !value)) {
      setFormError("Please fill in every field with more than spaces.");
      return;
    }
    const gem: Gem = {
      ...details,
      id: crypto.randomUUID(),
      color: "#176b50",
      // Demo placement: freeze coordinates at submission; no address lookup yet.
      // Additional submissions use a small fixed spacing so their pins stay selectable.
      position: [centerRef.current[0] + 0.003 + addedGems.length * 0.0015, centerRef.current[1] + 0.003],
    };
    setAddedGems((previous) => [...previous, gem]);
    setShowForm(false);
    setFormError("");
    setSelectedGem(gem);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {locationMessage && (
        <p role="status" style={{ margin: "0 0 12px", color: "#222222", fontSize: 14 }}>
          {locationMessage}
        </p>
      )}
      <div className="localfye-map-frame">
        <div ref={containerRef} role="region" aria-label="Localfye map with Gem pins"
          style={{ width: "100%", flex: 1, minHeight: 240, isolation: "isolate" }} />
        <button type="button" className="localfye-add-gem" disabled={!mapReady}
          aria-expanded={showForm} aria-controls={showForm ? "add-gem-form" : undefined}
          onClick={() => { setSelectedGem(null); setFormError(""); setShowForm(true); }}>
          <span aria-hidden="true" className="localfye-add-gem-plus">+</span>
          Add Gem
        </button>
      </div>
      {showForm && (
        <section className="localfye-details" aria-labelledby="add-gem-heading">
          <div className="localfye-details-header">
            <h2 id="add-gem-heading">Add Gem</h2>
            <button type="button" className="localfye-details-close" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <form id="add-gem-form" className="localfye-gem-form" onSubmit={handleSubmit}>
            <div className="localfye-form-field">
              <label htmlFor="gem-name">Name</label>
              <input id="gem-name" name="name" required maxLength={80} autoFocus />
            </div>
            <div className="localfye-form-field">
              <label htmlFor="gem-description">Description</label>
              <textarea id="gem-description" name="description" required maxLength={500} rows={3} />
            </div>
            <div className="localfye-form-field">
              <label htmlFor="gem-category">Category</label>
              <select id="gem-category" name="category" defaultValue="Other">
                <option>Coffee shop</option><option>Fast food</option><option>Other</option>
              </select>
            </div>
            <div className="localfye-form-field">
              <label htmlFor="gem-price">Price range</label>
              <input id="gem-price" name="price" required maxLength={80} placeholder="$5-$15 per person" />
            </div>
            <div className="localfye-form-field">
              <label htmlFor="gem-address">Location</label>
              <input id="gem-address" name="address" required maxLength={160} placeholder="Street address or location description" />
            </div>
            <div className="localfye-form-field">
              <label htmlFor="gem-hours">Hours</label>
              <input id="gem-hours" name="hours" required maxLength={80} placeholder="9:00 AM-5:00 PM" />
            </div>
            {formError && <p role="alert" className="localfye-form-error">{formError}</p>}
            <button type="submit" className="localfye-submit-gem">Submit</button>
          </form>
        </section>
      )}
      {!showForm && selectedGem && (
        <section className="localfye-details" aria-label="Selected place details" aria-live="polite">
          <div className="localfye-details-header">
            <div>
              <p className="localfye-details-category">{selectedGem.category}</p>
              <h2>{selectedGem.name}</h2>
            </div>
            <button type="button" className="localfye-details-close" aria-label="Close place details"
              onClick={() => setSelectedGem(null)}>Close</button>
          </div>
          <p className="localfye-details-description">{selectedGem.description}</p>
          <dl className="localfye-details-facts">
            <div><dt>Price</dt><dd>{selectedGem.price}</dd></div>
            <div><dt>Location</dt><dd>{selectedGem.address}</dd></div>
            <div><dt>Hours</dt><dd>{selectedGem.hours}</dd></div>
          </dl>
        </section>
      )}
    </div>
  );
}
