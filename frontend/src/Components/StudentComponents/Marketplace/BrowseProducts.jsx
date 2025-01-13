import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductBox from "./ProductBox";
import NotFound from "../../CommonComponents/NotFound";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

export default function BrowseProducts({user}) {
    const [productsData, setProductsData] = useState([]);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("myInterested");
    const [sort, setSort] = useState("name");
    const [searchText, setSearchText] = useState("");


    const allInterests = [
        "Competitive Programming",
        "Web/App Designing",
        "Gaming",
        "Photography",
        "Debating",
        "Singing",
        "Writing",
        "Art & Craft",
        "Graphics Designing",
    ];

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/marketplace/products")
            .then((res) => {
                console.log("Success");
                const productsData = res.data?.products || [];

                let filteredProductsData = productsData.filter(product => user.interests.includes(product.product_category));
                filteredProductsData.sort((a, b) => a.product_name.localeCompare(b.product_name));
                setProductsData(productsData);
                setProducts(filteredProductsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let filteredProductsData;
        let sortValue = name == "sort" ? value : sort;
        let categoryValue = name == "category" ? value : category;
        let searchTextValue = name == "search" ? value : searchText;

        if (categoryValue == "all") {
            setCategory("all");
            filteredProductsData = productsData.filter(product => allInterests.includes(product.product_category));
        } else if (categoryValue == "myInterested") {
            filteredProductsData = productsData.filter(product => user.interests.includes(product.product_category));
            setCategory("myInterested");
        } else {
            filteredProductsData = productsData.filter(product => product.product_category == categoryValue);
            setCategory(categoryValue);
        }

        filteredProductsData = filteredProductsData.filter(product => product.product_name.toLowerCase().includes(searchTextValue.toLowerCase()));

        if (sortValue == "name") {
            setSort("name")
            filteredProductsData.sort((a, b) => a.product_name.localeCompare(b.product_name));
        }
        else {
            setSort("price")
            filteredProductsData.sort((a, b) => b.product_price - a.product_price);
        }

        setProducts(filteredProductsData);
    }


    return (
        <div className="productBoxContainer">
            <div className="filterBox filterBoxCommunity">
                <div className="searchBox" >
                    <MaterialSymbol className="icon" size={22} icon="search" />
                    <input name="search" onChange={handleInputChange} placeholder="Search by name..." />
                </div>
                <div className="filters">
                    <div className="filterName">Sort By</div>
                    <div className="filter">
                        <MaterialSymbol className="icon" size={22} icon="tune" />
                        <select name="sort" onChange={handleInputChange}>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                        </select>
                    </div>
                    <div className="filterName">Category</div>
                    <div className="filter">
                        <InterestIcon category={category} />
                        <select name="category" onChange={handleInputChange}>
                            <option
                                value="myInterested"
                            >
                                My Interested
                            </option>
                            {allInterests.map((interest) => (
                                <option value={interest}>{interest}</option>
                            ))}
                            <option value="all">
                                All
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            {
                products.length ?
                    products.map(function (product) {
                        return (
                            <ProductBox
                                key={product.product_id}
                                productId={product.product_id}
                                productName={product.product_name}
                                productImage={product.image_url}
                                productPrice={product.product_price}
                                productCategory={product.product_category}
                            />
                        )
                    })
                    :
                    <NotFound message="No Product Found" />
            }
        </div>
    );
}



function InterestIcon(data) {
    //   console.log();
    data = data.category;
    if (data == "Competitive Programming") {
        return <MaterialSymbol className="icon" size={22} icon="code" />;
    } else if (data == "Singing") {
        return <MaterialSymbol className="icon" size={22} icon="queue_music" />;
    } else if (data == "Graphics Designing") {
        return <MaterialSymbol className="icon" size={22} icon="polyline" />;
    } else if (data == "Photography") {
        return <MaterialSymbol className="icon" size={22} icon="photo_camera" />;
    } else if (data == "Web/App Designing") {
        return <MaterialSymbol className="icon" size={22} icon="web" />;
    } else if (data == "Writing") {
        return <MaterialSymbol className="icon" size={22} icon="edit_note" />;
    } else if (data == "Art & Craft") {
        return <MaterialSymbol className="icon" size={22} icon="draw" />;
    } else if (data == "Debating") {
        return <MaterialSymbol className="icon" size={22} icon="communication" />;
    } else if (data == "Gaming") {
        return <MaterialSymbol className="icon" size={22} icon="sports_esports" />;
    } else {
        return <MaterialSymbol className="icon" size={22} icon="interests" />;
    }
}