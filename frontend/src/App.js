import './App.css';
import Home from "./pages/Home/home";
import Registermanager from './pages/Managers/register_manager';
import Deletemanager from './pages/Managers/delete_manager';
import Updatemanager from './pages/Managers/update_manager';
import Devices from './pages/Devices/devices';
import { Routes, Route, Navigate } from "react-router-dom";
import ManagersManagement from './pages/Managers/managers';
import Deliveries from './pages/Deliveries/deliveries';
import NotFound from './pages/NotFound/not_found';
import Login from './pages/Login/login';
import CreateDeliveries from './pages/Deliveries/create_deliveries';
import SearchDeliveries from './pages/Deliveries/search_deliveries';
import Inaccessible from './pages/Inaccesible/inaccesible';
import Paths from './pages/Paths/paths'
import PathsDrone from './pages/Paths/pathsdrone';
import PathsRobot from './pages/Paths/pathsrobot';
import PathsInterestPoints from './pages/Paths/pathsinterest';
import { useState, useEffect } from 'react';

function App() {
  // Estado para manejar los datos del usuario
  const [userData, setUserData] = useState(JSON.parse(sessionStorage.getItem("user")));
  let isAdmin = userData?.type === "admin";
  let isLoggedIn = !!userData;
  //const isLoggedIn = true;
  // Actualizar userData cuando cambia sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserData(JSON.parse(sessionStorage.getItem("user")));
    };

    // Detectar cambios en sessionStorage
    window.addEventListener("storage", handleStorageChange);

    // También actualizar cuando el componente se renderiza
    setUserData(JSON.parse(sessionStorage.getItem("user")))
    // Cleanup del event listener
    isAdmin = userData?.type === "admin";
    //const isManager = true;
    isLoggedIn = !!userData;
    //const isLoggedIn = true;
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

 

  console.log(userData);

  return (
    <div className='App'>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route index element={<Home />} />
        {/* Inaccesibles sin logearse */}
        <Route path="/deliveries" element={isLoggedIn ? <Deliveries /> : <Inaccessible />} />
        <Route path="/deliveries/createdeliveries" element={isLoggedIn ? <CreateDeliveries /> : <Inaccessible />} />
        <Route path="/deliveries/searchdeliveries" element={isLoggedIn ? <SearchDeliveries /> : <Inaccessible />} />
        <Route path="/devices" element={isLoggedIn ? <Devices /> : <Inaccessible />} />
        {/* Inaccesibles sin logearse y sin ser manager */}
        <Route path="/managers" element={isAdmin ? <ManagersManagement /> : <Inaccessible />} />
        <Route path="/managers/registermanager" element={isAdmin ? <Registermanager /> : <Inaccessible />} />
        <Route path="/managers/deletemanager" element={isAdmin ? <Deletemanager /> : <Inaccessible />} />
        <Route path="/managers/updatemanager" element={isAdmin ? <Updatemanager /> : <Inaccessible />} />
        <Route path="/paths" element={isAdmin? <Paths/>:<Inaccessible/>}/>
        <Route path="/paths/pathsdrone" element={isAdmin? <PathsDrone/>:<Inaccessible/>}/>
        <Route path="/paths/pathsrobot" element={isAdmin? <PathsRobot/>:<Inaccessible/>}/>
        <Route path="/paths/pathsinterest" element={isAdmin? <PathsInterestPoints/>:<Inaccessible/>}/>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
