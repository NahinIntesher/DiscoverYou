import React, { useEffect, useState } from "react";
import dp from "../../../assets/images/desert.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import { useParams } from "react-router-dom";

export default function Product() {
    const {productId} = useParams();

    const [product, setProduct] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [activeImage, setActiveImage] = useState(0);

    function nextImage() {
        if(activeImage+1 < productImages.length) {
            setActiveImage((prev) => prev+1)
        }
        else {
            setActiveImage(0)
        }
    }
    function prevImage() {
        if(activeImage-1 >= 0) {
            setActiveImage((prev) => prev-1)
        }
        else {
            setActiveImage(productImages.length-1)
        }
    }
    
    useEffect(() => {
        console.log("useEffect Cholled")
        axios
            .get("http://localhost:3000/student/marketplace/product/" + productId)
            .then((res) => {
                console.log("Success");
                let productData = res.data?.product || [];
                let imagesData = res.data?.images || [];

                setProduct(productData);
                setProductImages(imagesData);
            })
            .catch((error) => {
                console.error("Error fetching community:", error);
            });

        return () => {
            setActiveImage(0);
        };
    }, []);

    return (
        <div className="mainContent">
            <Header title={product.product_name} semiTitle={product.product_category+" Product"} />
            <div className="headerBottomContainer">
                <div className="productDetailsBoxContainer">
                    <div className="imagesContainer">
                        <div className="left" onClick={prevImage}>
                            <MaterialSymbol className="icon" size={32} icon="chevron_left" />
                        </div>
                        <div className="right" onClick={nextImage}>
                            <MaterialSymbol className="icon" size={32} icon="chevron_right" />
                        </div>
                        {productImages.length &&
                            <img src={productImages[activeImage].image_url}/>
                        }
                        {productImages.length && 
                            <div className="dotContainer">
                                {productImages.map(function(_, i) {
                                    return <div onClick={()=>setActiveImage(i)} className={i == activeImage ? "dot dotActive" : "dot"}></div>
                                })
                                }
                            </div>
                        }
                    </div>
                    <div className="productDetailsBox">
                        <div className="title">{product.product_name}</div>
                        <Category category={product.product_category}/>
                        <div className="organizer">
                            <div className="organizerPicture">
                            <img src={dp} />
                            </div>
                            <div className="organizerDetails">
                            <div className="detailTitle">Selling By</div>
                            <div className="detailInfo">{product.seller_name}</div>
                            </div>
                        </div>
                        <div className="description">
                            {product.product_details}
                        </div>
                        <div className="typeAndPrice">
                            <div className="type">
                                <div className="name">{product.product_type == "digital" ? "Digital Product" : "Physical Product"}</div>
                                <div className="stock">{product.product_type == "digital" ? "Downloadable Content" : product.product_in_stock+" Stock Left"}</div>
                            </div>
                            <div className="price">
                                {product.product_price}৳
                            </div>
                        </div>
                        <div className="buttonContainer">
                            <div className="button">
                                Add To Cart
                            </div>
                            <div className="buttonAlt">
                                Buy Now
                            </div>
                        </div>
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
          <MaterialSymbol className="icon" size={24} icon="code" />
        )}
        {category === "Singing" && (
          <MaterialSymbol className="icon" size={24} icon="queue_music" />
        )}
        {category === "Graphics Designing" && (
          <MaterialSymbol className="icon" size={24} icon="polyline" />
        )}
        {category === "Photography" && (
          <MaterialSymbol className="icon" size={24} icon="photo_camera" />
        )}
        {category === "Web/App Designing" && (
          <MaterialSymbol className="icon" size={24} icon="web" />
        )}
        {category === "Writing" && (
          <MaterialSymbol className="icon" size={24} icon="edit_note" />
        )}
        {category === "Art & Craft" && (
          <MaterialSymbol className="icon" size={24} icon="draw" />
        )}
        {category === "Debating" && (
          <MaterialSymbol className="icon" size={24} icon="communication" />
        )}
        {category === "Gaming" && (
          <MaterialSymbol className="icon" size={24} icon="sports_esports" />
        )}
        <div className="text">{category}</div>
      </div>
    );
  }
  