import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductBox from "./ProductBox";
import NotFound from "../../CommonComponents/NotFound";

export default function MyProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/marketplace/products/my")
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
        <div className="productBoxContainer">
            {
                products.length ?
                products.map(function(product){
                    return (
                        <ProductBox
                            key={product.product_id}
                            productId={product.product_id}
                            productName={product.product_name}
                            productImage={product.image_url}
                            productPrice={product.product_price}
                            productCategory={product.product_category}
                        />
                    )
                })
                :
                <NotFound message="You don't have any approved product!"/>
            }
        </div>
    );
}