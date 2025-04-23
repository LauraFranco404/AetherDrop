import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline,Tooltip  } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import map_icon1 from '../../icons/map_icon1.png';
import map_icon2 from '../../icons/map_icon2.png';
import Navbar from '../../components/Navbar/Navbar';
import DeliveriesSideBar from '../../components/DeliveriesPanel/deliveries_sidebar';
import { useEffect } from 'react';
import { getDistance } from 'geolib';

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

function CreateDeliveries() {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const [clientID, SetClientID] = useState("");

    const [mode, setMode] = useState('add');
    const [nodes, setNodes] = useState([]);
    const [robot_connections, setRobotConnections] = useState([]);
    const [drone_connections, setDroneConnections] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [connectionView, setConnectionView] = useState('drone');
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [shortestPath, setShortestPath] = useState([]);
  
    const handleMapClick = (e) => {};

    const handleStartDelivery = () => {
        if (!startNode || !endNode) return;
        
        fetch('http://127.0.0.1:8000/createdelivery/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              start_id: startNode.id,
              end_id: endNode.id,
              start_name: startNode.name,
              end_name: endNode.name,
              managerid: userData.documentid,
              clientid: Number(clientID),
              device_type: connectionView,
              state: "pending"
            }),
        })
            .then((res) => {
            if (!res.ok) throw new Error('Error starting delivery');
            return res.json();
            })
            .then(() => {
            alert('¡Entrega iniciada con éxito!');
            // Puedes limpiar los nodos si lo deseas:
            // setStartNode(null);
            // setEndNode(null);
            })
            .catch((err) => {
            alert('Error al iniciar entrega');
            console.error(err);
            });
        };

    const handleNodeClick = (node) => {
        if (!startNode) {
          setStartNode(node);
        } else if (!endNode && node.id !== startNode.id) {
          setEndNode(node);
        } else {
          setStartNode(node);
          setEndNode(null);
          setShortestPath([]);
        }
      };

    const handleCancel = () => {};
  
    const resolvePosition = (id) => {
      const node = nodes.find((n) => n.id === id);
      return [node.lat, node.lng];
    };
  
    const MapClickHandler = () => {
      useMapEvents({ click: handleMapClick });
      return null;
    };
  
    const handleSave = () => {
      const payload = {
        nodes: nodes.map(({ id, lat, lng, name }) => ({ id, lat, lng, name })),
        drone_connections,
        robot_connections,
      };
  
      fetch('http://127.0.0.1:8000/updatedronepaths/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => alert('Data saved successfully!'))
        .catch((err) => {
          alert('Error saving data');
          console.error(err);
        });
    };

    const buildGraph = (edges) => {
        const graph = {};
        edges.forEach(([a, b]) => {
          if (!graph[a]) graph[a] = [];
          if (!graph[b]) graph[b] = [];
          const posA = resolvePosition(a);
          const posB = resolvePosition(b);
          const dist = getDistance(
            { latitude: posA[0], longitude: posA[1] },
            { latitude: posB[0], longitude: posB[1] }
          );
          graph[a].push({ node: b, cost: dist });
          graph[b].push({ node: a, cost: dist });
        });
        return graph;
      };
    
      const dijkstra = (graph, start, end) => {
        const distances = {};
        const prev = {};
        const visited = new Set();
        const pq = [];
    
        nodes.forEach((n) => (distances[n.id] = Infinity));
        distances[start] = 0;
        pq.push({ node: start, dist: 0 });
    
        while (pq.length > 0) {
          pq.sort((a, b) => a.dist - b.dist);
          const { node } = pq.shift();
          if (visited.has(node)) continue;
          visited.add(node);
    
          for (const neighbor of graph[node] || []) {
            const alt = distances[node] + neighbor.cost;
            if (alt < distances[neighbor.node]) {
              distances[neighbor.node] = alt;
              prev[neighbor.node] = node;
              pq.push({ node: neighbor.node, dist: alt });
            }
          }
        }
    
        const path = [];
        let curr = end;
        while (curr !== undefined) {
          path.unshift(curr);
          curr = prev[curr];
        }
        console.log("Shortest path: ", path)
        return path.length > 1 ? path : [];
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
        .catch((err) => console.error('Error fetching initial map data:', err));
    }, []);

    useEffect(() => {
        if (startNode && endNode) {
          const connections =
            connectionView === 'drones' ? drone_connections : robot_connections;
          const graph = buildGraph(connections);
          const path = dijkstra(graph, startNode.id, endNode.id);
          setShortestPath(path);
        }
      }, [startNode, endNode, connectionView, drone_connections, robot_connections]);
  
      return (
        <div>
          <Navbar />
          <div className="subnavbar">
              <div>
                  <span className="sub-title">Deliveries Management</span>
              </div>
          </div>
          <div className="paths-container">
            <DeliveriesSideBar className="bar-skip" />
            <div className="paths-content bar-skip">
              <div className="paths-map">
                <div className="map-wrapper">
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
                      attribution="&copy; OpenStreetMap contributors"
                    />
      
                    {nodes.map((node) => (
                      <Marker
                        key={node.id}
                        position={[node.lat, node.lng]}
                        icon={
                          (startNode?.id === node.id || endNode?.id === node.id)
                            ? iconSelected
                            : iconDefault
                        }
                        eventHandlers={{ click: () => handleNodeClick(node) }}
                        draggable={mode === 'move'}
                      >
                        <Tooltip direction="top" offset={[0, -10]} permanent>
                          {node.name}
                        </Tooltip>
                      </Marker>
                    ))}
      
                    {connectionView === 'drone' &&
                      drone_connections.map(([a, b], index) => (
                        <Polyline
                          key={`drone-${index}`}
                          positions={[resolvePosition(a), resolvePosition(b)]}
                          color="blue"
                        />
                      ))}
      
                    {connectionView === 'robots' &&
                      robot_connections.map(([a, b], index) => (
                        <Polyline
                          key={`robot-${index}`}
                          positions={[resolvePosition(a), resolvePosition(b)]}
                          color="red"
                        />
                      ))}
      
                    {/* Ruta más corta */}
                    {shortestPath.length > 1 && (
                      <Polyline
                        positions={shortestPath.map((id) => resolvePosition(id))}
                        color="green"
                        weight={5}
                      />
                    )}
                  </MapContainer>
                </div>
              </div>
    
              <div style={{ margin: '10px 0' }}>
                <label style={{ marginRight: '10px' }}>Seleccionar dispositivo:</label>
                <select
                  value={connectionView}
                  onChange={(e) => {
                    setConnectionView(e.target.value);
                    setStartNode(null);
                    setEndNode(null);
                    setShortestPath([]);
                  }}
                >
                  <option value="drone">Drone</option>
                  <option value="robot">Robot</option>
                </select>
          
                <input placeholder='cliend id' type = "number"  value={clientID} onChange={(e)=> SetClientID(e.target.value)}></input>
                {startNode && endNode && clientID.length > 0 && (
                <div>
                    <p>Nodo inicial: {startNode.name}</p>
                    <p>Nodo final: {endNode.name}</p>
                    <button onClick={handleStartDelivery}>Start Delivery</button>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
  }
  

export default CreateDeliveries;