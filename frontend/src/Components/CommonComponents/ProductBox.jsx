import React from "react";
import dp from "../../assets/images/desert.jpg"

export default function ProductBox({productName, productImage, productPrice}) {
    return (
        <div className="productBox">
            <img src={productImage}/>
            <div className="textContainer">
                <div className="text">
                    <div className="title">
                        {productName}
                    </div>
                </div>
                <div className="price">
                    {productPrice}৳
                </div>
                <div className="buttonContainer">
                    <div className="button">Details</div>
                    <div className="buttonAlt">Add To Cart</div>
                </div>
            </div>
        </div>
    )
}