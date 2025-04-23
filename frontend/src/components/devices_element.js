import './devices_element.css';
import { useState } from 'react';

export default function Deviceselement(props) {
    const { device } = props;
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const isAdmin = userData?.type === "admin";

    // Handle device deletion
    const handleRemoveDevice = () => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            fetch("http://127.0.0.1:8000/removedevice/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ deviceid: device.deviceid })
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        alert("Error: " + data.error);
                    } else {
                        alert("Device deleted successfully!");
                        window.location.reload(); // Reload the page
                    }
                })
                .catch((error) => {
                    alert("Request error: " + error.message);
                });
        }
    };

    return (
        <div className="element-container">
            {isAdmin && <button className='remove-button' onClick={handleRemoveDevice}>X</button>}
            
            <div>
                <span>{device.name}</span>
                <span>Device ID: {device.deviceid}</span>
                <span>Type: {device.type}</span>
                <span>Latitude: {device.lat}</span>
                <span>Longitude: {device.lng}</span>
                <span>Battery: {device.battery}</span>
                <span>State: {device.state}</span>
            </div>
        </div>
    );
}
