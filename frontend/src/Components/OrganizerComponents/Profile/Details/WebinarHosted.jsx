import React, { useState, useEffect } from "react";
import axios from "axios";
import WebinarBox from "./WebinarBox";
import NotFound from "../../../CommonComponents/NotFound";
import Header from "../../../CommonComponents/Header";
export default function WebinarOrganized({user}) {
    const [myWebinars, setMyWebinars] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/organizer/webinars/my")
            .then((res) => {
                console.log("Success");
                const mywebinarsData = res.data?.webinarResults || [];

                setMyWebinars(mywebinarsData);
            })
            .catch((error) => {
                console.error("Error fetching contests:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <Header title={`Webinar hosted`} semiTitle={`by ${user.organizer_name}`}/>
            <div className="tabContent">
                {
                myWebinars.length > 0 ?
                myWebinars.map(function(webinar){
                    return (
                        <WebinarBox 
                            key={webinar.webinar_id}
                            id={webinar.webinar_id}
                            name={webinar.webinar_name}
                            category={webinar.webinar_category}
                            description={webinar.webinar_description}
                            hostPicture={webinar.host_picture}
                            hostName={webinar.host_name}
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