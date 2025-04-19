import "./home.css"
import Navbar from "../../components/Navbar/Navbar";
import {Link, useLocation} from "react-router-dom";
import MapView from '../../components/Map/MapDevices';

const puntosEjemplo = [
  { type: 'drone', lat: 3.3469, lng: -76.5325, info: 'Dron en misión A' },
  { type: 'robot', lat: 3.3475, lng: -76.5336, info: 'Robot inspeccionando' },
];

function Home() {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const isAdmin = userData?.type === "admin";
    const isLoggedIn = userData?true:false;

    return (
      <div>
        <Navbar/>
        { !isLoggedIn && 
        <div className="container">
          <div className="text-container">
            <span>Welcome!</span>
            <span>This is AetherDrop created for Processes and Software Design.</span>
            <span>Click <Link to={"/login"} className="login-link">here</Link> to log in the system.</span>
          </div>
        </div> 
        }
        { isAdmin && 
        <div className="container">
          <div className="text-container">
            <span>Welcome, Admin!</span>
            <span>This is AetherDrop created for Processes and Software Design.</span>
            <span>Click <Link to={"/admins"} className="login-link">here</Link> to administrate admins. Or Click <Link to={"/devices"} className="login-link">here</Link> to administrate devices.</span>
          
          </div>
        </div> 
        }
        { isLoggedIn && !isAdmin &&
        <div className="container">
          <div className="text-container">
            <span>Welcome, Admin!</span>
            <span>This is the  Delivery (POS) created for Processes and Software Design.</span>
            <span>Click <Link to={"/deliveries"} className="login-link">here</Link> to administrate deliveries.</span>
          
          </div>
        </div> 
        }
      </div>
    )
  };
  
  export default Home;
  