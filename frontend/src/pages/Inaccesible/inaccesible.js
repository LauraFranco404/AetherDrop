import { Link } from "react-router-dom";
import "./inaccessible.css";

export default function Inaccessible() {
    return (
        <div className="inaccesible-container">
            <h1 className="inaccesible-title">Inaccessible Page</h1>
            <span className="inaccesible-message">You do not have permission to access this page.</span>
            <span className="inaccesible-message">Please <Link to="/login" className="inaccesible-link">log in</Link> to continue.</span>
        </div>
    );
}
