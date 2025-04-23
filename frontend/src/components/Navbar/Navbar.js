import { useEffect, useState } from "react";
import styles from './Navbar.module.css';
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();
    const isAdmin = userData?.type === "admin";

    const location = useLocation();
    const [selectedLink, setSelectedLink] = useState();
    const [menuOpen, setMenuOpen] = useState(false);
    const managersActive = location.pathname.startsWith("/managers");
    const deliveriesActive = location.pathname.startsWith("/deliveries");
    const pathsActive = location.pathname.startsWith("/paths");

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        navigate("/");
        window.location.reload(); // Forzar recarga
    };

    useEffect(() => {
        setSelectedLink(location.pathname);
    }, [location.pathname]);

    return (
        <div className={styles.navbarContainer}>
            <Link to="/">
                <img src="/POS_icon.png" alt="POS Logo" className={styles.iconStyle} />
            </Link>
            <Link to={"/"} className={`${styles.navItem} ${selectedLink === "/" || selectedLink === "/home"? styles.selectedItem : ""}`}>
                Home
            </Link>
            {isAdmin &&
                <Link to={"/managers"} className={`${styles.navItem} ${managersActive ? styles.selectedItem : ""}`}>
                    Managers
                </Link>
            }
            {userData &&
                <Link to={"/devices"} className={`${styles.navItem} ${selectedLink === "/devices" ? styles.selectedItem : ""}`}>
                    Devices
                </Link>
            }
            {isAdmin &&
                <Link to={"/paths"} className={`${styles.navItem} ${pathsActive ? styles.selectedItem : ""}`}>
                    Paths
                </Link>
            }
            {userData &&
                <Link to={"/deliveries"} className={`${styles.navItem} ${deliveriesActive ? styles.selectedItem : ""}`}>
                    Deliveries
                </Link>
            }
            {userData ? (
                <div className={styles.userMenu} onMouseLeave={() => setMenuOpen(false)}>
                <button onClick={() => setMenuOpen(!menuOpen)} className={styles.userButton}>
                    {userData.name}
                </button>
                {menuOpen && (
                    <div className={styles.dropdownMenu}>
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Lastname:</strong> {userData.lastname}</p>
                        <p><strong>Document ID:</strong> {userData.documentid}</p>
                        <p><strong>Type:</strong> {userData.type}</p>
                        <button 
                            onClick={handleLogout} 
                            className={styles.logoutButton}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
            ) : (
                <Link to={"/login"} className={`${styles.loginButton}`}>
                    Login
                </Link>
            )}
        </div>
    );
}