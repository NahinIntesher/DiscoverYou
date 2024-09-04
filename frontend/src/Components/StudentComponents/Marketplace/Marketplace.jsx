import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link } from "react-router-dom";

export default function Marketplace() {
    return (
        <div className="mainContent">
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Marketplace</div>
                    <div className="buttonContainer">
                        <Link to="/marketplace/add-product" className="button">
                            <MaterialSymbol className="icon" size={24} icon="add" />
                            <div className="text">Add a new Product</div>
                        </Link>
                        <Link to="/marketplace/cart" className="button">
                            <MaterialSymbol className="icon" size={24} icon="shopping_cart" />
                            <div className="text">Cart</div>
                        </Link>
                    </div>
                </div>
            </div>


        </div>
    );
}