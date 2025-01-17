import axios from "axios";
import React, { useEffect, useState } from "react";
import UserBox from "./UserBox";
import NotFound from "../../CommonComponents/NotFound";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";

export default function BrowseStudent() {
  const [studentsData, setStudentsData] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchStudents = () => {
    axios
      .get("http://localhost:3000/admin/user-management/students")
      .then((res) => {
        const studentsData = res.data?.students || [];
        setStudentsData(studentsData);
        setStudents(studentsData);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let filteredstudentsData;
    let searchTextValue = name == "search" ? value : searchText;

    filteredstudentsData = studentsData.filter((student) =>
      student.student_name.toLowerCase().includes(searchTextValue.toLowerCase())
    );
    setStudents(filteredstudentsData);
    setSearchText(searchTextValue);
  };

  return (
    <div className="tabContent">
      <div className="filterBox filterBoxCommunity">
        <div className="searchBoxAdmin">
          <MaterialSymbol className="icon" size={22} icon="search" />
          <input
            name="search"
            onChange={handleInputChange}
            placeholder="Search by name..."
          />
        </div>
      </div>
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
