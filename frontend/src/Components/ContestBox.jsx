import React from "react";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

export default function ContestBox(props) {
    return (
        <div className="contestBox">
            <div className="informationContainer">
                <div className="information">
                    <div className="title">{props.name}</div>
                    <div className="category">
                        {props.category == "programming" && <><MaterialSymbol className="icon" size={24} icon="code"/><div className="text">Programming</div></>}
                        {props.category == "music" && <><MaterialSymbol className="icon" size={24} icon="queue_music"/><div className="text">Music</div></>}
                        {props.category == "graphics" && <><MaterialSymbol className="icon" size={24} icon="draw"/><div className="text">Graphics Designing</div></>}
                    </div>
                </div><div className="joinButtonContainer">
                    <div className="joinButton">Enter</div>
                </div>
            </div>
            <div className="detailsContainer">
                <div className="details">
                    <div className="detail">
                        <MaterialSymbol className="icon" size={28} icon="person"/>
                        <div className="text">
                            <div className="detailTitle">Organizer</div>
                            <div className="detailInfo">{props.organizer}</div>
                        </div>
                    </div>
                    <div className="detail">
                        <MaterialSymbol className="icon" size={28} icon="calendar_month"/>
                        <div className="text">
                            <div className="detailTitle">Date</div>
                            <div className="detailInfo">{props.date}</div>
                        </div>
                    </div>
                </div>
                <div className="details">
                    <div className="detail">
                        <MaterialSymbol className="icon" size={28} icon="supervisor_account"/>
                        <div className="text">
                            <div className="detailTitle">Registered</div>
                            <div className="detailInfo">12,024</div>
                        </div>
                    </div>
                    <div className="detail">
                        <MaterialSymbol className="icon" size={28} icon="schedule"/>
                        <div className="text">
                            <div className="detailTitle">Time</div>
                            <div className="detailInfo">{props.startTime} - {props.endTime}</div>
                        </div>
                    </div>
                </div>
                <div className="center">
                    <div className="timeRemaining">
                        <MaterialSymbol className="icon" size={24} icon="schedule"/><div className="text">Time Remaining: 1h 42m</div>
                    </div>
                </div>
            </div>
        </div>
    )
}