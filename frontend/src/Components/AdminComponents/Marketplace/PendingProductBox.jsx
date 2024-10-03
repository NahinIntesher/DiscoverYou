import React from "react";
import dp from "../../../assets/images/desert.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PendingProductBox({
  productId,
  productName,
  productSellerPicture,
  productCategory,
  productImage,
  productPrice,
  productDetails,
  productSeller,
  productSellerId,
  productType,
  setUpdate
}) {
  function getPMTime(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  function getDate(datetime) {
    let time = new Date(datetime);
    return time.toLocaleString("en-US", { dateStyle: "long" });
  }

  function approve() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/marketplace/approve", {
        productId: productId,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert('Product "' + productName + '" successfully approved!');
          setUpdate((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  function reject() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/admin/marketplace/reject", {
        productId: productId,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          alert('Product "' + productName + '" has been rejected.');
          setUpdate((prevData) => prevData + 1);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="pendingCommunityBox">
      <img className="productImage" src={productImage}/>
      <div className="communityDetails">
        <div className="informationContainer">
          <div className="information">
            <div className="title">{productName}</div>
            <div className="category">
              {productCategory === "Competitive Programming" && (
                <MaterialSymbol className="icon" size={24} icon="code" />
              )}
              {productCategory === "Singing" && (
                <MaterialSymbol className="icon" size={24} icon="queue_music" />
              )}
              {productCategory === "Graphics Designing" && (
                <MaterialSymbol className="icon" size={24} icon="polyline" />
              )}
              {productCategory === "Photography" && (
                <MaterialSymbol className="icon" size={24} icon="photo_camera" />
              )}
              {productCategory === "Web/App Designing" && (
                <MaterialSymbol className="icon" size={24} icon="web" />
              )}
              {productCategory === "Writing" && (
                <MaterialSymbol className="icon" size={24} icon="edit_note" />
              )}
              {productCategory === "Art & Craft" && (
                <MaterialSymbol className="icon" size={24} icon="draw" />
              )}
              {productCategory === "Debating" && (
                <MaterialSymbol className="icon" size={24} icon="communication" />
              )}
              {productCategory === "Gaming" && (
                <MaterialSymbol
                  className="icon"
                  size={24}
                  icon="sports_esports"
                />
              )}
              <div className="text">{productCategory}</div>
            </div>
          </div>
        </div>
        <div className="description">
          <Link to={"/profile/"+productSellerId} className="organizer">
            <div className="organizerPicture">
              <img src={productSellerPicture ? productSellerPicture : dp} />
            </div>
            <div className="organizerDetails">
              <div className="detailTitle">Requested By</div>
              <div className="detailInfo">{productSeller}</div>
            </div>
          </Link>
          <div className="detail">
            <table>
              <tr><th>Price</th><td>{productPrice}৳</td></tr>
              <tr><th>Details</th><td>{productDetails}</td></tr>
              <tr><th>Type</th><td>{productType == "digital" ? "Digital Product" : "Physical Product"}</td></tr> 
            </table>
          </div>
        </div>
      </div>
      <div className="buttonContainer">
        <div className="acceptButton" onClick={approve}>
          <MaterialSymbol className="icon" size={22} icon="check" />
          <div className="text">Approve</div>
        </div>
        <div className="rejectButton" onClick={reject}>
          <MaterialSymbol className="icon" size={22} icon="close" />
          <div className="text">Reject</div>
        </div>
      </div>
    </div>
  );
}
