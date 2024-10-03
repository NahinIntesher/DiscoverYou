import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import MyOrders from "./MyOrders";

export default function OrderHistory({interests}) {
    const [activeTab, setActiveTab] = useState(["myOrders"]);
    const [update, setUpdate] = useState(0);

    return (
        <div className="mainContent">
            <Header title={"Order History"}/>
            <div className="tabContainer">
                <div className={activeTab == "myOrders" ? "activeTab" : "tab"} onClick={function(){setActiveTab("myOrders")}}>My Orders</div>
                <div className={activeTab == "ordersOfMyProducts" ? "activeTab" : "tab"} onClick={function(){setActiveTab("ordersOfMyProducts")}}>Orders Of My Products</div>
            </div>
            {activeTab == "myOrders" && <MyOrders/>}
        </div>
    )
}