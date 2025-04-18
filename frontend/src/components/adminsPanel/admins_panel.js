import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./admins_panel.css";

export default function Adminspanel(){
    const [admins, setadmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/getalladmins/")
        .then(response => response.json())
        .then(data => setadmins(data.admins))
        .catch(error => setError("Failed to connect to the server"))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div className="current-admins-container">
            <span className="current-admins-title">Current admins:</span>
            {loading && 
            <div className="loading-icon">
                <FontAwesomeIcon icon={faSpinner} spin/>
            </div>
            }
            {error && <span className="error-message">{error}</span>}
            {!loading && !error && admins.length === 0 && <span className="no-admins-message">There are no admins.</span>}
            <div className="current-admins">
                {
                    admins.map((admin) => (
                        <div key={admin.documentid} className="admin-info">
                            <span>Document ID: <span>{admin.documentid}</span></span>
                            <span>Names: <span>{admin.name}</span></span>
                            <span>Last Names: <span>{admin.lastname}</span></span>
                            <span>Birth date: <span>{admin.datebirth}</span></span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
