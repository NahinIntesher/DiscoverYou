import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
            { material.material_type?.split('/')[0] == "application" &&
                <embed src={material.material_link} className="courseMaterial" type="application/pdf"/>
            }
        </div>
    )
}

// function MaterialView({mediaLink, mediaType}) {
//     if(mediaType.split('/')[0] == "image") {
//         return <img key={index} src={mediaLink}/>
//     } 
//     else if(mediaType.split('/')[0] == "audio") {
//         return (
//             <div key={index} className="audioContainer">
//                 <MaterialSymbol className="icon" size={120} icon="music_cast"/>
//                 <audio controls>
//                     <source src={mediaLink} type={mediaType} />
//                     Your browser does not support the audio element.
//                 </audio>
//             </div>
//         )
//     } 
//     else if(mediaType.split('/')[0] == "video") {
//         return (
//             <video controls key={index}>
//                 <source src={mediaLink} type={mediaType} />
//                 Your browser does not support the video element.
//             </video>
//         )
//     }
//     else {
//         return <div>Hulo</div>
//     }
// }