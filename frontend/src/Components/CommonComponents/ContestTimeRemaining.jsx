import React, { useState, useEffect } from "react";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function ContestTimeRemaining({ type, calculatedTime }) {
    let [remainingTime, setRemainingTime] = useState(calculatedTime);

    function calcRemainingTime(timeDifference) {
        const remainingDays = Math.floor(timeDifference / (24 * 60 * 60));
        timeDifference %= 24 * 60 * 60;

        const remainingHours = Math.floor(timeDifference / (60 * 60));
        timeDifference %= 60 * 60;

        const remainingMinutes = Math.floor(timeDifference / 60);
        const remainingSeconds = timeDifference % 60;

        let timeRemainingString = "";

        if (remainingDays != 0) timeRemainingString += remainingDays + "d ";
        if (remainingHours != 0) timeRemainingString += remainingHours + "h ";
        if (remainingMinutes != 0) timeRemainingString += remainingMinutes + "m ";
        if (remainingSeconds != 0) timeRemainingString += remainingSeconds + "s";

        return timeRemainingString;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime((oldRemainingTime) => oldRemainingTime - 1);
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [calculatedTime]);

    if (remainingTime > 0) {
        return (
            <div className="center">
                <div className="timeRemaining">
                    <MaterialSymbol className="icon" size={24} icon="schedule" />
                    <div className="text">{type == "ongoing" ? "Time Remaining: " : "Staring In: "} {calcRemainingTime(remainingTime)}</div>
                </div>
            </div>
        )
    }
}