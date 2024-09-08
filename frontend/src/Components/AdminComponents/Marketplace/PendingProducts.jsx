import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import "../../../assets/styles/marketplace.css";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link } from "react-router-dom";
import PendingProductBox from "../../CommonComponents/PendingProductBox";
import Header from '../../CommonComponents/Header';
import NotFoundAlt from '../../CommonComponents/NotFoundAlt';

export default function PendingProducts() {
    const [update, setUpdate] = useState(0);
    
    const [pendingProducts, setpendingProducts] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/admin/marketplace/product-requests")
            .then((res) => {
                console.log("Success");
                const productsData = res.data?.products || [];
                setpendingProducts(productsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);


    return (
        <div className="mainContent">
            <Header title={"Pending Products"} />
            {
                pendingProducts.length ? (
                    <div className="productBoxContainer">
                        {pendingProducts.map((product, index) => (
                            <PendingProductBox
                                key={index}
                                productId={product.product_id}
                                productName={product.product_name}
                                productImage={product.image_url}
                                productPrice={product.product_price}
                                productSeller={product.seller_name}
                                setUpdate={setUpdate} 
                            />
                        ))}
                    </div>
                ) : (
                    <NotFoundAlt icon="supervisor_account" message={"No product requests pending!"} />
                )
            }
        </div>
    );
}
