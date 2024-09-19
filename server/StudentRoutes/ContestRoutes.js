const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/contest", verifyToken, (req, res) => {
    const query = `
      SELECT contests.*,
      CASE 
        WHEN NOW() < contests.start_time THEN TIMESTAMPDIFF(SECOND, NOW(), contests.start_time)
        ELSE TIMESTAMPDIFF(SECOND, NOW(), contests.end_time)    
          END AS calculated_time,
          organizer.organizer_name AS organizer, 
          COUNT(contest_participants.contest_id) AS participant_count
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

    connection.query(query, (err, results) => {
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
  
    // Define queries
    const contestQuery = `
      SELECT * 
      FROM contests
      WHERE contest_id = ?`;
  
    const problemsQuery = `
      SELECT problem_id, contest_id, problem_details, sample_input, sample_output 
      FROM contest_problems
      WHERE contest_id = ?`;
  
    const participantsQuery = `
      SELECT cp.participant_id, cp.result_position, st.student_name AS participant_name
      FROM contest_participants cp
      JOIN student st ON cp.participant_id = st.student_id
      WHERE cp.contest_id = ?`;
  
    const submissionsQuery = `
      SELECT cs.participant_id, cs.problem_id, cs.submission_date_time, 
             p.problem_details AS problem_name, st.student_name AS participant_name
      FROM contest_submissions cs
      JOIN contest_problems p ON cs.problem_id = p.problem_id
      JOIN student st ON cs.participant_id = st.student_id
      WHERE p.contest_id = ?`;
  
    try {
      // Fetch contest details
      const contestResults = await queryPromise(contestQuery, [contestId]);
      if (contestResults.length === 0) {
        return res.json({ Error: "Contest not found" });
      }
      const contest = contestResults[0];
  
      // Fetch contest problems
      const problemsResults = await queryPromise(problemsQuery, [contestId]);
  
      // Fetch contest participants
      const participantsResults = await queryPromise(participantsQuery, [contestId]);
  
      // Fetch contest submissions
      const submissionsResults = await queryPromise(submissionsQuery, [contestId]);
  
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
};
