import React, { useState, useEffect } from "react";
import axios from "axios";
import NotFound from "../../CommonComponents/NotFound";
import PendingWebinarBox from "./PendingWebinarBox";

export default function PendingWebinar() {
    const [webinars, setWebinars] = useState([]);
    const [update, setUpdate] = useState([]);
    
    useEffect(() => {
        axios
            .get("http://localhost:3000/admin/webinars/pending")
            .then((res) => {
                console.log("Success");
                const webinarsData = res.data?.webinars || [];
                setWebinars(webinarsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, [update]);

    return (
        <div className="tabContent">
        {   webinars.length > 0 ?
            webinars.map(function(webinar){
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
            })
            :
            <NotFound message="No Pending Webinar Available"/>
        }
        </div>
    );
}