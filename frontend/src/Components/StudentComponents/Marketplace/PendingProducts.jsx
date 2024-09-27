import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import PendingMemberBox from "../../CommonComponents/PendingMemberBox";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";
import PendingProductBox from "./PendingProductBox";

export default function PendingProducts({interests}) {
    const [pendingProducts, setPendingProducts] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/marketplace/pending")
            .then((res) => {
                console.log("Success");
                const pendingProducts = res.data?.products || [];
                setPendingProducts(pendingProducts);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Products"}/>
            { 
                pendingProducts.length ?
                <div className="pendingMembersList">
                    {pendingProducts.map(function(product, index){
                        return(
                            <PendingProductBox
                                key={index}
                                productId={product.product_id}
                                productName={product.product_name}
                                productImage={product.image_url}
                                productPrice={product.product_price}
                                productCategory={product.product_category}
                                productType={product.product_type}
                                productDetails={product.product_details}
                                productSeller={product.seller_name}
                                setUpdate={setUpdate} 
                            />
                        )
                    })}
                </div>
                :
                <NotFoundAlt icon="production_quantity_limits" message={"You have no pending product!"}/>
            }
        </div>
    )
}