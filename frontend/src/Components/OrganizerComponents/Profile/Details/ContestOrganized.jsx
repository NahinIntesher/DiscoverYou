import React, { useState, useEffect } from "react";
import axios from "axios";
import ContestBox from "./ContestBox";
import NotFound from "../../../CommonComponents/NotFound";
import Header from "../../../CommonComponents/Header";
export default function ContestOrganized({user}) {
    const [myContests, setMyContests] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/organizer/contests/my")
            .then((res) => {
                console.log("Success");
                const myContestsData = res.data?.contestResults || [];
                setMyContests(myContestsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <Header title={`Contest organized by ${user.organizer_name}`}/>
            <div className="tabContent">
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
                            totalContests={contest.total_contests}
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