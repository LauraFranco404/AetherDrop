import './devices_element.css';
import { useState } from 'react';

export default function Deviceselement(props) {
    // State to manage product amount locally
    const [amount, setAmount] = useState(props.product.amount);

    // Handle product deletion
    const handleRemoveProduct = () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            fetch("http://127.0.0.1:8000/removeproduct/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productid: props.product.productid })
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        alert("Error: " + data.error);
                    } else {
                        alert("Product deleted successfully!");
                        window.location.reload(); // Reload the page
                    }
                })
                .catch((error) => {
                    alert("Request error: " + error.message);
                });
        }
    };

    // Handle increase product amount using PATCH
    const handleIncreaseProduct = () => {
        fetch("http://127.0.0.1:8000/increaseproductbyone/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productid: props.product.productid })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert("Error: " + data.error);
                } else {
                    setAmount((prevAmount) => prevAmount + 1); // Update local state
                }
            })
            .catch((error) => {
                console.error("Request error:", error);
                alert("Request error: " + error.message);
            });
    };

    // Handle decrease product amount using PATCH
    const handleDecreaseProduct = () => {
        fetch("http://127.0.0.1:8000/decreaseproductbyone/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productid: props.product.productid })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert("Error: " + data.error);
                } else {
                    setAmount((prevAmount) => Math.max(prevAmount - 1, 0)); // Prevent negative amount
                }
            })
            .catch((error) => {
                console.error("Request error:", error);
                alert("Request error: " + error.message);
            });
    };

    return (
        <div className="element-container">
            <button className='remove-button' onClick={handleRemoveProduct}>X</button>
            <div>
                <span>{props.product.name}</span>
                <span>Product Id: {props.product.productid}</span>
                <span>Amount: {amount}</span>
                <span>Unit Price: {props.product.unitprice}</span>
            </div>
            <div className="increase-decrease-buttons">
                <button onClick={handleIncreaseProduct}>+</button>
                <button onClick={handleDecreaseProduct}>-</button>
            </div>
        </div>
    );
}
