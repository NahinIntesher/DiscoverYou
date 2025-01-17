import React, { useState, useEffect } from "react";
import axios from "axios";
import ContestBox from "./ContestBox";
import NotFound from "../../../CommonComponents/NotFound";
import Header from "../../../CommonComponents/Header";
export default function ContestParticipated({user}) {
    const [myContests, setMyContests] = useState([]);
    const [participatedContests, setParticipatedContests] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/contests/my")
            .then((res) => {
                console.log("Success");
                const myContestsData = res.data?.myContests || [];
                const participatedContestsData = res.data?.participatedContests || [];

                setMyContests(myContestsData);
                setParticipatedContests(participatedContestsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <Header title={`Contest participated`} semiTitle={`by ${user.student_name}`}/>
            <div className="tabContent">
                <div className="cousreSemiTitle">Participated Contests</div>
                {
                myContests.length > 0 ?
                myContests.map(function(contest){
                    return (
                        <ContestBox 
                            key={contest.contest_id}
                            id={contest.contest_id}
                            name={contest.contest_name}
                            category={contest.contest_category}
                            details={contest.contest_details}
                            organizerName={contest.organizer_name}
                            organizerPicture={contest.organizer_picture}
                            organizerId={contest.organizer_id}
                            totalMember={contest.participant_count}
                            rank={contest.rank}
                        />
                    )
                })
                :
                <NotFound message="No contest Found"/>
            }
            
            
            </div>
        </div>
    );
}