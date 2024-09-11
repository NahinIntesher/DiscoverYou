import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import "../../../assets/styles/marketplace.css";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link } from "react-router-dom";
import ProductBox from "../../CommonComponents/ProductBox";

export default function Marketplace() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/marketplace/products")
            .then((res) => {
                console.log("Success");
                const productsData = res.data?.products || [];
                setProducts(productsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);


    return (
        <div className="mainContent">
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Marketplace</div>
                    <div className="buttonContainer">
                        <Link to="/marketplace/add-product" className="button">
                            <MaterialSymbol className="icon" size={24} icon="add" />
                            <div className="text">Add New Product</div>
                        </Link>
                        <Link to="/marketplace/cart" className="button">
                            <MaterialSymbol className="icon" size={24} icon="shopping_cart" />
                            <div className="text">Cart</div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="productBoxContainer">
                {
                    products.map(function(product){
                        return (
                            <ProductBox
                                productName={product.product_name}
                                productImage={product.image_url}
                                productPrice={product.product_price}
                                productType={product.product_type}
                                productOnStock={product.product_on_stock}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
}