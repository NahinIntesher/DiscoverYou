import React from "react";
import dp from "../../assets/images/desert.jpg";

export default function MessageBox({message,ownMessage,messengerName}) {
    if(ownMessage) {
        return (
            <div className="messageBox ownMessage">
                <div className="messageContent">
                    <div className="name">
                        {messengerName}
                    </div>
                    <div className="message">
                        {message}
                    </div>
                </div>
                <div className="profilePicture">
                    <img src={dp}/>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="messageBox">
                <div className="profilePicture">
                    <img src={dp}/>
                </div>
                <div className="messageContent">
                    <div className="name">
                        {messengerName}
                    </div>
                    <div className="message">
                        {message}
                    </div>
                </div>
            </div>
        )
    }
}