import React, { useState } from "react";
import dp from "../../assets/images/desert.jpg"
import { useNavigate } from "react-router-dom";


export default function ProductBox({productName, productImage, productPrice, productType, productOnStock}) {
    const navigate = useNavigate();
    const showDetails = () => {
        navigate("/marketplace/product-details");
    }
    const showCart = () => {
    
    }

    return (
        <div className="productBox">
            <img src={productImage}/>
            <div className="textContainer">
                <div className="text">
                    <div className="title">
                        {productName}
                    </div>
                </div>
                <div className="details">
                    <div className="type">
                        {productType == "digital" ? "Digital Product" : "Physical Product"}
                    </div>
                    <div className="price">{productPrice}৳</div>
                </div>
                <div className="buttonContainer">
                    <div className="button" onClick={showDetails}>Details</div>
                    <div className="buttonAlt" onClick={showCart}>Add To Cart</div>
                </div>
            </div>
        </div>
    )
}