import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Adminspanel from "../../components/adminsPanel/admins_panel";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import './admins_management.css';
import './admins_form.css';

export default function Updateadmin() {
    const [documentid, setDocumentid] = useState("");
    const [admin, setadmin] = useState(null);
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
            const response = await fetch(`http://127.0.0.1:8000/getadminbyid/?documentid=${documentid}`);
            const data = await response.json();
            console.log(data);
            if (!response.ok) throw new Error(data.error || "Failed to fetch admin");
            setadmin(data.admin);
        } catch (error) {
            setErrors({ fetch: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (admin) {
            setFormData({ name: admin.name || "", lastname: admin.lastname || "", datebirth: admin.datebirth || "", password: "", repeatPassword: "" });
        }
    }, [admin]);

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

        fetch("http://127.0.0.1:8000/updateadmin/", {
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
            setErrors(prevErrors => ({ ...prevErrors, server:  error.error || "An error occurred while updating the admin." }));
        })
        .finally(() => setUpdating(false));
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
                        <span>Update admin</span>
                    </div>
                    <div className="separator-line"></div>
                    <form autoComplete="off" onSubmit={handleSearch} className="panel-elements admins-form-container">
                        <input placeholder="Document ID number" value={documentid} onChange={(e) => setDocumentid(e.target.value)} />
                        {errors.documentid && <span className="error-message">{errors.documentid}</span>}
                        <button type="submit" disabled={loading}>{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Find"}</button>
                        {errors.fetch && <span className="error-message">{errors.fetch}</span>}
                    </form>
                    {admin && <div className="separator-line"></div>}
                    {admin && (
                    <form autoComplete="off" onSubmit={handleUpdate} className="panel-elements admins-form-container">
                        <input placeholder="admin names" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                        <input placeholder="admin last names" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
                        {errors.lastname && <span className="error-message">{errors.lastname}</span>}
                        <input placeholder="Birth date DD/MM/YYYY" value={formData.datebirth} onChange={(e) => setFormData({ ...formData, datebirth: e.target.value })} />
                        {errors.datebirth && <span className="error-message">{errors.datebirth}</span>}
                        <input type="password" placeholder="New password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        <input type="password" placeholder="Repeat new password" value={formData.repeatPassword} onChange={(e) => setFormData({ ...formData, repeatPassword: e.target.value })} />
                        {errors.repeatPassword && <span className="error-message">{errors.repeatPassword}</span>}
                        <button type="submit" disabled={updating}>{updating ? <FontAwesomeIcon icon={faSpinner} spin /> : "Update admin"}</button>
                        {errors.server && <span className="error-message">{errors.server}</span>}
                    </form>
                    )}
                </div>    
                <Adminspanel></Adminspanel>
            </div>
        </div>
    );
}