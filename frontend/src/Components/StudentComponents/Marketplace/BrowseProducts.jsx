import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductBox from "../../CommonComponents/ProductBox";

export default function BrowseProducts() {
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
        <div className="productBoxContainer">
            {
                products.map(function(product){
                    return (
                        <ProductBox
                            productName={product.product_name}
                            productImage={product.image_url}
                            productPrice={product.product_price}
                            productCategory={product.product_category}
                        />
                    )
                })
            }
        </div>
    );
}