import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import "../../../assets/styles/marketplace.css";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link } from "react-router-dom";
import ProductBox from "./ProductBox";
import BrowseProducts from "./BrowseProducts";
import MyProducts from "./MyProducts";
import CartProductBox from "./CartProductBox";
import NotFound from "../../CommonComponents/NotFound";

export default function Marketplace() {
    const [pendingProductNo, setPendingProductNo] = useState(0);
    const [activeTab, setActiveTab] = useState(["browseProducts"]);
    const [isCartActive, setCartActive] = useState(false);
    const [update, setUpdate] = useState(0);
    const [cartProducts, setCartProducts] = useState([]);
    const [pendingDeliveryNo, setPendingDeliveryNo] = useState(0);
    const [pendingProductOrderNo, setPendingProductOrderNo] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/marketplace/cart")
            .then((res) => {
                console.log("Success");
                const cartProductsData = res.data?.products || [];
                setCartProducts(cartProductsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update, isCartActive]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/marketplace/pending-details")
            .then((res) => {
                console.log("Success");
                const pendingProductsNo = res.data?.pendingProductsNo || [];
                const pendingDeliveryNo = res.data?.pendingDeliveryNo || [];
                const pendingProductOrderNo = res.data?.pendingProductOrderNo || [];

                setPendingProductNo(pendingProductsNo);
                setPendingProductOrderNo(pendingProductOrderNo);
                setPendingDeliveryNo(pendingDeliveryNo);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);


    return (
        <div className="mainContent">
            <div className={isCartActive ? "dialogBoxBackground" : "none"} onClick={()=> setCartActive(false)}/>
            <div className={isCartActive ? "cartBox cartBoxActive" : "cartBox"}>
                <div className="title">Cart</div>
                <div className="cartProductBoxContainer">
                    {
                    cartProducts.length ?
                    cartProducts.map(function(product){
                        return (
                            <CartProductBox
                                productId={product.product_id}
                                productName={product.product_name}
                                productPrice={product.product_price}
                                productImage={product.image_url}
                                setUpdate={setUpdate}
                            />
                        )
                    })
                    : <NotFound message="No product added in cart!"/>
                }
                </div>
                <Link to={"/marketplace/checkout/cart"} className="checkoutButton">
                    Checkout
                </Link>
            </div>
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Marketplace</div>
                    <div className="buttonContainer">
                        <Link to="/marketplace/order-history" className="button">
                            <MaterialSymbol className="icon" size={24} icon="history" />
                            <div className="text">Order History</div>
                        </Link>
                        <Link to="/marketplace/add-product" className="button">
                            <MaterialSymbol className="icon" size={24} icon="add" />
                            <div className="text">Add New Product</div>
                        </Link>
                        <div onClick={()=> setCartActive(true)} className="button">
                            <MaterialSymbol className="icon" size={24} icon="shopping_cart" />
                            <div className="text">Cart</div>
                        </div>
                    </div>
                </div>
            </div>
            {pendingProductOrderNo != 0 &&
                <div className="pendingBox">
                    <MaterialSymbol className="icon" size={32} icon="error" />
                    <div className="text">
                        Please deliver your {pendingProductOrderNo} products to the customer.
                    </div>
                    <Link to={"/marketplace/order-history?tab=2"} className="button">
                        Pending Delivery
                    </Link>
                </div>
            }
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
            {pendingDeliveryNo != 0 &&
                <div className="pendingBox">
                    <MaterialSymbol className="icon" size={32} icon="error" />
                    <div className="text">
                        Delivery of your {pendingDeliveryNo} orders are in process.
                    </div>
                    <Link to={"/marketplace/order-history"} className="button">
                        Pending Orders
                    </Link>
                </div>
            }
            <div className="tabContainer">
                <div className={activeTab == "myProducts" ? "activeTab" : "tab"} onClick={function(){setActiveTab("myProducts")}}>My Products</div>
                <div className={activeTab == "browseProducts" ? "activeTab" : "tab"} onClick={function(){setActiveTab("browseProducts")}}>Browse Products</div>
            </div>
            {activeTab == "myProducts" && <MyProducts/>}
            {activeTab == "browseProducts" && <BrowseProducts/>}
        </div>
    );
}