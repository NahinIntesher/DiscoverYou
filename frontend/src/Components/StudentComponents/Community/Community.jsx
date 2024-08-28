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
    const [activeTab, setActiveTab] = useState(["browseCommunities"]);
    
    const [pendingMemberNo, setPendingMemberNo] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/community/pendingMembers")
            .then((res) => {
                console.log("Success");
                const pendingMembers = res.data?.pendingMembers || [];
                console.log(pendingMembers);
                setPendingMemberNo(pendingMembers.length);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <div className="contentTitle">
                <div className="content">
                    <div className="title">Commuanity</div>
                    <Link to="/community/new" className="button">
                        <MaterialSymbol className="icon" size={24} icon="add" />
                        <div className="text">Create New Community</div>
                    </Link>
                </div>
            </div>
            {pendingMemberNo != 0 &&
                <div className="pendingBox">
                    <MaterialSymbol className="icon" size={32} icon="error" />
                    <div className="text">
                        {pendingMemberNo} members approval pending in your communities.
                    </div>
                    <Link to={"/community/members/pending"} className="button">
                        Pending Members
                    </Link>
                </div>
            }
            <div className="tabContainer">
                <div className={activeTab == "myCommunities" ? "activeTab" : "tab"} onClick={function(){setActiveTab("myCommunities")}}>My Communities</div>
                <div className={activeTab == "browseCommunities" ? "activeTab" : "tab"} onClick={function(){setActiveTab("browseCommunities")}}>Browse Communities</div>
            </div>
            {
                activeTab == "myCommunities" &&
                <MyCommunities />
            }
            {
                activeTab == "browseCommunities" &&
                <BrowseCommunities />
            }
        </div>
    );
}