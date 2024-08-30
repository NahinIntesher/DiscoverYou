const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/webinars", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `SELECT 
    w.*,
    COALESCE(COUNT(p.participant_id), 0) AS participants_count
    FROM 
        webinars w
    LEFT JOIN 
        webinar_participants p
    ON 
        w.webinar_id = p.webinar_id
    GROUP BY 
        w.webinar_id;
`;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ webinars: result });
    });
  });

  router.get("/webinars/:webinarId/register", verifyToken, (req, res) => {
    const userId = req.userId;
    const { webinarId } = req.params;

    if (!userId) {
      return res.json({ message: "User ID is required" });
    }

    // Check if user is already registered
    connection.query(
      "SELECT * FROM webinar_participants WHERE webinar_id = ? AND participant_id = ?",
      [webinarId, userId],
      (err, results) => {
        if (err) {
          return res.json({ message: "Database query failed" });
        }

        if (results.length > 0) { 
          // User is already registered
          return res.json({
            isRegistered: true,
            results: results[0],
            message: "You are already registered for this webinar",
          });
        } else {
          res.json({
            isRegistered: false,
            results: results,
            message: "You are not registered for this webinar",
          });
        }
      }
    );
  });
  router.post("/webinars/:webinarId/register", verifyToken, (req, res) => {
    const userId = req.userId;
    const { webinarId } = req.params;
    // const registration_status = 1;

    if (!userId) {
      return res.json({ message: "User ID is required" });
    }
    // Register user
    connection.query(
      "INSERT INTO webinar_participants (webinar_id, participant_id) VALUES (?, ?)",
      [webinarId, userId],
      (err) => {
        if (err) {
          return res.json({
            message: "Failed to register for the webinar",
          });
        }

        return res.json({
          isRegistered: true,
          message: "Successfully registered for the webinar",
        });
      }
    );
  });
};
