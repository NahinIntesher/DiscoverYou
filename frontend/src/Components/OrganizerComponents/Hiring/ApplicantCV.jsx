import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import Header from "../../CommonComponents/Header";

export default function ApplicantCV() {
    const { hiringId, applicantId } = useParams();
    return (
    <div className="mainContent">
      <Header title={"Applicant CV"} />
      <embed
        src={`http://localhost:3000/organizer/hirings/cv/cdn/${hiringId}/${applicantId}`}
        className="courseMaterial"
        type="application/pdf"
      />
    </div>
  );
}
