import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import 'react-material-symbols/rounded';
import Header from "./Header";

export default function SubmissionPreview() {
    const {contestId, participantId} = useParams();
    const [material, setMaterial] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/contests/submission/"+contestId+"/"+participantId)
            .then((res) => {
                console.log("Success");
                let materialData = res.data?.material || [];
                setMaterial(materialData);
            })
            .catch((error) => {
                console.error("Error fetching material:", error);
            });
    }, []);

    return (
        <div className="mainContent">
            <Header title={"Submission of "+material.participant_name} semiTitle={"For "+material.contest_name+" Contest"}/>
            { material.submission_type == "text" &&
                <div className="courseMaterialContainer">
                    <div className="textBox">
                        {material.submission_text}
                    </div>
                </div>
            }
            { material.submission_type?.split('/')[0] == "video" &&
                <video className="courseMaterial" controls>
                    <source src={material.submission_link} type={material.submission_type} />
                    Your browser does not support the video element.
                </video>
            }
            { material.submission_type?.split('/')[0] == "image" &&
                <div className="courseMaterialContainer">
                    <img 
                        src={material.submission_link}
                    />
                </div>
            }
            { material.submission_type?.split('/')[0] == "audio" &&
                <div className="courseMaterialContainer">
                    
                    <MaterialSymbol className="icon" size={240} icon="queue_music" />
                    <audio className="courseMaterial" controls>
                        <source src={material.submission_link} type={material.submission_type} />
                        Your browser does not support the <audio src=""></audio> element.
                    </audio>
                </div>
            }
            { material.submission_type?.split('/')[0] == "application" &&
                <embed src={material.submission_link} className="courseMaterial" type="application/pdf"/>
            }
        </div>
    )
}