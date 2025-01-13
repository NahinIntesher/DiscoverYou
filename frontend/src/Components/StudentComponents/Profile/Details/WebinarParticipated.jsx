import React, { useState, useEffect } from "react";
import axios from "axios";
import WebinarBox from "./WebinarBox";
import NotFound from "../../../CommonComponents/NotFound";
import Header from "../../../CommonComponents/Header";
export default function WebinarParticipated({user}) {
    const [myWebinars, setMyWebinars] = useState([]);
    const [participatedWebinars, setParticipatedWebinars] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/webinars/my")
            .then((res) => {
                console.log("Success");
                const mywebinarsData = res.data?.myWebinars || [];
                const participatedWebinarsData = res.data?.participatedWebinars || [];

                setMyWebinars(mywebinarsData);
                setParticipatedWebinars(participatedWebinarsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <Header title={`Webinar participated`} semiTitle={`by ${user.student_name}`}/>
            <div className="tabContent">
                <div className="cousreSemiTitle">Participated Webinars</div>
                {
                myWebinars.length > 0 ?
                myWebinars.map(function(webinar){
                    return (
                        <WebinarBox 
                            key={webinar.webinar_id}
                            id={webinar.webinar_id}
                            name={webinar.webinar_name}
                            hostPicture={webinar.host_picture}
                            category={webinar.webinar_category}
                            description={webinar.webinar_description}
                            hostName={webinar.host_name}
                            totalMember={webinar.participant_count}
                        />
                    )
                })
                :
                <NotFound message="No webinar Found"/>
            }
            
            
            </div>
        </div>
    );
}