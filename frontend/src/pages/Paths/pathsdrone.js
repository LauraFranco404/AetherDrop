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

function PathsDrone() {
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

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMode('add');
    setSelectedNode(null);
  };

  const handleNodeClick = (node) => {
    if (!editMode) return;

    if (mode === 'connect') {
      if (selectedNode && selectedNode.id !== node.id) {
        setDroneConnections((prev) => [...prev, [selectedNode.id, node.id]]);
        setSelectedNode(null);
      } else {
        setSelectedNode(node);
      }
    } else if (mode === 'delete') {
      setNodes((prev) => prev.filter((n) => n.id !== node.id));
      setDroneConnections((prev) => prev.filter(([a, b]) => a !== node.id && b !== node.id));
      setRobotConnections((prev) => prev.filter(([a, b]) => a !== node.id && b !== node.id));
    } else if (mode === 'move') {
      setSelectedNode(node);
    }
  };

  const handleDragStart = (e, node) => {
    if (mode === 'move') {
      draggedNodeRef.current = node.id;
    }
  };

  const handleDragging = (e, node) => {
    if (mode === 'move' && draggedNodeRef.current === node.id) {
      const { lat, lng } = e.target.getLatLng();
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id ? { ...n, lat, lng } : n
        )
      );
    }
  };

  const handleDragEnd = (e, node) => {
    if (mode === 'move' && draggedNodeRef.current === node.id) {
      const { lat, lng } = e.target.getLatLng();
      setNodes((prev) => prev.map((n) => n.id === node.id ? { ...n, lat, lng } : n));
      draggedNodeRef.current = null;
      setSelectedNode(null);
    }
  };

  const resolvePosition = (id) => {
    const node = nodes.find((n) => n.id === id);
    return [node.lat, node.lng];
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick
    });
    return null;
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedNode(null);
    setMode('add');
  };

  const handleSave = () => {
    const payload = {
      nodes: nodes.map(({ id, lat, lng, name }) => ({ id, lat, lng, name })),
      drone_connections: drone_connections,
      robot_connections: robot_connections
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
      alert('Data saved successfully!');
      setEditMode(false);
    })
    .catch(err => {
      alert('Error saving data');
      console.error(err);
    });
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
    <div className='paths-container'>
        <PathsSideBar className="bar-skip"></PathsSideBar>
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
                      eventHandlers={{
                        click: () => handleNodeClick(node),
                        dragstart: (e) => handleDragStart(e, node),
                        drag: (e) => handleDragging(e, node),
                        dragend: (e) => handleDragEnd(e, node),
                      }}
                      draggable={mode === 'move'}
                      >
                      {showNames && (
                        <Tooltip direction="top" offset={[0, -10]} permanent>
                          {node.name}
                        </Tooltip>
                      )}
                      </Marker>
                    
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
            <div style={{ marginBottom: '10px' }}>
              <button onClick={toggleEditMode}>{editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}</button>
              {editMode && (
                <>
                  <button onClick={() => setMode('add')}>Add Nodes</button>
                  <button onClick={() => setMode('connect')}>Connect Nodes</button>
                  <button onClick={() => setMode('delete')}>Delete Nodes</button>
                  <button onClick={() => setMode('move')}>Move Nodes</button>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                  
                </>
              )}
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

export default PathsDrone;
