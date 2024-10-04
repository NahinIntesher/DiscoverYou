import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import NotFound from "../../CommonComponents/NotFound";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/organizer/marketplace/my-order")
            .then((response) => {
                const ordersData = response.data.orders;
                setOrders(ordersData);
            })
            .catch((error) => {
                console.error("Error fetching webinars:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <Header title={"Order History"} />
            <div className="productBoxContainer">
                {orders.length ?
                    <div className="participantList">
                        {
                            orders.map(function (order) {
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
                                    />
                                )
                            })
                        }
                    </div> :
                    <NotFound message="You don't have ordered any product!" />
                }
            </div>
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
    orderDate
}) {
    function getDate(datetime) {
        let time = new Date(datetime);
        return time.toLocaleString("en-US", { dateStyle: "long" });
    }
    return (
        <div className="orderBox">
            <img src={productImage} />
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
                        <td>{productQuantity * productPrice}৳</td>
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
                        <td>{deliveryStatus ? getDate(orderDate) : "Delivery in progress"}</td>
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
