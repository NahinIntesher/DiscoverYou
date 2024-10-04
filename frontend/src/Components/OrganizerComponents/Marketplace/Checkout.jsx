import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../CommonComponents/Header";

export default function Checkout({ user }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState([]);

  const [formData, setFormData] = useState({
    fromCart: productId == "cart",
    deliveryAddress: user.organizer_address,
    customerMobileNo: user.organizer_mobile_no,
    customerEmail: user.organizer_email,
    paymentMethod: "Cash On Delivary",
    products: [],
  });

  function updateQuantity(index, e) {
    const { value } = e.target;

    if (value <= 0) {
      alert("Quantity cannot be below then 1!");
    }
    else if (value > formData.products[index].productStock){
      alert("Only "+formData.products[index].productStock+" of this product is in stock!");
    }  
    else {
      setFormData((prev) => {
        const updatedProducts = [...prev.products];

        updatedProducts[index] = {
          ...updatedProducts[index],
          productQuantity: parseInt(value),
        };

        return {
          ...prev,
          products: updatedProducts,
        };
      });
    }
  }

  function calculateTotalPrice() {
    return formData.products.reduce(
      (total, product) =>
        total + product.productPrice * product.productQuantity,
      0
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(function (oldFormData) {
      return {
        ...oldFormData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      axios.defaults.withCredentials = true;
      const checkoutResponse = await axios.post(
        "http://localhost:3000/organizer/marketplace/checkout",
        formData
      );

      if (checkoutResponse.data.status === "Success") {
        console.log("Form Products:", formData);

        // Send notifications to sellers
        const notificationPromises = formData.products.map((product) =>
          axios.post("http://localhost:3000/student/notifications", {
            recipientId: product.productSellerId,
            notificationPicture: user.organizer_picture,
            notificationTitle: "Product Order",
            notificationMessage: `${user.organizer_name} ordered your product "${product.productName}" in marketplace.`,
            notificationLink: `/marketplace/order-history/tab=2`,
          })
          .catch((error) => {
            console.error("Error fetching contests:", error);
          })
        );

        await Promise.all(notificationPromises);
        console.log("All notifications sent successfully");

        alert("Checkout successfully completed! Please wait for delivery.");
        navigate(-1);
      } else {
        console.error("Checkout failed:", checkoutResponse.data.Error);
        alert("Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  useEffect(() => {
    if (productId == "cart") {
      axios
        .get("http://localhost:3000/organizer/marketplace/cart")
        .then((res) => {
          console.log("Success");
          const cartProducts = res.data?.products || [];

          setFormData(function (prev) {
            return {
              ...prev,
              products: [],
            };
          });

          cartProducts.forEach((product) => {
            setFormData(function (prev) {
              return {
                ...prev,
                products: [
                  ...prev.products,
                  {
                    productId: product.product_id,
                    productSeller: product.seller_name,
                    productStock: product.product_in_stock,
                    productSellerId: product.seller_id,
                    productName: product.product_name,
                    productPrice: product.product_price,
                    productQuantity: 1,
                  },
                ],
              };
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching contests:", error);
        });
    } else {
      axios
        .get("http://localhost:3000/student/marketplace/product/" + productId)
        .then((res) => {
          const cartProduct = res.data?.product || [];

          setFormData(function (prev) {
            return {
              ...prev,
              products: [
                {
                  productId: cartProduct.product_id,
                  productSeller: cartProduct.seller_name,
                  productStock: cartProduct.product_in_stock,
                  productSellerId: cartProduct.seller_id,
                  productName: cartProduct.product_name,
                  productPrice: cartProduct.product_price,
                  productQuantity: 1,
                },
              ],
            };
          });
        })
        .catch((error) => {
          console.error("Error fetching contests:", error);
        });
    }
  }, []);

  return (
    <div className="mainContent">
      <Header title={"Checkout"} />
      <div className="formBoxContainer">
        <div className="formBox">
          <form onSubmit={handleSubmit}>
            <div className="productList">
              <div className="title">Product Details</div>
              <table>
                <thead>
                  <tr>
                    <td>Product Name</td>
                    <td>Price Per Unit</td>
                    <td>Quantity</td>
                    <td>Price</td>
                  </tr>
                </thead>
                {formData.products.map(function (product, index) {
                  return (
                    <tr>
                      <td>{product.productName}</td>
                      <td>{product.productPrice}৳</td>
                      <td className="fixedWidth">
                        <input
                          onChange={(e) => updateQuantity(index, e)}
                          value={product.productQuantity}
                          type="number"
                        />
                      </td>
                      <td>{product.productPrice * product.productQuantity}৳</td>
                    </tr>
                  );
                })}
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Total</td>
                    <td>{calculateTotalPrice()}৳</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="title">Billing Details</div>
            <div className="input">
              <label name="communityName">Your Mobile Number</label>
              <input
                name="customerMobileNo"
                onChange={handleChange}
                type="text"
                placeholder="Enter your mobile number"
                value={formData.customerMobileNo}
              />
            </div>
            <div className="input">
              <label name="communityName">Your Email</label>
              <input
                name="customerEmail"
                onChange={handleChange}
                type="text"
                placeholder="Enter your email"
                value={formData.customerEmail}
              />
            </div>
            <div className="input">
              <label htmlFor="communityDescription">Delivery Address</label>
              <textarea
                name="deliveryAddress"
                onChange={handleChange}
                placeholder="Enter your delivery address"
                value={formData.deliveryAddress}
              />
            </div>
            <button>Confirm Order</button>
          </form>
        </div>
      </div>
    </div>
  );
}
