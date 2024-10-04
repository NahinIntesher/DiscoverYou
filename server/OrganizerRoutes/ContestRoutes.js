const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/contests/ongoing", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT 
        contests.*,
        TIMESTAMPDIFF(SECOND, NOW(), contests.end_time) AS calculated_time,
        organizer.organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
        COUNT(contest_participants.contest_id) AS participant_count,
        CASE
          WHEN contests.organizer_id = ?
          THEN true
          ELSE false
        END AS is_own
      FROM 
        contests 
      JOIN 
        organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
        contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
        (NOW() >= contests.start_time) AND (NOW() <= contests.end_time) AND contests.approval_status = 1
      GROUP BY 
        contests.contest_id
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });

  router.get("/contests/upcoming", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT 
        contests.*,
        TIMESTAMPDIFF(SECOND, NOW(), contests.start_time) AS calculated_time, 
        organizer.organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
        COUNT(contest_participants.contest_id) AS participant_count,
        CASE
          WHEN contests.organizer_id = ?
          THEN true
          ELSE false
        END AS is_own
      FROM 
        contests 
      JOIN 
        organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
        contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
        NOW() < contests.start_time AND contests.approval_status = 1
      GROUP BY 
        contests.contest_id
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });

  router.get("/contests/previous", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT 
        contests.*,
        organizer.organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
        COUNT(contest_participants.contest_id) AS participant_count,
        CASE
          WHEN contests.organizer_id = ?
          THEN true
          ELSE false
        END AS is_own
      FROM 
        contests 
      JOIN 
        organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
        contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
        NOW() > contests.end_time AND contests.approval_status = 1
      GROUP BY 
        contests.contest_id
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });

  router.get("/contests/my", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT 
        contests.*,
        organizer.organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
        COUNT(contest_participants.contest_id) AS participant_count,
        CASE
          WHEN (NOW() >= contests.start_time) AND (NOW() <= contests.end_time)
          THEN TIMESTAMPDIFF(SECOND, NOW(), contests.end_time)
          ELSE TIMESTAMPDIFF(SECOND, NOW(), contests.start_time)
        END AS calculated_time,
        CASE
          WHEN (NOW() >= contests.start_time) AND (NOW() <= contests.end_time)
          THEN "ongoing"
          WHEN NOW() < contests.start_time 
          THEN "upcoming"
          ELSE "previous"
        END AS contest_type
      FROM 
        contests 
      JOIN 
        organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
        contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
        contests.approval_status = 1 AND contests.organizer_id = ?
      GROUP BY 
        contests.contest_id
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });


  router.get("/contests/profile", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT 
        c.contest_id, c.contest_name, c.contest_category, c.contest_details, COUNT(c.contest_id) AS total_contests,
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
        FROM contests c
        JOIN organizer o ON o.organizer_id = c.organizer_id
        WHERE c.organizer_id = ?`;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ contestResults: result });
    });
  });
};
