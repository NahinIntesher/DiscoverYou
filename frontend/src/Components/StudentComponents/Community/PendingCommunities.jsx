import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import PendingMemberBox from "../../CommonComponents/PendingMemberBox";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";
import PendingCommunityBox from "./PendingCommunityBox";

export default function PendingCommunities({interests}) {
    const [pendingCommunities, setPendingCommunities] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/community/pending")
            .then((res) => {
                console.log("Success");
                const pendingCommunities = res.data?.communities || [];
                setPendingCommunities(pendingCommunities);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Communities"}/>
            { 
                pendingCommunities.length ?
                <div className="pendingMembersList">
                    {pendingCommunities.map(function(community, index){
                        return(
                            <PendingCommunityBox 
                                key={community.community_id}
                                id={community.community_id}
                                name={community.community_name}
                                category={community.community_category}
                                description={community.community_description}
                                adminName={community.community_admin_name}
                                adminId={community.community_admin_id}
                                setUpdate={setUpdate}
                            />
                        )
                    })}
                </div>
                :
                <NotFoundAlt icon="supervisor_account" message={"You have no pending community!"}/>
            }
        </div>
    )
}