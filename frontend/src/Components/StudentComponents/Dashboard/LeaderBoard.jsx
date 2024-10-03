import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Leaderboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/student/dashboard/leaderboard")
      .then((response) => {
        setStudents(response.data.students);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
      });
  }, []);

  return (
    <div style={styles.leaderboardContainer}>
      <h2 style={styles.title}>Leaderboard</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Rank</th>
            <th style={styles.header}>Student Name</th>
            <th style={styles.header}>Points</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td style={styles.cell}>{index + 1}</td>
              <td style={styles.cell}>{student.name}</td>
              <td style={styles.cell}>{student.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles for the leaderboard
const styles = {
  leaderboardContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    margin: "10px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  header: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    textAlign: "left",
  },
  cell: {
    padding: "10px",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default Leaderboard;
