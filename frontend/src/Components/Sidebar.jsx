import React, {Image} from "react";
import "../assets/styles/sidebar.css"
import SidebarOption from "./SidebarOption";
import dp from "../assets/images/desert.jpg";

export default function Sidebar(props) {
    return (
    <div className="sideMenu">
        <div class="optionContainer">
            <SidebarOption name="Dashboard" icon="dashboard"/>
            <SidebarOption name="Showcase" icon="gallery_thumbnail"/>
            <SidebarOption name="Contest" icon="rewarded_ads" status="active"/>
            <SidebarOption name="Community" icon="groups"/>
            <SidebarOption name="Course" icon="auto_stories"/>
            <SidebarOption name="Webinar" icon="patient_list"/>
            <SidebarOption name="Marketplace" icon="shopping_cart"/>
            <SidebarOption name="Hiring" icon="person_search"/>
            <SidebarOption name="Notifcation" icon="notifications_active"/>
            <SidebarOption name="Profile" icon="person"/>
        </div>
        <div class="profile">
            <div className="profilePicture">
                <img src={dp}/>
            </div>
            <div class="details">
                <div class="name">{props.user.name}</div>
                <div class="email">nahina@gmail.com</div>
            </div>
        </div>
    </div>
    );
}