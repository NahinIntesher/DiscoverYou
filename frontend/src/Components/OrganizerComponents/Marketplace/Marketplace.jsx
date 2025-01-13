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

export default function Marketplace({ user }) {
  const [pendingDeliveryNo, setPendingDeliveryNo] = useState(0);
  const [isCartActive, setCartActive] = useState(false);
  const [update, setUpdate] = useState(0);

  const [cartProducts, setCartProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("name");
  const [searchText, setSearchText] = useState("");


  const allInterests = [
    "Competitive Programming",
    "Web/App Designing",
    "Gaming",
    "Photography",
    "Debating",
    "Singing",
    "Writing",
    "Art & Craft",
    "Graphics Designing",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/organizer/marketplace/products")
      .then((res) => {
        console.log("Success");
        const productsData = res.data?.products || [];

        //let filteredProductsData = productsData.filter(product => allInterests.includes(product.product_category));
        let filteredProductsData  = productsData.sort((a, b) => a.product_name.localeCompare(b.product_name));
        setProductsData(productsData);
        setProducts(filteredProductsData);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let filteredProductsData;
    let sortValue = name == "sort" ? value : sort;
    let categoryValue = name == "category" ? value : category;
    let searchTextValue = name == "search" ? value : searchText;

    if (categoryValue == "all") {
      setCategory("all");
      filteredProductsData = productsData.filter(product => allInterests.includes(product.product_category));
    } else {
      filteredProductsData = productsData.filter(product => product.product_category == categoryValue);
      setCategory(categoryValue);
    }

    filteredProductsData = filteredProductsData.filter(product => product.product_name.toLowerCase().includes(searchTextValue.toLowerCase()));

    if (sortValue == "name") {
      setSort("name")
      filteredProductsData.sort((a, b) => a.product_name.localeCompare(b.product_name));
    }
    else {
      setSort("price")
      filteredProductsData.sort((a, b) => b.product_price - a.product_price);
    }

    setProducts(filteredProductsData);
  }

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
        <div className="filterBox filterBoxCommunity">
          <div className="searchBox" >
            <MaterialSymbol className="icon" size={22} icon="search" />
            <input name="search" onChange={handleInputChange} placeholder="Search by name..." />
          </div>
          <div className="filters">
            <div className="filterName">Sort By</div>
            <div className="filter">
              <MaterialSymbol className="icon" size={22} icon="tune" />
              <select name="sort" onChange={handleInputChange}>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
            <div className="filterName">Category</div>
            <div className="filter">
              <InterestIcon category={category} />
              <select name="category" onChange={handleInputChange}>
                
              <option value="all">
                  All
                </option>
                {allInterests.map((interest) => (
                  <option value={interest}>{interest}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

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



function InterestIcon(data) {
    //   console.log();
    data = data.category;
    if (data == "Competitive Programming") {
        return <MaterialSymbol className="icon" size={22} icon="code" />;
    } else if (data == "Singing") {
        return <MaterialSymbol className="icon" size={22} icon="queue_music" />;
    } else if (data == "Graphics Designing") {
        return <MaterialSymbol className="icon" size={22} icon="polyline" />;
    } else if (data == "Photography") {
        return <MaterialSymbol className="icon" size={22} icon="photo_camera" />;
    } else if (data == "Web/App Designing") {
        return <MaterialSymbol className="icon" size={22} icon="web" />;
    } else if (data == "Writing") {
        return <MaterialSymbol className="icon" size={22} icon="edit_note" />;
    } else if (data == "Art & Craft") {
        return <MaterialSymbol className="icon" size={22} icon="draw" />;
    } else if (data == "Debating") {
        return <MaterialSymbol className="icon" size={22} icon="communication" />;
    } else if (data == "Gaming") {
        return <MaterialSymbol className="icon" size={22} icon="sports_esports" />;
    } else {
        return <MaterialSymbol className="icon" size={22} icon="interests" />;
    }
}