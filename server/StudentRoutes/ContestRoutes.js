const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/contest", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT contests.*,
      CASE 
        WHEN NOW() < contests.start_time THEN TIMESTAMPDIFF(SECOND, NOW(), contests.start_time)
        ELSE TIMESTAMPDIFF(SECOND, NOW(), contests.end_time)    
          END AS calculated_time,
          organizer.organizer_name AS organizer, 
          COUNT(contest_participants.contest_id) AS participant_count,
      CASE
        WHEN EXISTS (
          SELECT * FROM contest_participants
          WHERE contest_participants.contest_id = contests.contest_id
          AND contest_participants.participant_id = ?
        )
        THEN true
        ELSE false
      END AS is_joined
      
      FROM 
          contests 
      JOIN 
          organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
          contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
          contests.approval_status = 1
      GROUP BY 
          contests.contest_id, 
          organizer.organizer_name
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });

  const queryPromise = (query, params) => {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  };

  router.get("/contest/:contestId", verifyToken, async (req, res) => {
    const { contestId } = req.params;
    const userId = req.userId;

    // Define queries
    const contestQuery = `
      SELECT contests.*,
      CASE 
        WHEN NOW() < contests.start_time THEN TIMESTAMPDIFF(SECOND, NOW(), contests.start_time)
        ELSE TIMESTAMPDIFF(SECOND, NOW(), contests.end_time)    
          END AS calculated_time,
          organizer.organizer_name AS organizer_name, 
          COUNT(contest_participants.contest_id) AS participant_count,
      CASE
        WHEN EXISTS (
          SELECT * FROM contest_participants
          WHERE contest_participants.contest_id = contests.contest_id
          AND contest_participants.participant_id = ?
        )
        THEN 1
        ELSE 0
      END AS is_joined
      
      FROM 
          contests 
      LEFT JOIN 
          organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
          contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
          contests.approval_status = 1 && contests.contest_id = ?
      GROUP BY 
          contests.contest_id, 
          organizer.organizer_name`;

    const problemsQuery = `
      SELECT problem_id, contest_id, problem_description, sample_input, sample_output 
      FROM contest_problems
      WHERE contest_id = ?`;

    const participantsQuery = `
      SELECT cp.participant_id, cp.result_position, st.student_name AS participant_name
      FROM contest_participants cp
      JOIN student st ON cp.participant_id = st.student_id
      WHERE cp.contest_id = ?`;

    const submissionsQuery = `
      SELECT cs.*, 
             p.problem_description AS problem_name, st.student_name AS participant_name
      FROM contest_submissions cs
      JOIN contest_problems p ON cs.problem_id = p.problem_id
      JOIN student st ON cs.participant_id = st.student_id
      WHERE p.contest_id = ?`;

    try {
      // Fetch contest details
      const contestResults = await queryPromise(contestQuery, [
        userId,
        contestId
      ]);
      // if (contestResults.length === 0) {
      //   return res.json({ Error: "Contest not found" });
      // }
      const contest = contestResults[0];

      // Fetch contest problems
      const problemsResults = await queryPromise(problemsQuery, [contestId]);

      // Fetch contest participants
      const participantsResults = await queryPromise(participantsQuery, [
        contestId,
      ]);

      // Fetch contest submissions
      const submissionsResults = await queryPromise(submissionsQuery, [
        contestId,
      ]);

      // Combine and return the results
      return res.json({
        contest,
        problems: problemsResults,
        participants: participantsResults,
        submissions: submissionsResults,
      });
    } catch (error) {
      console.error("Error fetching contest data:", error);
      return res.json({ Error: "Error fetching contest data" });
    }
  });

  router.post("/contest/register", verifyToken, (req, res) => {
    const userId = req.userId;
    const { contestId } = req.body;

    connection.query(
      "SELECT * FROM contest_participants WHERE contest_id = ? AND participant_id = ?",
      [contestId, userId],
      (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          connection.query(
            "DELETE FROM contest_participants WHERE contest_id = ? AND participant_id = ?;",
            [contestId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Unregistered" });
            }
          );
        } else {
          connection.query(
            "INSERT INTO contest_participants(contest_id, participant_id) VALUES (?, ?);",
            [contestId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Registered" });
            }
          );
        }
      }
    );
  });
};
