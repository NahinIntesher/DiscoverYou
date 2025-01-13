import React, { useState, useEffect } from "react";
import axios from "axios";
import CommunityBox from "../../CommonComponents/CommunityBox";
import NotFound from "../../CommonComponents/NotFound";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

export default function BrowseCommunities({ user }) {
    const [communitiesData, setCommunitiesData] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [category, setCategory] = useState("myInterested");
    const [sort, setSort] = useState("name");
    const [searchText, setSearchText] = useState("");

    // console.log(user.interests)

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
            .get("http://localhost:3000/student/community")
            .then((res) => {
                console.log("Success");
                let communitiesData = res.data?.communities || [];
                let filteredCommunitiesData = communitiesData.filter(community => user.interests.includes(community.community_category));
                filteredCommunitiesData.sort((a, b) => a.community_name.localeCompare(b.community_name));
                setCommunitiesData(communitiesData);
                setCommunities(filteredCommunitiesData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let filteredCommunitiesData;
        let sortValue = name == "sort" ? value : sort;
        let categoryValue = name == "category" ? value : category;
        let searchTextValue = name == "search" ? value : searchText;

        if (categoryValue == "all") {
            setCategory("all");
            filteredCommunitiesData = communitiesData.filter(community => allInterests.includes(community.community_category));
        } else if (categoryValue == "myInterested") {
            filteredCommunitiesData = communitiesData.filter(community => user.interests.includes(community.community_category));
            setCategory("myInterested");
        } else {
            filteredCommunitiesData = communitiesData.filter(community => community.community_category == categoryValue);
            setCategory(categoryValue);
        }

        filteredCommunitiesData = filteredCommunitiesData.filter(community => community.community_name.toLowerCase().includes(searchTextValue.toLowerCase()));

        if (sortValue == "name") {
            setSort("name")
            filteredCommunitiesData.sort((a, b) => a.community_name.localeCompare(b.community_name));
        }
        else {
            setSort("member")
            filteredCommunitiesData.sort((a, b) => b.total_member - a.total_member);
        }

        setCommunities(filteredCommunitiesData);
    }

    return (
        <div className="tabContent">
            <div className="filterBox filterBoxCommunity">
                <div className="searchBox" >
                    <MaterialSymbol className="icon" size={22} icon="search" />
                    <input name="search" onChange={handleInputChange} placeholder="Search by name..."/>
                </div>
                <div className="filters">
                    <div className="filterName">Sort By</div>
                    <div className="filter">
                        <MaterialSymbol className="icon" size={22} icon="tune" />
                        <select name="sort" onChange={handleInputChange}>
                            <option value="name">Name</option>
                            <option value="member">Members</option>
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
            {communities.length > 0 ?
                communities.map(function (community) {
                    return (
                        <CommunityBox
                            key={community.community_id}
                            id={community.community_id}
                            name={community.community_name}
                            category={community.community_category}
                            description={community.community_description}
                            adminName={community.community_admin_name}
                            adminId={community.admin_id}
                            adminPicture={community.community_admin_picture}
                            isJoined={community.is_joined}
                            totalMember={community.total_member}
                            user={user}
                        />
                    )
                })
                :
                <NotFound message="No Community Found" />
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