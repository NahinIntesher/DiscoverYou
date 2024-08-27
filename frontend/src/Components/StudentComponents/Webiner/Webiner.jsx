import React from "react";
import "../../../assets/styles/dashboard.css";

export default function Webinar() {
  return (
    <div className="mainContent">
      <div className="text-3xl font-bold bg-[#f5d49f] p-5">Student Webinar</div>
      <div className="bg-gray-300 p-5 flex flex-col gap-10 h-screen">
        <div className="webinarContainer ">
        <div className="title">Ongoing Webinars</div>
          <div className="webinar bg-zinc-200 rounded-xl p-2 m-2">
            <div className="webinarTitle">Webinar 1</div>
            <div className="webinarDescription">
              This is a description of the webinar
            </div>
            <div className="webinarDate">Date: 12/12/2021</div>
            <div className="webinarTime">Time: 12:00 PM</div>
          </div>
        </div>
        <div className="webinarContainer ">
        <div className="title">Upcoming Webinars</div>
          <div className="webinar bg-zinc-200 rounded-xl p-2 m-2">
            <div className="webinarTitle">Webinar 1</div>
            <div className="webinarDescription">
              This is a description of the webinar
            </div>
            <div className="webinarDate">Date: 12/12/2021</div>
            <div className="webinarTime">Time: 12:00 PM</div>
          </div>
        </div>
        <div className="webinarContainer ">
        <div className="title">Previous Webinars</div>
          <div className="webinar bg-zinc-200 rounded-xl p-2 m-2">
            <div className="webinarTitle">Webinar 1</div>
            <div className="webinarDescription">
              This is a description of the webinar
            </div>
            <div className="webinarDate">Date: 12/12/2021</div>
            <div className="webinarTime">Time: 12:00 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
