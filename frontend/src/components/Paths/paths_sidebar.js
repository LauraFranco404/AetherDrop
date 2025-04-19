import './paths_sidebar.css'
import { Link, useLocation } from "react-router-dom";
import { useState } from 'react';

export default function PathsSideBar(props){
    const location = useLocation().pathname;

    return (
        <div className={props.className}>
            <div className="paths-sidebar ">
                <h2>Paths Management</h2>
                <Link to = "/paths" className={"tab "+(location === "/paths" ? "selected-tab" : "no-selected-tab")}>Current Paths</Link>
                <Link to = "/paths/pathsrobot" className={"tab "+(location === "/paths/pathsrobot" ? "selected-tab" : "no-selected-tab")}>Create Robot Paths</Link>
                <Link to = "/paths/pathsdrone" className={"tab "+(location === "/paths/pathsdrone" ? "selected-tab" : "no-selected-tab")}>Create Drone Paths</Link>
                <Link to = "/paths/pathsinterest" className={"tab "+(location === "/paths/pathsinterest" ? "selected-tab" : "no-selected-tab")}>Create Interest Points</Link>
            </div>
        </div>
    )
}
