import React, { useState, useEffect } from "react";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import PendingContestBox from "./PendingContestBox";

export default function PendingContest() {
    const [contests, setContests] = useState([]);
    const [update, setUpdate] = useState([]);
    
    useEffect(() => {
        axios
            .get("http://localhost:3000/admin/contests/pending")
            .then((res) => {
                console.log("Success");
                const contestsData = res.data?.contests || [];
                setContests(contestsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="tabContent">
        {   contests.length > 0 ?
            contests.map(function(contest){
                return (
                    <PendingContestBox 
                        key={contest.contest_id}
                        id={contest.contest_id}
                        name={contest.contest_name}
                        hostPicture={contest.host_picture}
                        category={contest.contest_category}
                        description={contest.contest_details}
                        hostName={contest.host_name}
                        hostId={contest.organizer_id}
                        setUpdate={setUpdate}
                        meetingLink={contest.meeting_link}
                        startTime={contest.start_time}
                        endTime={contest.end_time}
                    />
                )
            })
            :
            <NotFound message="No Pending Contest Available"/>
        }
        </div>
    );
}