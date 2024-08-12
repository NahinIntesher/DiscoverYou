import React from "react";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

export default function SidebarOption(props) {
    return (
        <div className={props.status=="active" ? "activeOption" : "option"}>
            <MaterialSymbol className="icon" size={20} icon={props.icon}/>
            <div className="text">{props.name}</div>
        </div>
    )
}