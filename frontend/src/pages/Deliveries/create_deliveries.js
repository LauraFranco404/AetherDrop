import { Link } from "react-router-dom";
import Deliveryelement from "../../components/DeliveriesPanel/delivery_element";
import Navbar from "../../components/Navbar/Navbar";
import DeliveriesSideBar from "../../components/DeliveriesPanel/deliveries_sidebar";
import "./deliveries.css";
import { useState } from "react";

export default function CreateDeliveries() {
    // Estado para manejar los productos de la venta
    const userData = JSON.parse(sessionStorage.getItem("user"));

    const [delivery, setDelivery] = useState({
        adminid: userData["documentid"],
        clientid: 1,
        products: [],
    });

    // Estado para el ID del producto a agregar
    const [newProductId, setNewProductId] = useState(""); // Solo se guarda el ID ingresado

    // Maneja los cambios en el input del ID del producto
    const handleInputChange = (event) => {
        setNewProductId(event.target.value);
    };

    // Maneja la eliminación de productos
    const handleRemoveProduct = (productId) => {
        const updatedProducts = delivery.products.filter((product) => product.productid !== productId);
        setDelivery((prevDelivery) => ({
            ...prevDelivery,
            products: updatedProducts,
        }));
    };

    // Maneja el envío del formulario para agregar productos
    const handleAddProduct = async (event) => {
        event.preventDefault();

        if (newProductId) {
            try {
                // Realiza la consulta a la API para obtener los datos del producto
                const response = await fetch(`http://127.0.0.1:8000/getproductbyid/?productid=${newProductId}`);
                
                if (!response.ok) {
                    alert("Product not found!");
                    return;
                }

                const productData = await response.json();

                // Verifica si el producto ya está en la lista
                const existingProduct = delivery.products.find(product => product.productid === productData.product.productid);

                if (existingProduct) {
                    // Si el producto ya está, incrementa el amount en 1
                    const updatedProducts = delivery.products.map(product => 
                        product.productid === existingProduct.productid
                            ? { ...product, amount: product.amount + 1 }
                            : product
                    );
                    setDelivery(prevDelivery => ({
                        ...prevDelivery,
                        products: updatedProducts
                    }));
                } else {
                    // Si no está, lo agrega a la lista
                    setDelivery((prevDelivery) => ({
                        ...prevDelivery,
                        products: [
                            ...prevDelivery.products,
                            {
                                productid: productData.product.productid,
                                name: productData.product.name,
                                amount: 1, // Por defecto, agrega 1 unidad
                                unitprice: productData.product.unitprice,
                            },
                        ],
                    }));
                }

                setNewProductId(""); // Limpia el campo de ID

            } catch (error) {
                console.error("Error fetching product:", error);
                alert("Error fetching product data!");
            }
        } else {
            alert("Please enter a Product ID!");
        }
    };

    // Maneja el envío de la venta
    const handleFinishDelivery = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/sellproducts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(delivery),
            });

            if (response.ok) {
                alert("Delivery completed successfully!");
                setDelivery((prevDelivery) => ({
                    ...prevDelivery,
                    products: [], // Limpia los productos después de la venta
                }));
            } else {
                alert(`Delivery failed: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error sending delivery:", error);
            alert("Error sending delivery!");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="deliveries-container">
                <DeliveriesSideBar className="bar-skip"></DeliveriesSideBar>
                <div className="bar-skip fitright">
                    <div className="deliveries-content">
                        <h2 className="deliveries-title">Add Product to Delivery</h2>
                        <form className="product-form" onSubmit={handleAddProduct}>
                            <input
                                type="number"
                                name="productid"
                                placeholder="Product ID"
                                value={newProductId}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit">Add Product</button>
                        </form>
                        <Deliveryelement editable={true} delivery={delivery} onRemoveProduct={handleRemoveProduct} />
                        <button className="create-delivery-button" onClick={handleFinishDelivery}>Finish delivery</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
