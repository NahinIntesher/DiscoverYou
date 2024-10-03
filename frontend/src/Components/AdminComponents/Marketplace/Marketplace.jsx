import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import "../../../assets/styles/marketplace.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import BrowseProducts from "./BrowseProducts";
import PendingProducts from "./PendingProducts";
import NotFound from "../../CommonComponents/NotFound";
import CartProductBox from "./CartProductBox";

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState(["browseProducts"]);
  const [isCartActive, setCartActive] = useState(false);
  const [update, setUpdate] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/marketplace/cart")
      .then((res) => {
        console.log("Success");
        const cartProductsData = res.data?.products || [];
        setCartProducts(cartProductsData);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
      });
  }, [update, isCartActive]);


  return (
    <div className="mainContent">
      <div className={isCartActive ? "dialogBoxBackground" : "none"} onClick={() => setCartActive(false)} />
      <div className={isCartActive ? "cartBox cartBoxActive" : "cartBox"}>
        <div className="title">Cart</div>
        <div className="cartProductBoxContainer">
          {
            cartProducts.length ?
              cartProducts.map(function (product) {
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
              : <NotFound message="No product added in cart!" />
          }
        </div>
        <div className="checkoutButton">
          Checkout
        </div>
      </div>
      <div className="contentTitle">
        <div className="content">
          <div className="title">Marketplace</div>
          <div className="buttonContainer">
            <div onClick={() => setCartActive(true)} to="/marketplace/cart" className="button">
              <MaterialSymbol className="icon" size={24} icon="shopping_cart" />
              <div className="text">Cart</div>
            </div>
          </div>
        </div>
      </div>
      <div className="tabContainer">
        <div
          className={activeTab == "pendingProducts" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("pendingProducts");
          }}
        >
          Pending Products
        </div>
        <div
          className={activeTab == "browseProducts" ? "activeTab" : "tab"}
          style={{ cursor: "pointer" }}
          onClick={function () {
            setActiveTab("browseProducts");
          }}
        >
          Browse Products
        </div>
      </div>
      {activeTab == "browseProducts" && <BrowseProducts />}
      {activeTab == "pendingProducts" && <PendingProducts />}
    </div>
  );
}
