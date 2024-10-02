import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import PendingMemberBox from "../../CommonComponents/PendingMemberBox";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";
import PendingApplicationBox from "./PendingApplicationBox";

export default function PendingApplications({interests}) {
    const [applications, setApplications] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/hirings/pending")
            .then((res) => {
                console.log("Success");
                const applicationsData = res.data?.applications || [];
                setApplications(applicationsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Application"}/>
            { 
                applications.length ?
                <div className="pendingMembersList">
                    {applications.map(function(application, index){
                        return(
                            <PendingApplicationBox 
                                key={application.hiring_id}
                                id={application.hiring_id}
                                jobName={application.job_name}
                                companyName={application.company_name}
                                category={application.job_category}
                                description={application.job_description}
                                organizerName={application.organizer_name}
                                organizerId={application.organizer_id}
                                organizerPicture={application.organizer_picture}
                                salary={application.job_salary}
                                lastDate={application.end_time}
                                setUpdate={setUpdate}
                            />
                        )
                    })}
                </div>
                :
                <NotFoundAlt icon="person_search" message={"You have no pending application!"}/>
            }
        </div>
    )
}