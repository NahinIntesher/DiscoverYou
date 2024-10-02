const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/contests/my", verifyToken, (req, res) => {
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
