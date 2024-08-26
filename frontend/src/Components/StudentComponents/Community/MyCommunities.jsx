import React from "react";
import CommunityBox from "../../CommonComponents/CommunityBox";

export default function MyCommunities({communities}) {
    return (
        <div className="tabContent">
        {
            communities.map(function(community){
                return (
                    <CommunityBox 
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