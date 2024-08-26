import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/dashboard.css";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';
import { Link } from "react-router-dom";
import "../../../assets/styles/community.css";
import MyCommunities from "./MyCommunities";
import BrowseCommunities from "./BrowseCommunities";

export default function Community() {
    const [communities, setCommunities] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [activeTab, setActiveTab] = useState(["browseCommunities"]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/community")
            .then((res) => {
                console.log("Success");
                const communitiesData = res.data?.communities || [];

                const myCommunitiesData = communitiesData.filter(
                    function (community) {
                        return community.is_joined == "yes";
                    }
                );

                setCommunities(communitiesData);
                setMyCommunities(myCommunitiesData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Community</div>
                    <Link to="/community/new" className="button">
                        <MaterialSymbol className="icon" size={24} icon="add" />
                        <div className="text">Create New Community</div>
                    </Link>
                </div>
            </div>
            <div className="tabContainer">
                <div className={activeTab == "myCommunities" ? "activeTab" : "tab"} onClick={function(){setActiveTab("myCommunities")}}>My Communities</div>
                <div className={activeTab == "browseCommunities" ? "activeTab" : "tab"} onClick={function(){setActiveTab("browseCommunities")}}>Browse Communities</div>
            </div>
            {
                activeTab == "myCommunities" &&
                <MyCommunities communities={myCommunities} />
            }
            {
                activeTab == "browseCommunities" &&
                <BrowseCommunities communities={communities} />
            }
        </div>
    );
}