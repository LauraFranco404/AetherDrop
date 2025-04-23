import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar/Navbar";
import './managers.css';
import './managers_form.css';

export default function Registermanager() {
    const [formData, setFormData] = useState({
        documentid: "",
        name: "",
        lastname: "",
        datebirth: "",
        password: "",
        repeatPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
        if (!formData.documentid.trim()) newErrors.documentid = "Document ID is required";
        else if (isNaN(formData.documentid)) newErrors.documentid = "Document ID must be a number";
        
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!formData.datebirth.trim()) newErrors.datebirth = "Birth date is required";
        else if (!dateRegex.test(formData.datebirth)) {
            newErrors.datebirth = "Birth date must be in format DD/MM/YYYY";
        } else {
            const [day, month, year] = formData.datebirth.split("/").map(Number);
            if (month < 1 || month > 12) newErrors.datebirth = "Month must be between 1 and 12";
            if (day < 1 || day > 31) newErrors.datebirth = "Day must be between 1 and 31";
        }
        
        if (!formData.password.trim()) newErrors.password = "Password is required";
        if (!formData.repeatPassword.trim()) newErrors.repeatPassword = "Please repeat the password";
        if (formData.password !== formData.repeatPassword) newErrors.repeatPassword = "Passwords do not match";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);

        const dataToSend = {
            documentid: Number(formData.documentid),
            name: formData.name,
            lastname: formData.lastname,
            datebirth: formData.datebirth,
            type: "manager",
            password: formData.password
        };

        fetch("http://127.0.0.1:8000/addmanager/", {
            method: "POST",
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
            setErrors(prevErrors => ({ ...prevErrors, server: error.message || error.error || "An error occurred while registering the manager." }));
        })
        .finally(() => setLoading(false));
    };

    return (
        <div>
            <Navbar />
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
                        <span>Register manager</span>
                    </div>
                    <div className="separator-line"></div>
                    <form autoComplete="off" onSubmit={handleSubmit} className="panel-elements managers-form-container">
                        <input name="name" placeholder="manager names" value={formData.name} onChange={handleChange} />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                        
                        <input name="lastname" placeholder="manager last names" value={formData.lastname} onChange={handleChange} />
                        {errors.lastname && <span className="error-message">{errors.lastname}</span>}
                        
                        <input name="documentid" placeholder="Document ID number" value={formData.documentid} onChange={handleChange} />
                        {errors.documentid && <span className="error-message">{errors.documentid}</span>}
                        
                        <input name="datebirth" placeholder="Birth date DD/MM/YYYY" value={formData.datebirth} onChange={handleChange} />
                        {errors.datebirth && <span className="error-message">{errors.datebirth}</span>}
                        
                        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        
                        <input name="repeatPassword" type="password" placeholder="Repeat password" value={formData.repeatPassword} onChange={handleChange} />
                        {errors.repeatPassword && <span className="error-message">{errors.repeatPassword}</span>}
                        
                        <button type="submit" disabled={loading}>
                            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Register manager"}
                        </button>
                        {errors.server && <span className="error-message">{errors.server}</span>}
                    </form>
                </div>
            </div>
        </div>
    );
}