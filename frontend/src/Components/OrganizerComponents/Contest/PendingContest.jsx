import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";
import PendingContestBox from "./PendingContestBox";

export default function PendingContest({interests}) {
    const [pendingContests, setPendingContests] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/organizer/contests/pending")
            .then((res) => {
                console.log("Success");
                const pendingContests = res.data?.contests || [];
                setPendingContests(pendingContests);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Contests"}/>
            { 
                pendingContests.length ?
                <div className="pendingMembersList">
                {pendingContests.map(function(contest){
                    return (
                        <PendingContestBox 
                            key={contest.contest_id}
                            id={contest.contest_id}
                            name={contest.contest_name}
                            category={contest.contest_category}
                            details={contest.contest_details}
                            hostName={contest.host_name}
                            hostPicture={contest.host_picture}
                            hostId={contest.host_id}
                            setUpdate={setUpdate}
                            meetingLink={contest.meeting_link}
                            startTime={contest.start_time}
                            endTime={contest.end_time}
                        />
                    )
                })}
                </div>
                :
                <NotFoundAlt icon="patient_list" message={"You have no pending contest!"}/>
            }
        </div>
    )
}