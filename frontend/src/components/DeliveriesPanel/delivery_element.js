import './delivery_element.css';

export default function Deliveryelement(props) {


    // Convierte la fecha recibida a un formato legible
    const created_atDate = new Date(props.delivery.created_at);
    const created_formattedDate = created_atDate.toLocaleDateString();
    const created_formattedTime = created_atDate.toLocaleTimeString();

    // Maneja la eliminación de deviceos
    const handleRemoveDevice = (deviceId) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            props.onRemoveDevice(deviceId);
        }
    };

    return (
        <div className='delivery-element'>
            <span className='delivery-title'>Delivery Information:</span>
            <span>Manager document id: {props.delivery.managerid}</span>
            <span>Client document id: {props.delivery.clientid}</span>
            <span>Created date: { created_formattedDate } - Time: {created_formattedTime}</span> {/* Fecha y hora legibles */}
            <span>Device Type: {props.delivery.device_type}</span>
            <span>Current State: {props.delivery.state}</span>
            <span>From: {props.delivery.start_name} To: {props.delivery.end_name}</span>
        </div>
    );
}
