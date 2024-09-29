import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import PendingParticipantBox from "../../CommonComponents/PendingParticipantBox";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";

export default function PendingParticipants({interests}) {
    const [pendingParticipants, setPendingParticipants] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/courses/pendingParticipants")
            .then((res) => {
                console.log("Success");
                const pendingParticipants = res.data?.pendingParticipants || [];
                setPendingParticipants(pendingParticipants);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Participants"}/>
            { 
                pendingParticipants.length ?
                <div className="pendingMembersList">
                    {pendingParticipants.map(function(pendingParticipant, index){
                        return(
                            <PendingParticipantBox 
                                key={index}
                                participantId={pendingParticipant.participant_id}
                                courseId={pendingParticipant.course_id}
                                participantName={pendingParticipant.participant_name}
                                courseName={pendingParticipant.course_name}
                                setUpdate={setUpdate}
                            />
                        )
                    })}
                </div>
                :
                <NotFoundAlt icon="supervisor_account" message={"No participant request pended!"}/>
            }
        </div>
    )
}