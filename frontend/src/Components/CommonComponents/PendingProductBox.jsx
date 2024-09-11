import React from "react";
import dp from "../../assets/images/desert.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PendingProductBox({productId, productName, productImage, productPrice, productSeller, setUpdate}) {
    const navigate = useNavigate();
    function approveMember() {
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/admin/marketplace/product/approve", {
            productId
        })
        .then((res) => {
          if (res.data.status === "Success") {
            console.log("Aprroved Success!");
            setUpdate((prevData) => prevData+1);
            navigate(-1);
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };

    function rejectMember() {
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/admin/marketplace/product/reject", {
            productId
        })
        .then((res) => {
          if (res.data.status === "Success") {
            setUpdate((prevData) => prevData+1);
            navigate(-1); 
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    };

    return (
        <div className="pendingMemberBox">
            <div className="profilePicture">
                <img src={productImage}/>
            </div>
            <div className="memberDetails">
                <div className="name">{productName}</div>
                <div className="detail">Product price <span className="community">{productPrice}৳</span></div>
                <div className="detail">Requested for add the product <span className="community">{productSeller}</span></div>
                <div className="viewProfile">View Details</div>
            </div>
            <div className="buttonContainer">
                <div className="acceptButton" onClick={approveMember}>
                    <MaterialSymbol className="icon" size={22} icon="check" />
                    <div className="text">Approve</div>
                </div>
                <div className="rejectButton" onClick={rejectMember}>
                    <MaterialSymbol className="icon" size={22} icon="close" />
                    <div className="text">Reject</div>
                </div>
            </div>
        </div>
    )
}