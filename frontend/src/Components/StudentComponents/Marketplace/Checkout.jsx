import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function Checkout({user}) {
    const {productId} = useParams();
    const navigate = useNavigate();
    const [cartProducts, setCartProducts] = useState([]);

    const [formData, setFormData] = useState({
        fromCart: productId == "cart",
        deliveryAddress: user.student_address,
        customerMobileNo: user.student_mobile_no,
        customerEmail: user.student_email,
        paymentMethod: "Cash On Delivary",
        products: []
    });

    function updateQuantity(index, e) {
        const { value } = e.target;
        
        if(value <= 0) {
            alert("Quantity cannot be below then 1!")
        }
        else {
            setFormData((prev) => {
                const updatedProducts = [...prev.products];
                
                updatedProducts[index] = {
                    ...updatedProducts[index],
                    productQuantity: parseInt(value) 
                };
        
                return {
                    ...prev,
                    products: updatedProducts
                };
            });
        }
    }
    
    function calculateTotalPrice() {
        return (formData.products.reduce((total, product) => 
            total + (product.productPrice * product.productQuantity), 0))
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(function(oldFormData) {
            return {
                ...oldFormData,
                [name]: value,
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/student/marketplace/checkout", formData)
        .then((res) => {
          if (res.data.status === "Success") {
            alert("Checkout successfully completed! Please wait for delivery.");
            navigate(-1);
          } else {
            console.log(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        if(productId == "cart") {
            axios
            .get("http://localhost:3000/student/marketplace/cart")
            .then((res) => {
                console.log("Success");
                const cartProducts = res.data?.products || [];

                setFormData(function(prev) {
                    return {
                        ...prev,
                        products: [],
                    }
                });

                cartProducts.forEach(product => {
                    setFormData(function(prev) {
                        return {
                            ...prev,
                            products: [...prev.products, {
                                productId: product.product_id,
                                productName: product.product_name,
                                productPrice: product.product_price,
                                productQuantity: 1
                            }],
                        }
                    });
                });
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
        } else {
            axios
            .get("http://localhost:3000/student/marketplace/product/"+productId)
            .then((res) => {
                console.log("Success");
                const cartProduct = res.data?.product || [];

                setFormData(function(prev) {
                    return {
                        ...prev,
                        products: [{
                            productId: cartProduct.product_id,
                            productName: cartProduct.product_name,
                            productPrice: cartProduct.product_price,
                            productQuantity: 1
                        }],
                    }
                });
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
        }
    }, []);

    return (
        <div className="mainContent">
            <Header title={"Checkout"}/>
            <div className="formBoxContainer">
                <div className="formBox">
                    <form onSubmit={handleSubmit}>
                        <div className="productList">
                            <div className="title">Product Details</div>
                            <table>
                                <thead>
                                    <tr>
                                        <td>Product Name</td>
                                        <td>Price Per Unit</td>
                                        <td>Quantity</td>
                                        <td>Price</td>
                                    </tr>
                                </thead>
                                {formData.products.map(function(product, index){
                                    return (
                                        <tr>
                                            <td>{product.productName}</td>
                                            <td>{product.productPrice}৳</td>
                                            <td className="fixedWidth"><input onChange={(e)=>updateQuantity(index, e)} value={product.productQuantity} type="number"/></td>
                                            <td>{product.productPrice*product.productQuantity}৳</td>
                                        </tr>
                                    )
                                })}
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Total</td>
                                        <td>{calculateTotalPrice()}৳</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="title">Billing Details</div>
                        <div className="input">
                            <label name="communityName">Your Mobile Number</label>
                            <input 
                                name="customerMobileNo" 
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter your mobile number"
                                value = {formData.customerMobileNo}
                            />
                        </div>
                        <div className="input">
                            <label name="communityName">Your Email</label>
                            <input 
                                name="customerEmail" 
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter your email"
                                value = {formData.customerEmail}
                            />
                        </div>
                        <div className="input">
                            <label htmlFor="communityDescription">Delivery Address</label>
                            <textarea
                                name="deliveryAddress"
                                onChange={handleChange}
                                placeholder="Enter your delivery address"
                                value = {formData.deliveryAddress}
                            />
                        </div>
                        <button>Confirm Order</button>
                    </form>
                </div>
            </div>
        </div>
    )
}