import React, { useState } from "react";
import axios from "axios";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import dp from "../../../../../assets/images/default.jpg";
import { Link } from "react-router-dom";

export default function WebinarBox({ id, name, category, description, hostName, hostPicture }) {

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
            </div>
            <div className="detailsContainer">
                <div className="description">
                    <div className="titles">Webinar Description</div>
                    <div className="text">{description}</div>
                </div>
                <div className="organizer">
                    <div className="organizerPicture">
                        <img src={hostPicture?hostPicture:dp} />
                    </div>
                    <div className="organizerDetails">
                        <div className="detailTitle">Hosted By</div>
                        <div className="detailInfo">{hostName}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}