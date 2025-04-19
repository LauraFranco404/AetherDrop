import './delivery_element.css';

export default function Deliveryelement(props) {


    // Convierte la fecha recibida a un formato legible
    const deliveryDate = new Date(props.delivery.delivery_datetime);
    const formattedDate = deliveryDate.toLocaleDateString();
    const formattedTime = deliveryDate.toLocaleTimeString();

    // Maneja la eliminación de deviceos
    const handleRemoveDevice = (deviceId) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            props.onRemoveDevice(deviceId);
        }
    };

    return (
        <div className='delivery-element'>
            <span className='delivery-title'>Delivery Information:</span>
            <span>admin document id: {props.delivery.adminid}</span>
            <span>Client document id: {props.delivery.clientid}</span>
            <span>Date: {formattedDate} - Time: {formattedTime}</span> {/* Fecha y hora legibles */}
            <span className='delivery-title'>Devices:</span>
            <table className='delivery-info'>
                <thead>
                    <tr>
                        <th className='delivery-title'>Device Id</th>
                        <th className='delivery-title'>Device Name</th>
                        {props.editable && <th className='delivery-title'>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {props.delivery.devices ? props.delivery.devices.map((device) => (
                        <tr key={device.deviceid}>
                            <td>{device.deviceid}</td>
                            <td>{device.name}</td>
                            {props.editable && (
                                <td>
                                    <button
                                        className='remove-device-button'
                                        onClick={() => handleRemoveDevice(device.deviceid)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            )}
                        </tr>
                    )): <div></div>}
                </tbody>
            </table>
        </div>
    );
}
