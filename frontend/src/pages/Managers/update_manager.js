import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Managerspanel from "../../components/ManagersPanel/managers_panel";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import './managers.css';
import './managers_form.css';

export default function Updatemanager() {
    const [documentid, setDocumentid] = useState("");
    const [manager, setmanager] = useState(null);
    const [formData, setFormData] = useState({ name: "", lastname: "", datebirth: "", password: "", repeatPassword: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const validateForm = () => {
        let newErrors = {};
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        
        if (!documentid.trim()) newErrors.documentid = "Document ID is required";
        if (isNaN(documentid)) newErrors.documentid = "Document ID must be a number";
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
        if (!formData.datebirth.trim()) newErrors.datebirth = "Birth date is required";
        else if (!dateRegex.test(formData.datebirth)) {
            newErrors.datebirth = "Birth date must be in format DD/MM/YYYY";
        } else {
            const [day, month, year] = formData.datebirth.split("/").map(Number);
            if (month < 1 || month > 12) newErrors.datebirth = "Month must be between 1 and 12";
            if (day < 1 || day > 31) newErrors.datebirth = "Day must be between 1 and 31";
        }
        if (!formData.password.trim()) newErrors.password = "Password is required";
        if (formData.password !== formData.repeatPassword) newErrors.repeatPassword = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!documentid.trim() || isNaN(documentid)) {
            setErrors({ documentid: "Invalid Document ID" });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/getmanagerbyid/?documentid=${documentid}`);
            const data = await response.json();
            console.log(data);
            if (!response.ok) throw new Error(data.error || "Failed to fetch manager");
            setmanager(data.manager);
        } catch (error) {
            setErrors({ fetch: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (manager) {
            setFormData({ name: manager.name || "", lastname: manager.lastname || "", datebirth: manager.datebirth || "", password: "", repeatPassword: "" });
        }
    }, [manager]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setUpdating(true);

        const dataToSend = {
            documentid: Number(documentid),
            name: formData.name,
            lastname: formData.lastname,
            datebirth: formData.datebirth,
            password: formData.password
        };

        fetch("http://127.0.0.1:8000/updatemanager/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                throw data;
            }
            window.location.reload();
        })
        .catch(error => {
            console.error("SV Error:", error);
            setErrors(prevErrors => ({ ...prevErrors, server:  error.error || "An error occurred while updating the manager." }));
        })
        .finally(() => setUpdating(false));
    };

    return (
        <div>
            <Navbar/>
            <div className="subnavbar">
                <div>
                    <span className="sub-title">Managers</span>
                </div>
            </div>
            <div className="managers-container">
                <div className="panel-container">
                    <Link to="/managers/" className="button-goback">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <div className="title-container">
                        <span>Update manager</span>
                    </div>
                    <div className="separator-line"></div>
                    <form autoComplete="off" onSubmit={handleSearch} className="panel-elements managers-form-container">
                        <input placeholder="Document ID number" value={documentid} onChange={(e) => setDocumentid(e.target.value)} />
                        {errors.documentid && <span className="error-message">{errors.documentid}</span>}
                        <button type="submit" disabled={loading}>{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Find"}</button>
                        {errors.fetch && <span className="error-message">{errors.fetch}</span>}
                    </form>
                    {manager && <div className="separator-line"></div>}
                    {manager && (
                    <form autoComplete="off" onSubmit={handleUpdate} className="panel-elements managers-form-container">
                        <input placeholder="manager names" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                        <input placeholder="manager last names" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
                        {errors.lastname && <span className="error-message">{errors.lastname}</span>}
                        <input placeholder="Birth date DD/MM/YYYY" value={formData.datebirth} onChange={(e) => setFormData({ ...formData, datebirth: e.target.value })} />
                        {errors.datebirth && <span className="error-message">{errors.datebirth}</span>}
                        <input type="password" placeholder="New password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        <input type="password" placeholder="Repeat new password" value={formData.repeatPassword} onChange={(e) => setFormData({ ...formData, repeatPassword: e.target.value })} />
                        {errors.repeatPassword && <span className="error-message">{errors.repeatPassword}</span>}
                        <button type="submit" disabled={updating}>{updating ? <FontAwesomeIcon icon={faSpinner} spin /> : "Update manager"}</button>
                        {errors.server && <span className="error-message">{errors.server}</span>}
                    </form>
                    )}
                </div>    
                <Managerspanel></Managerspanel>
            </div>
        </div>
    );
}