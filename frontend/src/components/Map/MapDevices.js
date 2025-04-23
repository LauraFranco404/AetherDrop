import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import './MapDevices.css';

// Importa tus íconos personalizados
import droneIconImg from '../../icons/drone.png';
import robotIconImg from '../../icons/robot.png';

const center = [3.347133, -76.533004];

const bounds = L.latLngBounds(
  [center[0] - 0.005, center[1] - 0.005],
  [center[0] + 0.005, center[1] + 0.005]
);

// Crea íconos personalizados
const droneIcon = new L.Icon({
  iconUrl: droneIconImg,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const robotIcon = new L.Icon({
  iconUrl: robotIconImg,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const MapView = ({ points = [] }) => {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={17}
        minZoom={16}
        maxZoom={18}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        style={{ height: '750px', width: '750px' }}

      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {points.map((point, idx) => (
          <Marker
            key={idx}
            position={[point.lat, point.lng]}
            icon={point.type === 'drone' ? droneIcon : robotIcon}
          >
            <Popup>
              <strong>{point.type === 'drone' ? 'Dron' : 'Robot'}</strong><br />
              {point.info}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
