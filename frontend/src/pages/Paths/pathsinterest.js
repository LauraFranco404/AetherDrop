import './paths.css';
import Navbar from "../../components/Navbar/Navbar";
import PathsSideBar from '../../components/Paths/paths_sidebar';

export default function PathsInterestPoints()
{
    return (
        <div>
            <Navbar></Navbar>
            <div className='paths-container'>
                <PathsSideBar className="bar-skip"></PathsSideBar>
                <div className='paths-content bar-skip'>
                    <div className='paths-map'>
                        <div className='paths-map-container'>
                            {/*mostrar mapa aqui */}
                            xddd
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}