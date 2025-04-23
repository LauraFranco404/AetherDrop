import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar/Navbar";
import './managers.css'

export default function ManagersManagement(){
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
                    <div className="title-container">
                        <span>Managers Administration</span>
                    </div>
                    <div className="separator-line"></div>
                    <ul className="panel-elements">
                        <li><Link to="/managers/registermanager">Register manager<span>&gt;</span></Link></li>
                        <li><Link to="/managers/deletemanager">Delete manager<span>&gt;</span></Link></li>
                        <li><Link to="/managers/updatemanager">Update manager<span>&gt;</span></Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}