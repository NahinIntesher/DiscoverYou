import React from "react";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import "../../assets/styles/notfound.css"

export default function NotFoundAlt({icon, message}) {
    return(
        <div className="notFoundContainer">
            <div className="notFound">
                <MaterialSymbol className="icon" size={148} icon={icon} />
                <div className="text">{message}</div> 
            </div>
        </div>
    )
}