import "./devices.css";
import Navbar from "../../components/Navbar/Navbar";
import Deviceselement from "../../components/devices_element";
import { useState, useEffect } from "react";
import MapDevices from "../../components/Map/MapDevices";


export default function Storedevices() {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const isAdmin = userData?.type === "admin";

    const [isMenuVisible, setMenuVisible] = useState(false); // State to control menu visibility
    const [elements, setElements] = useState([]); // State for devices
    const [formData, setFormData] = useState({
        deviceid: "",
        name: "",
        type: "drone",
        lat: 3.347133,
        lng: -76.533004,
        state: "available",
        battery: 100
    });
    // Fetch devices from the API
    useEffect(() => {
        fetch("http://127.0.0.1:8000/getalldevices/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch devices. Status code: " + response.status);
                }
                return response.json();
            })
            .then((data) => {
                setElements(data.devices); // Save devices to state
            })
            .catch((error) => {
                console.error(error);
                alert("There was a problem loading the devices: " + error.message);
            });
    }, []); // Runs only once when the component mounts

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible); // Toggle menu visibility
    };


    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: parseFloat(value)
        }));
    };
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    

    // Submit form data
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload

        // Validate if numeric fields are valid
        if (
            isNaN(formData.deviceid) || formData.deviceid.trim() === ""
        ) {
            alert("Please enter valid numeric values.");
            return;
        }

        // Convert numeric fields to numbers
        const dataToSend = {
            deviceid: parseInt(formData.deviceid),
            name: formData.name,
            type: formData.type,
            lat: formData.lat,
            lng: formData.lng,
            state: formData.state,
            battery: formData.battery,
        };
        

        fetch("http://127.0.0.1:8000/createdevice/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        })
            .then((response) => {
                return response.json().then((data) => ({
                    status: response.status,
                    message: data.message || "Device created successfully.",
                    error: data.error || null
                }));
            })
            .then((result) => {
                if (result.error) {
                    alert("Error: " + result.error + " | Status code: " + result.status);
                } else {
                    alert(result.message + " | Status code: " + result.status);
                }
                setFormData({ deviceid: "", name: "" }); // Clear form
                window.location.reload(); // Reload the page
            })
            .catch((error) => {
                console.error("Request error:", error);
                alert("Request error: " + error.message);
            });
    };

    return (
        <div>
            <Navbar />
            <div className="subnavbar">
                <div>
                    <span className="devices-title">Devices Management</span>
                </div>
                {isAdmin && <div>
                    
                    <button
                        className={isMenuVisible ? "create-device-button-pressed" : "create-device-button"}
                        onClick={toggleMenu}
                    >
                        Create Device
                    </button>
                </div>}
            </div>
            <div className="devices-container">
                <div className="devices-location">
                    <div className="stickymap-container">
                        <MapDevices points={elements} />
                    </div>
                </div>
                <div className="elements-container">
                    {elements.length > 0 ? (
                        elements.map((device) => (
                            <Deviceselement key={device.deviceid} device={device} />
                        ))
                    ) : (
                        <p>Loading devices...</p>
                    )}
                </div>
                {isMenuVisible && (
                    <div className="create-device-menu">
                    <span className="create-device-title">Create Device</span>
                    <div className="separator-line"></div>
                    <form onSubmit={handleSubmit}>
                    <input
                        name="deviceid"
                        placeholder="Device ID"
                        type="number"
                        value={formData.deviceid}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        name="name"
                        placeholder="Device Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                    >
                        <option value="drone">Drone</option>
                        <option value="robot">Robot</option>
                    </select>

                    <label>
                        Latitud: {formData ? formData.lat: 0}
                        <input
                            type="range"
                            name="lat"
                            min={3.347133 - 0.005}
                            max={3.347133 + 0.005}
                            step={0.00001}
                            value={formData.lat}
                            onChange={handleSliderChange}
                        />
                    </label>
                    <label>
                        Longitud: {formData ? formData.lng: 0}
                        <input
                            type="range"
                            name="lng"
                            min={-76.533004 - 0.005}
                            max={-76.533004 + 0.005}
                            step={0.00001}
                            value={formData.lng}
                            onChange={handleSliderChange}
                        />
                    </label>

                    <button type="submit" className="create-device-button">
                        Create Device
                    </button>
                </form>

                </div>
                )}
            </div>
        </div>
    );
}
