import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function Settings({interests}) {
    return (
        <div className="mainContent">
            <Header title={"Settings"}/>
            <div className="formBoxContainer">
                <div className="settingOptionBox">
                    <Link to="/profile/settings/change-password" className="settingOption">
                        <MaterialSymbol className="icon" size={24} icon="password" />
                        <div className="text">Change Password</div>
                    </Link>
                    <div className="settingOption">
                        <MaterialSymbol className="icon" size={24} icon="interests" />
                        <div className="text">Change Interests</div>
                    </div>
                    <div className="settingOption delete">
                        <MaterialSymbol className="icon" size={24} icon="delete" />
                        <div className="text">Delete Account</div>
                    </div>
                </div>
            </div>
        </div>
    )
}