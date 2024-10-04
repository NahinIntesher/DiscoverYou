import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import PendingMemberBox from "../../CommonComponents/PendingMemberBox";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";

export default function PendingMembers({user, interests}) {
    const [pendingMembers, setPendingMembers] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/community/pendingMembers")
            .then((res) => {
                console.log("Success");
                const pendingMembers = res.data?.pendingMembers || [];
                setPendingMembers(pendingMembers);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Members"}/>
            { 
                pendingMembers.length ?
                <div className="pendingMembersList">
                    {pendingMembers.map(function(pendingMember, index){
                        return(
                            <PendingMemberBox 
                                key={index}
                                memberId={pendingMember.member_id}
                                communityId={pendingMember.community_id}
                                memberName={pendingMember.member_name}
                                memberPicture={pendingMember.member_picture}
                                communityName={pendingMember.community_name}
                                user={user}
                                setUpdate={setUpdate}
                            />
                        )
                    })}
                </div>
                :
                <NotFoundAlt icon="supervisor_account" message={"No member request pended!"}/>
            }
        </div>
    )
}