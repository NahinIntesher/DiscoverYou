import axios from "axios";
import React, { useEffect, useState } from "react";
import UserBox from "./UserBox";
import NotFound from "../../CommonComponents/NotFound";

export default function BrowseStudent() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  function fetchStudents() {
    axios
      .get("http://localhost:3000/admin/user-management/students")
      .then((response) => {
        setStudents(response.data.students);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="tabContent">
      <div className="participantList">
      {students.length > 0 ? (
        students.map((student) => (
          <UserBox
            key={student.student_id}
            id={student.student_id}
            name={student.student_name}
            email={student.student_email}
            picture={student.student_picture}
            mobileNo={student.student_mobile_no}
            address={student.student_address}
            gender={student.student_gender}
            date_of_birth={student.student_date_of_birth}
            refreshUsers={fetchStudents}
          />
        ))
      ) : (
        <NotFound message="No student Found" />
      )}
      </div>
    </div>
  );
}
