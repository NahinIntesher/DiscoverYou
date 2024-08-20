import React from "react";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import "../../assets/styles/notfound.css"

export default function NotFound({message}) {
    return(
        <div className="notFound">
            <MaterialSymbol className="icon" size={100} icon="format_list_bulleted" />
            <div className="text">{message}</div> 
        </div>
    )
}