import React, { useState } from "react";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link, useNavigate } from "react-router-dom";

export default function ProductBox({
  productId,
  productName,
  productImage,
  productPrice,
  productCategory
}) {
 
  const showCart = () => {};

  return (
    <div className="productBox">
      <img src={productImage} />
      <div className="textContainer">
        <div className="text">
          <div className="title">{productName}</div>
        </div>
        <div className="details">
          <Category category={productCategory}/>
          <div className="price">{productPrice}৳</div>
        </div>
        <div className="buttonContainer">
          <Link to={"/marketplace/product/"+productId} className="button">
            Details
          </Link>
          <div className="buttonAlt" onClick={showCart}>
            Add To Cart
          </div>
        </div>
      </div>
    </div>
  );
}



function Category({ category }) {
  return (
    <div className="category">
      {category === "Competitive Programming" && (
        <MaterialSymbol className="icon" size={22} icon="code" />
      )}
      {category === "Singing" && (
        <MaterialSymbol className="icon" size={22} icon="queue_music" />
      )}
      {category === "Graphics Designing" && (
        <MaterialSymbol className="icon" size={22} icon="polyline" />
      )}
      {category === "Photography" && (
        <MaterialSymbol className="icon" size={22} icon="photo_camera" />
      )}
      {category === "Web/App Designing" && (
        <MaterialSymbol className="icon" size={22} icon="web" />
      )}
      {category === "Writing" && (
        <MaterialSymbol className="icon" size={22} icon="edit_note" />
      )}
      {category === "Art & Craft" && (
        <MaterialSymbol className="icon" size={22} icon="draw" />
      )}
      {category === "Debating" && (
        <MaterialSymbol className="icon" size={22} icon="communication" />
      )}
      {category === "Gaming" && (
        <MaterialSymbol className="icon" size={22} icon="sports_esports" />
      )}
      <div className="text">{category}</div>
    </div>
  );
}