import './delivery_element.css';

export default function Deliveryelement(props) {

    // Calcula el precio total
    const totalPrice = props.delivery.products.reduce((acc, product) => {
        return acc + product.amount * product.unitprice;
    }, 0);

    // Convierte la fecha recibida a un formato legible
    const deliveryDate = new Date(props.delivery.delivery_datetime);
    const formattedDate = deliveryDate.toLocaleDateString();
    const formattedTime = deliveryDate.toLocaleTimeString();

    // Maneja la eliminación de productos
    const handleRemoveProduct = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            props.onRemoveProduct(productId);
        }
    };

    return (
        <div className='delivery-element'>
            <span className='delivery-title'>Delivery Information:</span>
            <span>admin document id: {props.delivery.adminid}</span>
            <span>Client document id: {props.delivery.clientid}</span>
            <span>Date: {formattedDate} - Time: {formattedTime}</span> {/* Fecha y hora legibles */}
            <span className='delivery-title'>Products:</span>
            <table className='delivery-info'>
                <thead>
                    <tr>
                        <th className='delivery-title'>Product Id</th>
                        <th className='delivery-title'>Product Name</th>
                        <th className='delivery-title'>Amount</th>
                        <th className='delivery-title'>Unit Price</th>
                        {props.editable && <th className='delivery-title'>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {props.delivery.products.map((product) => (
                        <tr key={product.productid}>
                            <td>{product.productid}</td>
                            <td>{product.name}</td>
                            <td>{product.amount}</td>
                            <td>{product.unitprice}</td>
                            {props.editable && (
                                <td>
                                    <button
                                        className='remove-product-button'
                                        onClick={() => handleRemoveProduct(product.productid)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <span className='delivery-title'>Total: ${totalPrice.toFixed(2)}</span>
        </div>
    );
}
