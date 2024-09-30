import React, { useState, useEffect } from "react";
import axios from "axios";
import CommunityBox from "../../CommonComponents/CommunityBox";
import NotFound from "../../CommonComponents/NotFound";
import PendingCommunityBox from "./PendingCommunityBox";

export default function PendingCommunities() {
    const [communities, setCommunities] = useState([]);
    const [update, setUpdate] = useState([]);
    
    useEffect(() => {
        axios
            .get("http://localhost:3000/admin/community/pending")
            .then((res) => {
                console.log("Success");
                const communitiesData = res.data?.communities || [];
                setCommunities(communitiesData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="tabContent">
        {   communities.length > 0 ?
            communities.map(function(community){
                return (
                    <PendingCommunityBox 
                        key={community.community_id}
                        id={community.community_id}
                        name={community.community_name}
                        category={community.community_category}
                        description={community.community_description}
                        adminName={community.community_admin_name}
                        adminPicture={community.community_admin_picture}
                        adminId={community.community_admin_id}
                        setUpdate={setUpdate}
                        totalMember={community.total_member}
                    />
                )
            })
            :
            <NotFound message="No Pending Community Available"/>
        }
        </div>
    );
}