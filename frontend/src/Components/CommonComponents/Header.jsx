import React from "react";
import { useNavigate } from "react-router-dom";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

export default function Header({title, semiTitle}) {
    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return (
        <div className="header">
            <MaterialSymbol onClick={goBack} className="backIcon" size={24} icon="arrow_back"/>
            <div className="text">
                <div className="title">{title}</div>
                <div className="semiTitle">{semiTitle}</div>
            </div>
        </div>
    )
}