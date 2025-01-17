import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { useEffect } from "react";

export default function EditProduct({ interests, user, admins }) {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [products, setProducts] = useState({});
  const [formData, setFormData] = useState({
    productName: "",
    productDetails: "",
    productPrice: "",
    productOnStock: 0,
    productType: "physical",
    productCategory: [],
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`http://localhost:3000/student/productss/${productId}`)
      .then((res) => {
        if (res.data.status === "Success") {
          const productsData = res.data?.products;
          setProducts(productsData);

          setFormData({
            productName: productsData.product_name || "",
            productDetails: productsData.product_details || "",
            productPrice: productsData.product_price || "",
            productType: productsData.product_type || "",
            productOnStock: productsData.product_in_stock || 0,
            productCategory: productsData.product_category || [],
          });
        } else {
          alert("Product not found!");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "productCategory" ? [value] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    axios
      .post(`http://localhost:3000/student/products/update/${productId}`, {
        productId,
        ...formData,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert(`Product "${formData.productName}" successfully edited!`);
          navigate(-1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="mainContent">
      <Header title={"Edit Product"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Edit Your Product</div>
            <div className="input">
              <label name="productName">
                Product Name <span className="required">*</span>
              </label>
              <input
                name="productName"
                onChange={handleChange}
                value={formData.productName}
                type="text"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="input">
              <label name="productPrice">
                Product Price <span className="required">*</span>
              </label>
              <input
                name="productPrice"
                onChange={handleChange}
                value={formData.productPrice}
                type="number"
                placeholder="Enter product price (৳)"
                required
              />
            </div>

            <div className="input">
              <label htmlFor="productCategory">
                Product Category <span className="required">*</span>
              </label>
              <select name="productCategory" onChange={handleChange} required>
                {interests.map(function (interest) {
                  return (
                    <option value={interest} key={interest}>
                      {interest}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="input">
              <label htmlFor="productType">
                Product Type <span className="required">*</span>
              </label>
              <select name="productType" onChange={handleChange} required>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
            </div>

            {formData.productType == "physical" && (
              <div className="input">
                <label name="productOnStock">
                  Product On Stock <span className="required">*</span>
                </label>
                <input
                  name="productOnStock"
                  onChange={handleChange}
                  value={formData.productOnStock}
                  type="number"
                  placeholder="Enter number of product on stock"
                  required
                />
              </div>
            )}

            <div className="input">
              <label htmlFor="productDetails">
                Add Product Details <span className="required">*</span>
              </label>
              <textarea
                name="productDetails"
                onChange={handleChange}
                value={formData.productDetails}
                placeholder="Enter product details"
                required
              />
            </div>

            <button>Request For Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}
