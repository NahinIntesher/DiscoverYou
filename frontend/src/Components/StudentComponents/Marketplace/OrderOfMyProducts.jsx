import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import 'react-material-symbols/rounded';
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";


export default function OrderOfMyProducts() {
  const [orders, setOrders] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/student/marketplace/order-of-my-products")
      .then((response) => {
        const ordersData = response.data.orders;
        setOrders(ordersData);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });
  }, [update]);

  return (
    <div className="productBoxContainer">
        {orders.length ?
            <div className="participantList">
                {
                    orders.map(function(order){
                        return (
                            <OrderBox
                                orderId={order.order_id}
                                productImage={order.image_url}
                                productName={order.product_name}
                                productPrice={order.product_price}
                                productQuantity={order.product_quantity}
                                deliveryStatus={order.is_delivered}
                                deliveryAddress={order.delivery_address}
                                contactNumber={order.delivery_mobile_no}
                                deliveryEmail={order.delivery_email}
                                deliveryDate={order.delivery_date}
                                orderDate={order.order_date}
                                buyerName={order.buyer_name}
                                setUpdate={setUpdate}
                            />
                        )
                    })
                }
            </div> :
            <NotFound message="Nobody ordered your any product!"/>
        }
    </div>
  )
}

function OrderBox({
    orderId,
    productImage,
    productName,
    productPrice,
    productQuantity,
    deliveryAddress,
    contactNumber,
    deliveryStatus,
    deliveryEmail,
    deliveryDate,
    buyerName,
    orderDate,
    setUpdate
}) {
    function getDate(datetime) {
        let time = new Date(datetime);
        return time.toLocaleString("en-US", { dateStyle: "long" });
    }

    function completeOrder() {
        axios.defaults.withCredentials = true;
        axios
          .post("http://localhost:3000/student/marketplace/complete-delivery", {
            orderId: orderId
          })
          .then((res) => {
            if (res.data.status === "Success") {
              alert("You confirmed that Order#0000\""+orderId+"\" successfully delivered!");
              setUpdate((prevData) => prevData + 1);
            } else {
              alert(res.data.Error);
            }
          })
          .catch((err) => console.log(err));
      };

      
    return (
        <div className="orderBox">
            <img src={productImage}/>
            <div className="prodcutDetails">
                <div className="name">Order#0000{orderId}</div>
                <table>
                    <tr>
                        <th>Product Name: </th>
                        <td>{productName}</td>
                    </tr>
                    <tr>
                        <th>Item Quantity: </th>
                        <td>{productQuantity}</td>
                    </tr>
                    <tr>
                        <th>Total Ammount: </th>
                        <td>{productQuantity*productPrice}৳</td>
                    </tr>
                    <tr>
                        <th>Order By: </th>
                        <td>{buyerName}</td>
                    </tr>
                    <tr>
                        <th>Order Date: </th>
                        <td>{getDate(orderDate)}</td>
                    </tr>
                </table>
            </div>
            <div className="prodcutDetails">
                <div className="semiTitle">Delivery Details</div>
                <table>
                    <tr>
                        <th>Delivery Address: </th>
                        <td>{deliveryAddress}</td>
                    </tr>
                    <tr>
                        <th>Delivery Email: </th>
                        <td>{deliveryEmail}</td>
                    </tr>
                    <tr>
                        <th>Contact Number: </th>
                        <td>{contactNumber}</td>
                    </tr>                     
                    <tr>
                        <th>Delivery Date: </th>
                        <td>{deliveryStatus ? getDate(deliveryDate) : "Delivery in progress"}</td>
                    </tr>
            
                </table>
            </div>
            <div className="deliveryStatus">
                <div className="name">Delivery Status</div>
                {deliveryStatus ? 
                <div className="delivery complete">Completed</div>
                :
                <div className="acceptButton" onClick={completeOrder}>
                    <MaterialSymbol className="icon" size={22} icon="check" />
                    <div className="text">Complete</div>
                </div>
                }
            </div>
        </div>
    )
}
