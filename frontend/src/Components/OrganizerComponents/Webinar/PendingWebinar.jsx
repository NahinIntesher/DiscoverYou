import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import NotFoundAlt from "../../CommonComponents/NotFoundAlt";
import PendingWebinarBox from "./PendingWebinarBox";

export default function PendingWebinar({interests}) {
    const [pendingWebinars, setPendingWebinars] = useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:3000/organizer/webinars/pending")
            .then((res) => {
                console.log("Success");
                const pendingWebinars = res.data?.webinars || [];
                setPendingWebinars(pendingWebinars);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="mainContent">
            <Header title={"Pending Webinars"}/>
            { 
                pendingWebinars.length ?
                <div className="pendingMembersList">
                {pendingWebinars.map(function(webinar){
                    return (
                        <PendingWebinarBox 
                            key={webinar.webinar_id}
                            id={webinar.webinar_id}
                            name={webinar.webinar_name}
                            category={webinar.webinar_category}
                            description={webinar.webinar_description}
                            hostName={webinar.host_name}
                            hostId={webinar.host_id}
                            setUpdate={setUpdate}
                            meetingLink={webinar.meeting_link}
                            startTime={webinar.start_time}
                            endTime={webinar.end_time}
                        />
                    )
                })}
                </div>
                :
                <NotFoundAlt icon="patient_list" message={"You have no pending webinar!"}/>
            }
        </div>
    )
}