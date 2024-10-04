import React from "react";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { NavLink } from "react-router-dom";

export default function SidebarOption(props) {
  console.log(props.badge);
  return (
    <NavLink
      to={props.href}
      className={({ isActive }) => (isActive ? "activeOption" : "option")}
    >
      <MaterialSymbol className="icon" size={22} icon={props.icon} />
      <div className="text">
        <div style={{ display: "flex" }}>
          <div>{props.name}</div>
          {props.badge && <div className="badge text">{props.badge}</div>}
        </div>
      </div>
    </NavLink>
  );
}
