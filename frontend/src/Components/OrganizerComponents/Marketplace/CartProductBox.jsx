import React, { useState, useEffect } from "react";
import axios from "axios";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link } from "react-router-dom";


export default function CartProductBox({
    productName,
    productId,
    productImage,
    productPrice,
    setUpdate
}
) {

    function removeFromCart() {

        axios.defaults.withCredentials = true;
        axios
            .post("http://localhost:3000/organizer/marketplace/remove-from-cart", {
                productId: productId
            })
            .then((res) => {
                if (res.data.status === "Success") {
                    setUpdate((prev)=> prev+1);
                } else {
                    alert(res.data.Error);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="cartProductBox">
            <img src={productImage} />
            <div className="texts">
                <div className="name">{productName} </div>
                <div className="price">{productPrice}৳</div>
            </div>
            <MaterialSymbol onClick={removeFromCart} className="remove" size={24} icon="close" />
        </div>
    )
}