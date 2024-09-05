import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function AddProduct() {
  const navigate = useNavigate();

  

  
    
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/marketplace/product-requests", finalData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      })
      .then((res) => {
        if (res.data.status === "Success") {
          console.log("Product adding  Success!");
          navigate(-1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
    console.log(formData);
  

  return (
    <div className="mainContent">
      <Header title={"New Community"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="title">Add New Product</div>
            <div className="input">
              <label name="productName">Product Name</label>
              <input
                name="productName"
                onChange={handleChange}
                type="text"
                placeholder="Enter product name"
              />
            </div>

            <div className="input">
              <label name="productPrice">Product Price</label>
              <input
                name="productPrice"
                onChange={handleChange}
                type="text"
                placeholder="Enter product price $"
              />
            </div>

            <div className="input">
              <label htmlFor="productCategory">Product Category</label>
              <select name="productCategory" onChange={handleChange}>
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
              <label htmlFor="productDetails">Add Product Details</label>
              <textarea
                name="productDetails"
                onChange={handleChange}
                placeholder="Enter product details"
              />
            </div>

            <div className="input">
              <label htmlFor="productDetails">Add Product Images</label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className="mediaContainer">
              {formData.images.map(function (file, index) {
                if (file.type.split("/")[0] == "image") {
                  return (
                    <div className="media" key={index}>
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`preview ${index}`}
                      />
                      <div
                        className="remove"
                        onClick={function () {
                          removeMedia(index);
                        }}
                      >
                        <MaterialSymbol
                          className="icon"
                          size={20}
                          icon="close"
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            <button>Request for add the Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}
