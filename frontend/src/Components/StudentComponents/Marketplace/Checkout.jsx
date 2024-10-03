import React, { useEffect, useState } from "react";
import dp from "../../../assets/images/desert.jpg";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import axios from "axios";
import Header from "../../CommonComponents/Header";
import { Link, useParams } from "react-router-dom";

export default function Checkout() {
    

    return (
        <div className="mainContent">
            <Header title={"Checkout"} />
        </div>
    );
}