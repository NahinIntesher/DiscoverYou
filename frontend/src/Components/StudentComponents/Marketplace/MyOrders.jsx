import React, { useState, useEffect } from "react";
import "../../../assets/styles/contest.css";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import WebinarBox from "../../CommonComponents/WebinarBox";
import 'react-material-symbols/rounded';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/student/marketplace/my-order")
      .then((response) => {
        const ordersData = response.data.orders;
        setOrders(ordersData);
      })
      .catch((error) => {
        console.error("Error fetching webinars:", error);
      });
  }, []);

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
                            />
                        )
                    })
                }
            </div> :
            <NotFound message="You don't have ordered any product!"/>
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
    deliveryStatus
}) {
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
                </table>
            </div>
            <div className="deliveryStatus">
                <div className="name">Delivery Status</div>
                {deliveryStatus ? 
                <div className="delivery complete">Completed</div>
                :
                <div className="delivery">In Process</div>
                }
            </div>
        </div>
    )
}
