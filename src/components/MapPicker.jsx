import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Vite doesn't resolve Leaflet's default marker images, so we point to them
const pinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickToPick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 16));
  }, [position, map]);
  return null;
}

export default function MapPicker({ position, onPick }) {
  const INDIA_CENTER = [20.5937, 78.9629];
  return (
    <MapContainer
      center={position ?? INDIA_CENTER}
      zoom={position ? 16 : 5}
      scrollWheelZoom={false}
      className="h-64 w-full rounded-lg border border-line"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickToPick onPick={onPick} />
      <FlyToPosition position={position} />
      {position && (
        <Marker
          position={position}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend(e) {
              const { lat, lng } = e.target.getLatLng();
              onPick(lat, lng);
            },
          }}
        />
      )}
    </MapContainer>
  );
}