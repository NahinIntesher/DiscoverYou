import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import PendingMemberBox from "../../CommonComponents/PendingMemberBox";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";
import PendingCommunityBox from "./PendingCommunityBox";
import PendingProductBox from "./PendingProductBox";

export default function PendingCommunities({interests}) {
    const [pendingCommunities, setPendingCommunities] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/marketplace/pending")
            .then((res) => {
                console.log("Success");
                const pendingCommunities = res.data?.communities || [];
                setPendingCommunities(pendingCommunities);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Products"}/>
            { 
                pendingCommunities.length ?
                <div className="pendingMembersList">
                    {pendingCommunities.map(function(community, index){
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
                <NotFoundAlt icon="supervisor_account" message={"You have no pending community!"}/>
            }
        </div>
    )
}