import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar/Navbar";
import './admins_management.css'

export default function AdminsManagement(){
    return (
        <div>
            <Navbar/>
            <div className="admins-container">
                <div className="panel-container">
                    <div className="title-container">
                        <span>Admins Management</span>
                    </div>
                    <div className="separator-line"></div>
                    <ul className="panel-elements">
                        <li><Link to="/admins/registeradmin">Register admin<span>&gt;</span></Link></li>
                        <li><Link to="/admins/deleteadmin">Delete admin<span>&gt;</span></Link></li>
                        <li><Link to="/admins/updateadmin">Update admin<span>&gt;</span></Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}