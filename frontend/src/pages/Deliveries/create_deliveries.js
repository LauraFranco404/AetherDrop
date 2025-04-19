import { Link } from "react-router-dom";
import Deliveryelement from "../../components/DeliveriesPanel/delivery_element";
import Navbar from "../../components/Navbar/Navbar";
import DeliveriesSideBar from "../../components/DeliveriesPanel/deliveries_sidebar";
import "./deliveries.css";
import { useState } from "react";

export default function CreateDeliveries() {
    return (
        <div>
            <Navbar></Navbar>
            <div className="deliveries-container">
                <DeliveriesSideBar className="bar-skip"></DeliveriesSideBar>
            </div>
        </div>

    );
}
