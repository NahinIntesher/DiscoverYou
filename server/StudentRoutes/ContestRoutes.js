const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/contest", verifyToken, (req, res) => {
    const query = `SELECT 
      contest.*, 
      CASE 
          WHEN NOW() < contest.start_time THEN TIMESTAMPDIFF(SECOND, NOW(), contest.start_time)
          ELSE TIMESTAMPDIFF(SECOND,NOW(), contest.end_time)    
      END AS calculated_time,
      user.name AS organizer, 
      COUNT(contest_participants.contest_id) AS participant_count
      FROM 
        contest 
      JOIN 
        user ON contest.organizer_id = user.user_id 
      JOIN 
        contest_participants ON contest.contest_id = contest_participants.contest_id 
      WHERE 
        contest.approval_status = 1
      GROUP BY 
        contest.contest_id, 
        user.name`;

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });

  router.get("/contest/:contestId", verifyToken, (req, res) => {
    const { contestId } = req.params;

    // Fetch contest details
    const contestQuery = `
        SELECT * FROM contest
        WHERE contest_id = ?`;

    connection.query(contestQuery, [contestId], (err, contestResults) => {
      if (err) {
        console.error("Error fetching contest:", err);
        return res.json({ Error: "Error fetching contest" });
      }
      if (contestResults.length === 0) {
        return res.json({ Error: "Contest not found" });
      }

      // Fetch contest problems
      const problemsQuery = `
            SELECT * FROM contest_problems
            WHERE contest_id = ?`;

      connection.query(problemsQuery, [contestId], (err, problemsResults) => {
        if (err) {
          console.error("Error fetching contest problems:", err);
          return res.json({ Error: "Error fetching contest problems" });
        }

        // Fetch contest participants
        const participantsQuery = `
            SELECT cp.participant_id,cp.result_position, u.name AS participant_name
            FROM contest_participants cp
            JOIN user u ON cp.participant_id = u.user_id
            WHERE cp.contest_id = ?`;

        connection.query(
          participantsQuery,
          [contestId],
          (err, participantsResults) => {
            if (err) {
              console.error("Error fetching contest participants:", err);
              return res.json({ Error: "Error fetching contest participants" });
            }

            // Combine the results
            return res.json({
              contest: contestResults[0],
              problems: problemsResults,
              participants: participantsResults,
            });
          }
        );
      });
    });
  });
};
