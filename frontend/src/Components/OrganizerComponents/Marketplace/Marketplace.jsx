import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import "../../../assets/styles/contest.css";
import "../../../assets/styles/marketplace.css";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Link } from "react-router-dom";
import ProductBox from "./ProductBox";
import NotFound from "../../CommonComponents/NotFound";
import CartProductBox from "./CartProductBox";

export default function Marketplace() {
  const [pendingDeliveryNo, setPendingDeliveryNo] = useState(0);
  const [products, setProducts] = useState([]);
  const [isCartActive, setCartActive] = useState(false);
  const [update, setUpdate] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/marketplace/cart")
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
      .get("http://localhost:3000/organizer/marketplace/products")
      .then((res) => {
        console.log("Success");
        const productsData = res.data?.products || [];
        setProducts(productsData);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/marketplace/pending-details")
      .then((res) => {
        console.log("Success");
        const pendingDeliveryNo = res.data?.pendingDeliveryNo || [];

        setPendingDeliveryNo(pendingDeliveryNo);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
      });
  }, []);

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
            <div onClick={() => setCartActive(true)} to="/marketplace/cart" className="button">
              <MaterialSymbol className="icon" size={24} icon="shopping_cart" />
              <div className="text">Cart</div>
            </div>
          </div>
        </div>
      </div>
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
      <div className="productBoxContainer">
        {products.map(function (product) {
          return (
            <ProductBox
              key={product.product_id}
              productId={product.product_id}
              productName={product.product_name}
              productImage={product.image_url}
              productPrice={product.product_price}
              productCategory={product.product_category}
            />
          );
        })}
      </div>
    </div>
  );
}
