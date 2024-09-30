import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";


export default function Settings({setUser, setAuthorized}) {
    const [deleteBoxActive, setDeleteBoxActive] = useState(false);
    const navigate = useNavigate();

    const handleDelete = () => {
        axios.defaults.withCredentials = true;
        axios
        .post("http://localhost:3000/organizer/profile/settings/delete")
        .then((res) => {
          if (res.data.status === "Success") {
            setAuthorized(false);
            setUser({});
            navigate("/");
          } else {
            alert("Cannot delete profile!");
          }
        })
        .catch((err) => console.log(err));
    }
        
    
    

    return (
        <div className="mainContent">
            <Header title={"Settings"}/>
            <div className="formBoxContainer">
                <div className={deleteBoxActive ? "dialogBoxBackground" : "none"}>
                    <div className="dialogBox">
                        <div className="title">Delete Account</div>
                        <div className="details">Do you want to delete your account permanently?</div>
                        <div className="buttonContainer"> 
                            <div className="button" onClick={handleDelete}>Yes</div>
                            <div className="buttonAlt" onClick={()=> {setDeleteBoxActive(false)}}>Cancel</div>
                        </div>
                    </div>
                </div>
                <div className="settingOptionBox">
                    <Link to="/profile/settings/change-password" className="settingOption">
                        <MaterialSymbol className="icon" size={24} icon="password" />
                        <div className="text">Change Password</div>
                    </Link>
                    <Link to="/profile/settings/change-profile-picture" className="settingOption">
                        <MaterialSymbol className="icon" size={24} icon="person" />
                        <div className="text">Change Profile Picture</div>
                    </Link>
                    <div onClick={()=> {setDeleteBoxActive(true)}} className="settingOption delete">
                        <MaterialSymbol className="icon" size={24} icon="delete" />
                        <div className="text">Delete Account</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
