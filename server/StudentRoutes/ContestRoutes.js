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

  
};
