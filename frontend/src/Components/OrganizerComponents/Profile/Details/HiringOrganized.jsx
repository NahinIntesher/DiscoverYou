import React, { useState, useEffect } from "react";
import axios from "axios";
import HiringBox from "./HiringBox";
import NotFound from "../../../CommonComponents/NotFound";
import Header from "../../../CommonComponents/Header";
export default function HiringOrganized({user}) {
    const [myHiring, setMyHiring] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/dynamic-profile/"+user.organizer_id)
            .then((res) => {
                console.log("Success");
                const myhiringData = res.data?.hiringResults || [];

                setMyHiring(myhiringData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <Header title={`Hirings organized`} semiTitle={`by ${user.organizer_name}`}/>
            <div className="tabContent">
                {
                myHiring.length > 0 ?
                myHiring.map(function(hiring){
                    return (
                        <HiringBox
                            key={hiring.hiring_id}
                            hiringId={hiring.hiring_id}
                            organizerName={hiring.organizer_name}
                            organizerPicture={hiring.organizer_picture}
                            companyName={hiring.company_name}
                            jobName={hiring.job_name}
                            jobCategory={hiring.job_category}
                            jobDescription={hiring.job_description}
                        />
                    )
                })
                :
                <NotFound message="No hiring Found"/>
            }
            
            
            </div>
        </div>
    );
}