import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import map_icon1 from '../../icons/map_icon1.png';
import map_icon2 from '../../icons/map_icon2.png';
import Navbar from '../../components/Navbar/Navbar';
import PathsSideBar from '../../components/Paths/paths_sidebar';
import { useEffect } from 'react';

const center = [3.347133, -76.533004];
const bounds = L.latLngBounds(
  [center[0] - 0.005, center[1] - 0.005],
  [center[0] + 0.005, center[1] + 0.005]
);

const iconDefault = new L.Icon({
  iconUrl: map_icon1,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const iconSelected = new L.Icon({
  iconUrl: map_icon2,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function PathsInterestPoints() {
  const [mode, setMode] = useState('add');
  const [nodes, setNodes] = useState([]);
  const [robot_connections, setRobotConnections] = useState([]);
  const [drone_connections, setDroneConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleMapClick = () => {
    setSelectedNode(null); // Cerrar el input si se hace clic en el mapa
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setEditingName(node.name || '');
  };

  const handleNameChange = (e) => {
    setEditingName(e.target.value);
  };

  const handleNameSave = () => {
    const updatedNodes = nodes.map(n =>
      n.id === selectedNode.id ? { ...n, name: editingName } : n
    );
  
    setNodes(updatedNodes);
    setSelectedNode(null);
  
    // Ejecuta el guardado en la base de datos
    const payload = {
      nodes: updatedNodes.map(({ id, lat, lng, name }) => ({ id, lat, lng, name })),
      drone_connections,
      robot_connections,
    };
  
    fetch('http://127.0.0.1:8000/updatedronepaths/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        alert('Nombre actualizado y datos guardados correctamente.');
      })
      .catch(err => {
        alert('Error al guardar en la base de datos');
        console.error(err);
      });
  };

  const handleCancel = () => {
    window.location.reload(); // Descarta los cambios recargando la página
  };

  const resolvePosition = (id) => {
    const node = nodes.find((n) => n.id === id);
    return [node.lat, node.lng];
  };

  const MapClickHandler = () => {
    useMapEvents({ click: handleMapClick });
    return null;
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/getpaths/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch map data');
        return res.json();
      })
      .then((data) => {
        setNodes(data.nodes || []);
        setDroneConnections(data.drone_connections || []);
        setRobotConnections(data.robot_connections || []);
      })
      .catch((err) => {
        console.error('Error fetching initial map data:', err);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className='paths-container'>
        <PathsSideBar className="bar-skip" />
        <div className='paths-content bar-skip'>
          <div className='paths-map'>
            <MapContainer
              center={center}
              zoom={17}
              minZoom={17}
              maxZoom={18}
              maxBounds={bounds}
              maxBoundsViscosity={1.0}
              style={{ height: '750px', width: '750px' }}
            >
              <MapClickHandler />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {nodes.map((node) => (
                <Marker
                  key={node.id}
                  position={[node.lat, node.lng]}
                  icon={selectedNode && selectedNode.id === node.id ? iconSelected : iconDefault}
                  eventHandlers={{ click: () => handleNodeClick(node) }}
                >
                  <Tooltip direction="top" offset={[0, -10]} permanent>
                    {node.name || ''}
                  </Tooltip>
                </Marker>
              ))}

              {drone_connections.map(([a, b], index) => (
                <Polyline key={index} positions={[resolvePosition(a), resolvePosition(b)]} color="blue" />
              ))}

              {robot_connections.map(([a, b], index) => (
                <Polyline key={index} positions={[resolvePosition(a), resolvePosition(b)]} color="red" />
              ))}
            </MapContainer>
          </div>

          {selectedNode && (
            <div style={{ marginTop: '10px' }}>
              <label>
                Edit name for node <strong>{selectedNode.id}</strong>:&nbsp;
                <input type="text" value={editingName} onChange={handleNameChange} />
              </label>
              <button onClick={handleNameSave}>Save</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PathsInterestPoints;
