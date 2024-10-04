import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import MyOrders from "./MyOrders";
import OrderOfMyProducts from "./OrderOfMyProducts";
import { useLocation } from "react-router-dom";

export default function OrderHistory({interests}) {
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    let tab = queryParams.get('tab')

    const [activeTab, setActiveTab] = useState(tab == 2 ? "ordersOfMyProducts" : "myOrders");

    return (
        <div className="mainContent">
            <Header title={"Order History"}/>
            <div className="tabContainer">
                <div className={activeTab == "myOrders" ? "activeTab" : "tab"} onClick={function(){setActiveTab("myOrders")}}>My Orders</div>
                <div className={activeTab == "ordersOfMyProducts" ? "activeTab" : "tab"} onClick={function(){setActiveTab("ordersOfMyProducts")}}>Orders Of My Products</div>
            </div>
            {activeTab == "myOrders" && <MyOrders/>}
            {activeTab == "ordersOfMyProducts" && <OrderOfMyProducts />}
        </div>
    )
}