import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function AddProduct({ interests, user, admins }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productCategory: interests[0],
    productType: "physical",
    productDetails: "",
    productPrice: "",
    productOnStock: 0,
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
    finalData.append("productName", formData.productName);
    finalData.append("productCategory", formData.productCategory);
    finalData.append("productType", formData.productType);
    finalData.append("productOnStock", formData.productOnStock);
    finalData.append("productDetails", formData.productDetails);
    finalData.append("productPrice", formData.productPrice);
    formData.images.forEach((file, index) => {
      finalData.append(`images`, file);
    });

    if (formData.images.length < 2) {
      alert("Add atleast 2 images!");
      return;
    }

    axios.defaults.withCredentials = true;
    axios
      .post(
        "http://localhost:3000/student/marketplace/add-product",
        finalData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data.status === "Success") {
          {
            admins.map((admin) => {
              axios
                .post("http://localhost:3000/admin/notifications", {
                  recipientId: admin.admin_id,
                  notificationPicture: user.student_picture,
                  notificationTitle: "Product Approval Request",
                  notificationMessage: `${user.student_name} have created a new product are in pending!`,
                  notificationLink: `/marketplace`,
                })
                .then((res) => {
                  if (res.data.status === "Success") {
                    console.log("Successfully notification send");
                  } else {
                    alert(res.data.Error);
                  }
                })
                .catch((err) => console.log(err));
            });
          }
          alert("The product was successfully submitted for admin approval!");
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
              <label name="productName">
                Product Name <span className="required">*</span>
              </label>
              <input
                name="productName"
                onChange={handleChange}
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
                placeholder="Enter product details"
                required
              />
            </div>

            <div className="input">
              <label htmlFor="productDetails">
                Add Product Images <span className="required">*</span>
              </label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                accept="image/*"
                required
              />
              {formData.images.length < 2 && (
                <p className="bottomRequired">
                  Add at least 2 image of you product
                </p>
              )}
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

            <button>Request For Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}
