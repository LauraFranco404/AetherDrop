import { useState } from "react";
import Deliveryelement from "../../components/DeliveriesPanel/delivery_element";
import Navbar from "../../components/Navbar/Navbar";
import DeliveriesSideBar from "../../components/DeliveriesPanel/deliveries_sidebar";
import Managerspanel from "../../components/ManagersPanel/managers_panel";
import "./deliveries.css";

export default function SearchDeliveries() {
    const [managerId, setmanagerId] = useState("");          // State for input value
    const [deliveries, setDeliveries] = useState([]);                // State for deliveries data
    const [loading, setLoading] = useState(false);          // State for loading status
    const [error, setError] = useState("");                 // State for error messages

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();                                // Prevent default form submission
        if (!managerId) {
            setError("Please enter a valid manager ID.");    // Show error if no ID is entered
            return;
        }
        setLoading(true);                                  // Show loading indicator
        setError("");                                      // Clear previous error

        // Fetch deliveries data from API
        fetch(`http://127.0.0.1:8000/getdeliveriesbymanagerid/?managerid=${managerId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.deliveries) {
                    setDeliveries(data.deliveries);                  // Update deliveries data
                } else {
                    setError(data.error || "No deliveries found for this manager.");
                    setDeliveries([]);                          // Clear deliveries if none found
                }
            })
            .catch((err) => setError("Failed to fetch deliveries data."))
            .finally(() => setLoading(false));              // Hide loading indicator
    };

    return (
        <div>
            <Navbar />
            <div className="subnavbar">
                <div>
                    <span className="sub-title">Deliveries Management</span>
                </div>
            </div>
            <div className="deliveries-container">
                <DeliveriesSideBar className="bar-skip" />
                <div className="bar-skip fitright">
                    <div className="deliveries-content">
                        <h2 className="deliveries-title">Search Deliveries By manager ID</h2>
                        {/* Form to input manager ID */}
                        <form onSubmit={handleSubmit} className="manager-form">
                            <input
                                type="number"
                                placeholder="Enter manager ID"
                                value={managerId}
                                onChange={(e) => setmanagerId(e.target.value)}
                                className="manager-input"
                            />
                            <button type="submit" className="search-button">
                                Search Deliveries
                            </button>
                        </form>

                        {/* Show loading status */}
                        {loading && <p>Loading deliveries...</p>}

                        {/* Show error message if any */}
                        {error && <p className="error-message">{error}</p>}

                        {/* Render deliveries data */}
                        {deliveries.length > 0 && deliveries.map((delivery) => (
                            <Deliveryelement key={delivery._id} delivery={delivery} />
                        ))}

                        {/* Message if no deliveries found */}
                        {!loading && deliveries.length === 0 && !error && (
                            <p>No deliveries to display. Try searching with a different manager ID.</p>
                        )}
                    </div>
                </div>
                <div className="managers-panel">
                    <Managerspanel></Managerspanel>
                </div>
            </div>
        </div>
    );
}
