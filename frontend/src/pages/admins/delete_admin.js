import { useState } from "react";
import { Link } from "react-router-dom";
import Adminspanel from "../../components/adminsPanel/admins_panel";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import './admins_management.css';
import './admins_form.css';

export default function Deleteadmin() {
    const [documentid, setDocumentid] = useState("");
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setDocumentid(e.target.value);
        setError(""); // Clear error when user types
    };

    const validateForm = () => {
        if (!documentid.trim()) {
            setError("Document ID is required");
            return false;
        }
        if (isNaN(documentid)) {
            setError("Document ID must be a number");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setServerError("");
        
        const dataToSend = { documentid: Number(documentid) };

        fetch("http://127.0.0.1:8000/deleteadmin/", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status >= 400) {
                setServerError(body.error || "An error occurred while deleting the admin.");
            } else {
                console.log("Respuesta del servidor:", body);
                window.location.reload();
            }
        })
        .catch(error => {
            console.error("Error:", error);
            setServerError("A network error occurred.");
        })
        .finally(() => setLoading(false));
    };

    return (
        <div>
            <Navbar/>
            <div className="admins-container">
                <div className="panel-container">
                    <Link to="/admins/" className="button-goback">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <div className="title-container">
                        <span>Delete admin</span>
                    </div>
                    <div className="separator-line"></div>
                    <form autoComplete="off" onSubmit={handleSubmit} className="panel-elements admins-form-container">
                        <input 
                            placeholder="Document ID number" 
                            value={documentid} 
                            onChange={handleChange} 
                        />
                        {error && <span className="error-message">{error}</span>}
                        
                        <button type="submit" disabled={loading}>
                            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Delete admin"}
                        </button>
                        {serverError && <span className="error-message">{serverError}</span>}
                    </form>
                </div>    
                <Adminspanel />
            </div>
        </div>
    );
}
