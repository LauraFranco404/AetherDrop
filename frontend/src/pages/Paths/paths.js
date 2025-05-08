import './paths.css';
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline,Tooltip  } from 'react-leaflet';
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

function Paths() {
  const [editMode, setEditMode] = useState(false);
  const [mode, setMode] = useState('add');
  const [nodes, setNodes] = useState([]);
  const [robot_connections, setRobotConnections] = useState([]);
  const [drone_connections, setDroneConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNames, setShowNames] = useState(true);

  const draggedNodeRef = useRef(null);

  const handleMapClick = (e) => {
    if (!editMode) return;
  
    const { lat, lng } = e.latlng;
  
    if (mode === 'add') {
      const newNodeId = Date.now();
      const newNodeName = `n${nodes.length}`;
      setNodes((prev) => [...prev, { id: newNodeId, lat, lng, name: newNodeName }]);
    }
  };

  const MapClickHandler = () => {
        useMapEvents({
        click: handleMapClick
        });
        return null;
    };

  const resolvePosition = (id) => {
    const node = nodes.find((n) => n.id === id);
    return [node.lat, node.lng];
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/getpaths/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch map data');
        }
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
    <Navbar></Navbar>
    <div className="subnavbar">
        <div>
            <span className="sub-title">Paths</span>
        </div>
    </div>
    <div className='paths-container'>
        <PathsSideBar className="bar-skip"></PathsSideBar>
        <div className='paths-content bar-skip'>
            <div className='paths-map'>
              <div className='map-wrapper'>
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
                      draggable={mode === 'move'}
                      >
                      {showNames && (
                        <Tooltip direction="top" offset={[0, -10]} permanent>
                          {node.name}
                        </Tooltip>
                      )}
                      </Marker>
                    
                    ))}

                    {robot_connections.map(([a, b], index) => (
                    <Polyline
                        key={index}
                        positions={[resolvePosition(a), resolvePosition(b)]}
                        color="red"
                    />
                    ))}

                    {drone_connections.map(([a, b], index) => (
                    <Polyline
                        key={index}
                        positions={[resolvePosition(a), resolvePosition(b)]}
                        color="blue"
                    />
                    ))}
                </MapContainer>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ marginLeft: '10px' }}>
                <input
                  type="checkbox"
                  checked={showNames}
                  onChange={(e) => setShowNames(e.target.checked)}
                />
                Show Node Names
              </label>
            </div>
        </div>

    </div>
</div>
  );
}

export default Paths;
