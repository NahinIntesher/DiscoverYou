import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import 'react-material-symbols/rounded';
import Header from "../../CommonComponents/Header";

export default function Material() {
    const {materialId} = useParams();
    const [material, setMaterial] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:3000/student/courses/material/"+materialId)
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
            <Header title={material.material_name} semiTitle={"Material of "+material.course_name}/>
            { material.material_type?.split('/')[0] == "video" &&
                <video className="courseMaterial" controls>
                    <source src={material.material_link} type={material.material_type} />
                    Your browser does not support the video element.
                </video>
            }
            { material.material_type?.split('/')[0] == "image" &&
                <div className="courseMaterialContainer">
                    <img 
                        src={material.material_link}
                    />
                </div>
            }
            { material.material_type?.split('/')[0] == "audio" &&
                <div className="courseMaterialContainer">
                    
                    <MaterialSymbol className="icon" size={240} icon="queue_music" />
                    <audio className="courseMaterial" controls>
                        <source src={material.material_link} type={material.material_type} />
                        Your browser does not support the <audio src=""></audio> element.
                    </audio>
                </div>
            }
            { material.material_type?.split('/')[0] == "application" &&
                <embed src={material.material_link} className="courseMaterial" type="application/pdf"/>
            }
        </div>
    )
}
