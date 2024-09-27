import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";
import PendingHiringBox from "./PendingHiringBox";

export default function PendingWebinar({interests}) {
    const [pendingHirings, setPendingHirings] = useState([]);
    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/organizer/hirings/pending")
            .then((res) => {
                const pendingHirings = res.data?.hirings || [];
                setPendingHirings(pendingHirings);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Hirings"}/>
            { 
                pendingHirings.length ?
                <div className="pendingMembersList">
                {pendingHirings.map(function(hiring){
                    return (
                        <PendingHiringBox 
                            key={hiring.hiring_id}
                            hiringId={hiring.hiring_id}
                            organizerId={hiring.organizer_id}
                            organizerName={hiring.organizer_name}
                            companyName={hiring.company_name}
                            jobName={hiring.job_name}
                            jobCategory={hiring.job_category}
                            jobDescription={hiring.job_description}
                            startTime={hiring.start_time}
                            endTime={hiring.end_time}
                            jobSalery={hiring.job_salary}
                            applicantsCount={hiring.applicant_count}
                            calculatedTime={hiring.calculated_time}
                            setUpdate={setUpdate}
                        />
                    )
                })}
                </div>
                :
                <NotFoundAlt icon="patient_list" message={"You have no pending Hirings!"}/>
            }
        </div>
    )
}