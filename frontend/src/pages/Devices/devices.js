import "./devices.css";
import Navbar from "../../components/Navbar/Navbar";
import Deviceselement from "../../components/devices_element";
import { useState, useEffect } from "react";

export default function Storedevices() {
    const [isMenuVisible, setMenuVisible] = useState(false); // State to control menu visibility
    const [elements, setElements] = useState([]); // State for products
    const [formData, setFormData] = useState({
        productid: "",
        name: "",
        amount: "",
        unitprice: ""
    }); // State for form data

    // Fetch products from the API
    useEffect(() => {
        fetch("http://127.0.0.1:8000/getallproducts/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products. Status code: " + response.status);
                }
                return response.json();
            })
            .then((data) => {
                setElements(data.products); // Save products to state
            })
            .catch((error) => {
                console.error(error);
                alert("There was a problem loading the products: " + error.message);
            });
    }, []); // Runs only once when the component mounts

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible); // Toggle menu visibility
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Submit form data
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload

        // Validate if numeric fields are valid
        if (
            isNaN(formData.productid) || formData.productid.trim() === "" ||
            isNaN(formData.amount) || formData.amount.trim() === "" ||
            isNaN(formData.unitprice) || formData.unitprice.trim() === ""
        ) {
            alert("Please enter valid numeric values.");
            return;
        }

        // Convert numeric fields to numbers
        const dataToSend = {
            productid: parseInt(formData.productid),
            name: formData.name,
            amount: parseInt(formData.amount),
            unitprice: parseFloat(formData.unitprice)
        };

        fetch("http://127.0.0.1:8000/createproduct/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        })
            .then((response) => {
                return response.json().then((data) => ({
                    status: response.status,
                    message: data.message || "Product created successfully.",
                    error: data.error || null
                }));
            })
            .then((result) => {
                if (result.error) {
                    alert("Error: " + result.error + " | Status code: " + result.status);
                } else {
                    alert(result.message + " | Status code: " + result.status);
                }
                setFormData({ productid: "", name: "", amount: "", unitprice: "" }); // Clear form
                window.location.reload(); // Reload the page
            })
            .catch((error) => {
                console.error("Request error:", error);
                alert("Request error: " + error.message);
            });
    };

    return (
        <div>
            <Navbar />
            <div className="subnavbar">
                <div>
                    <span className="devices-title">Devices Management</span>
                </div>
                <div>
                    <button
                        className={isMenuVisible ? "create-product-button-pressed" : "create-product-button"}
                        onClick={toggleMenu}
                    >
                        Create Product
                    </button>
                </div>
            </div>
            <div className="devices-container">
                <div className="elements-container">
                    {elements.length > 0 ? (
                        elements.map((product) => (
                            <Deviceselement key={product.productid} product={product} />
                        ))
                    ) : (
                        <p>Loading products...</p>
                    )}
                </div>
                {isMenuVisible && (
                    <div className="create-product-menu">
                        <span className="create-product-title">Create Product</span>
                        <div className="separator-line"></div>
                        <form onSubmit={handleSubmit}>
                            <input
                                name="productid"
                                placeholder="Product ID"
                                type="number"
                                value={formData.productid}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="name"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="amount"
                                placeholder="Product Amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="unitprice"
                                placeholder="Unit Price"
                                type="number"
                                step="0.01"
                                value={formData.unitprice}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit" className="create-product-button">
                                Create Product
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
