import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function AddProduct({ interests }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productCategory: interests[0],
    productDetails: "",
    productPrice: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [name]: value,
      };
    });
  };

  const handleFileChange = (event) => {
    let mimetype = event.target.files[0].type;
    console.log(mimetype);
    if (mimetype.startsWith("image")) {
      setFormData(function (oldFormData) {
        return {
          ...oldFormData,
          images: [...oldFormData.images, ...Array.from(event.target.files)],
        };
      });
    } else {
      alert("File should be image!");
    }
  };

  function removeMedia(index) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        images: prevFormData.images.filter((_, i) => i !== index),
      };
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = new FormData();
    finalData.append('productName', formData.productName);
    finalData.append('productCategory', formData.productCategory);
    finalData.append('productDetails', formData.productDetails);
    finalData.append('productPrice', formData.productPrice);
    formData.images.forEach((file, index) => {
        finalData.append(`images`, file); 
    });
    
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/student/marketplace/add-product", finalData, {
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
  };

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

            <button>Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}
