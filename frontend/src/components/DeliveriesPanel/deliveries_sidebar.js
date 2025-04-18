import './deliveries_sidebar.css'
import { Link, useLocation } from "react-router-dom";
import { useState } from 'react';

export default function DeliveriesSideBar(props){
    const location = useLocation().pathname;

    return (
        <div className={props.className}>
            <div className="deliveries-sidebar ">
                <h2>Deliveries Panel</h2>
                <Link to = "/deliveries" className={"tab "+(location === "/deliveries" ? "selected-tab" : "no-selected-tab")}>Previous Deliveries</Link>
                <Link to = "/deliveries/createdeliveries" className={"tab "+(location === "/deliveries/createdeliveries" ? "selected-tab" : "no-selected-tab")}>Create Deliveries</Link>
                <Link to = "/deliveries/searchdeliveries" className={"tab "+(location === "/deliveries/searchdeliveries" ? "selected-tab" : "no-selected-tab")}>Search Deliveries</Link>
            </div>
        </div>
    )
}
