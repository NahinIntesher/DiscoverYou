import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import "../../../assets/styles/marketplace.css";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link } from "react-router-dom";
import PendingProductBox from "./PendingProductBox";
import Header from '../../CommonComponents/Header';
import NotFoundAlt from '../../CommonComponents/NotFoundAlt';
import NotFound from "../../CommonComponents/NotFound";

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
    }, [update]);


    return (
        <div className="productBoxContainer">            
            {pendingProducts.length ? (
                <>
                    {pendingProducts.map((product, index) => (
                        <PendingProductBox
                            key={index}
                            productId={product.product_id}
                            productName={product.product_name}
                            productSellerPicture={product.seller_picture}
                            productImage={product.image_url}
                            productPrice={product.product_price}
                            productCategory={product.product_category}
                            productType={product.product_type}
                            productDetails={product.product_details}
                            productSeller={product.seller_name}
                            productSellerId={product.seller_id}
                            setUpdate={setUpdate} 
                        />
                    ))}
                </>
            ) : (
                <NotFound message={"No product requests pending!"} />
            )}
        </div>
    );
}
