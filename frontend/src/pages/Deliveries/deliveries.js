import { Link } from "react-router-dom";
import Deliveryelement from "../../components/DeliveriesPanel/delivery_element";
import Navbar from "../../components/Navbar/Navbar";
import DeliveriesSideBar from "../../components/DeliveriesPanel/deliveries_sidebar";
import "./deliveries.css";
import { useState, useEffect } from "react";

export default function Deliveries() {
    const [filter, setFilter] = useState("all");        // Estado para el dropdown
    const [deliveries, setDeliveries] = useState([]);              // Estado para las ventas
    const [loading, setLoading] = useState(true);        // Estado para el indicador de carga

    // Maneja los cambios en el filtro del dropdown
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // Obtiene las ventas según el filtro seleccionado
    const fetchDeliveries = async () => {
        setLoading(true);  // Activa el indicador de carga
        let url = "";

        // Selecciona la URL según el filtro
        switch (filter) {
            case "pending":
                url = "http://127.0.0.1:8000/getpendingdeliveries/";
                break;
            case "inprogress":
                url = "http://127.0.0.1:8000/getinprogressdeliveries/";
                break;
            case "finished":
                url = "http://127.0.0.1:8000/getfinisheddeliveries/";
                break;
            case "all":
            default:
                url = "http://127.0.0.1:8000/getalldeliveries/";
                break;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                alert("Failed to fetch deliveries data!");
                setDeliveries([]);
            } else {
                const data = await response.json();
                setDeliveries(data || []);  // Asigna los datos obtenidos
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
            alert("Error fetching deliveries data!");
            setDeliveries([]);
        } finally {
            setLoading(false);  // Desactiva el indicador de carga
        }
    };

    // Efecto que ejecuta la consulta cada vez que cambia el filtro
    useEffect(() => {
        fetchDeliveries();
    }, [filter]);

    return (
        <div>
            <Navbar />
            <div className="subnavbar">
                <div>
                    <span className="sub-title">Deliveries Management</span>
                </div>
            </div>
            <div className="deliveries-container">
                <DeliveriesSideBar className="bar-skip"></DeliveriesSideBar>
                <div className="bar-skip fitright">
                    <div className="deliveries-content">
                        <div className="deliveries-header">
                            <h2 className="deliveries-title">Deliveries History</h2>
                            <select
                                className="deliveries-filter-dropdown"
                                value={filter}
                                onChange={handleFilterChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="inprogress">In Progress</option>
                                <option value="finished">Finished</option>
                                <option value="all">All</option>
                            </select>
                        </div>

                        {/* Muestra un mensaje de carga mientras se obtienen los datos */}
                        {loading ? (
                            <p>Loading deliveries...</p>
                        ) : (
                            deliveries.length > 0 ? (
                                deliveries.map((delivery, index) => (
                                    <Deliveryelement key={index} delivery={delivery} />
                                ))
                            ) : (
                                <p>No deliveries available for this filter.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
