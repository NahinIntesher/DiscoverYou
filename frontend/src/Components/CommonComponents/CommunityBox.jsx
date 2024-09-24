import React, { useState } from "react";
import axios from "axios";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../assets/images/desert4.jpg";
import { Link } from "react-router-dom";

export default function CommunityBox({ id, name, category, description, adminName, isJoined, totalMember }) {
    const [joinStatus, setJoinStatus] = useState(isJoined);

    function joinCommunity () {
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/student/community/join", {
            communityId: id
        })
        .then((res) => {
            if (res.data.status === "Registered") {
                setJoinStatus("pending")
                setParticipantNo((prevValue) => prevValue + 1);
            } else if (res.data.status === "Unregistered") {
                setJoinStatus("no");
                setParticipantNo((prevValue) => prevValue - 1);
            } else {
                alert(res.data.Error);
            }
        })
        .catch((err) => console.log(err));
    };

    return (
        <div className="communityBox">
            <div className="informationContainer">
                <div className="information">
                    <div className="title">{name}</div>
                    <div className="category">
                        {category === "Competitive Programming" && (
                            <MaterialSymbol className="icon" size={24} icon="code" />
                        )}
                        {category === "Singing" && (
                            <MaterialSymbol className="icon" size={24} icon="queue_music" />
                        )}
                        {category === "Graphics Designing" && (
                            <MaterialSymbol className="icon" size={24} icon="polyline" />
                        )}
                        {category === "Photography" && (
                            <MaterialSymbol className="icon" size={24} icon="photo_camera" />
                        )}
                        {category === "Web/App Designing" && (
                            <MaterialSymbol className="icon" size={24} icon="web" />
                        )}
                        {category === "Writing" && (
                            <MaterialSymbol className="icon" size={24} icon="edit_note" />
                        )}
                        {category === "Art & Craft" && (
                            <MaterialSymbol className="icon" size={24} icon="draw" />
                        )}
                        {category === "Debating" && (
                            <MaterialSymbol className="icon" size={24} icon="communication" />
                        )}
                        {category === "Gaming" && (
                            <MaterialSymbol
                                className="icon"
                                size={24}
                                icon="sports_esports"
                            />
                        )}
                        <div className="text">{category}</div>
                    </div>
                </div>
                <div className="joinButtonContainer">
                    {joinStatus == "yes" ? (
                        <Link to={"/community/"+id} className="joinButton">Enter</Link>
                    ) : joinStatus == "pending" ? (
                        <div onClick={joinCommunity} className="joinButton">Requested</div>
                    ) : (
                        <div onClick={joinCommunity} className="joinButton">Join</div>
                    ) 
                    }
                    <div className="joinDetails">
                        Member: <b>{totalMember}</b>
                    </div>
                </div>
            </div>
            <div className="detailsContainer">
                <div className="description">
                    <div className="titles">Community Description</div>
                    <div className="text">{description}</div>
                </div>
                <div className="organizer">
                    <div className="organizerPicture">
                        <img src={dp} />
                    </div>
                    <div className="organizerDetails">
                        <div className="detailTitle">Maintained By</div>
                        <div className="detailInfo">{adminName}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}