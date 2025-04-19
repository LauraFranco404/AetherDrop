import './paths.css';
import Navbar from "../../components/Navbar/Navbar";
import PathsSideBar from '../../components/Paths/paths_sidebar';
import MapDevices from '../../components/Map/MapDevices';

export default function Paths()
{
    return (
        <div>
            <Navbar></Navbar>
            <div className='paths-container'>
                <PathsSideBar className="bar-skip"></PathsSideBar>
                <div className='paths-content bar-skip'>
                    <div className='paths-map'>
                        <div className='paths-map-container'>
                            <MapDevices></MapDevices>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}