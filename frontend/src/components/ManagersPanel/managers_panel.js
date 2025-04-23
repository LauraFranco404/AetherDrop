import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./managers_panel.css";

export default function Managerspanel(){
    const [managers, setmanagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/getallmanagers/")
        .then(response => response.json())
        .then(data => setmanagers(data.managers))
        .catch(error => setError("Failed to connect to the server"))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className="current-managers-container">
            <span className="current-managers-title">Current managers:</span>
            {loading && 
            <div className="loading-icon">
                <FontAwesomeIcon icon={faSpinner} spin/>
            </div>
            }
            {error && <span className="error-message">{error}</span>}
            {!loading && !error && managers.length === 0 && <span className="no-managers-message">There are no managers.</span>}
            <div className="current-managers">
                {
                    managers.map((manager) => (
                        <div key={manager.documentid} className="manager-info">
                            <span>Document ID: <span>{manager.documentid}</span></span>
                            <span>Names: <span>{manager.name}</span></span>
                            <span>Last Names: <span>{manager.lastname}</span></span>
                            <span>Birth date: <span>{manager.datebirth}</span></span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
