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
    <div style={styles.leaderboardContainer} className="shadow-xl">
      <h2 className="text-sm font-semibold text-black">Student</h2>
      <h2 className="text-sm font-semibold text-black" style={styles.title}>
        Leaderboard
      </h2>
      <table className="text-sm  text-black">
        <thead>
          <tr>
            <th style={styles.header}>Rank</th>
            <th style={styles.header}>Name</th>
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
    backgroundColor: "rgb(var(--extralight))",
    borderRadius: "8px",
    // boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    marginTop: "5px",
    marginRight: "5px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px",
    borderBottom: "5px solid #2a2a2a",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  header: {
    backgroundColor: "rgb(var(--light))",
    padding: "10px",
    textAlign: "left",
  },
  cell: {
    padding: "10px",
    borderBottom: "1px solid #000000",
  },
};

export default Leaderboard;
