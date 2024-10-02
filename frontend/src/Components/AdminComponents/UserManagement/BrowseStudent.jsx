import axios from "axios";
import React, { useEffect } from "react";
import UserBox from "./UserBox";

export default function BrowseStudent() {
  const [students, setStudents] = React.useState([]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/student/user-management/students")
      .then((response) => {
        console.log(response.data);
        setStudents(response.data.students);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="tabContent">
      {students.length > 0 ? (
        students.map(function (student) {
          return (
            <UserBox
              key={student.student_id}
              id={student.student_id}
              name={student.student_name}
              student_email={student.student_email}
              picture={student.student_picture}
              mobileNo={student.student_mobile_no}
              address={student.student_address}
              gender={student.student_gender}
              date_of_birth={student.student_date_of_birth}
            />
          );
        })
      ) : (
        <NotFound message="No student Found" />
      )}
    </div>
  );
}
