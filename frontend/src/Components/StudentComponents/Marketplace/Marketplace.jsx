import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import "../../../assets/styles/marketplace.css";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link } from "react-router-dom";
import ProductBox from "../../CommonComponents/ProductBox";
import BrowseProducts from "./BrowseProducts";

export default function Marketplace() {
    const [pendingProductNo, setPendingProductNo] = useState(0);
    const [activeTab, setActiveTab] = useState(["browseProducts"]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/marketplace/pending-details")
            .then((res) => {
                console.log("Success");
                const pendingProductsNo = res.data?.pendingProductsNo || [];
                setPendingProductNo(pendingProductsNo);
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
            {pendingProductNo != 0 &&
                <div className="pendingBox">
                    <MaterialSymbol className="icon" size={32} icon="error" />
                    <div className="text">
                        Your {pendingProductNo} products approval are in pending.
                    </div>
                    <Link to={"/marketplace/pending-products"} className="button">
                        Pending Products
                    </Link>
                </div>
            }
            <div className="tabContainer">
                <div className={activeTab == "myProducts" ? "activeTab" : "tab"} onClick={function(){setActiveTab("myProducts")}}>My Products</div>
                <div className={activeTab == "browseProducts" ? "activeTab" : "tab"} onClick={function(){setActiveTab("browseProducts")}}>Browse Products</div>
            </div>
            {activeTab == "browseProducts" && <BrowseProducts/>}
        </div>
    );
}