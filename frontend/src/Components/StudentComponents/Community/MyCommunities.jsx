import React, { useState, useEffect } from "react";
import axios from "axios";
import CommunityBox from "../../CommonComponents/CommunityBox";

export default function MyCommunities() {
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/community")
            .then((res) => {
                console.log("Success");
                const communitiesData = res.data?.communities || [];

                //      return community.is_joined == "yes";    

                setCommunities(communitiesData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="tabContent">
        {
            communities.map(function(community){
                return (
                    <CommunityBox 
                        key={community.community_id}
                        id={community.community_id}
                        name={community.community_name}
                        category={community.community_category}
                        description={community.community_description}
                        adminName={community.community_admin_name}
                        isJoined={community.is_joined}
                        totalMember={community.total_member}
                    />
                )
            })
        }
        </div>
    );
}