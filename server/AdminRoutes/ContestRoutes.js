const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/contests/pending", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.contest_id) AS participant_count,
      organizer.organizer_name AS host_name,
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture
      FROM 
          contests w
      LEFT JOIN 
          contest_participants w_p
      ON 
          w.contest_id = w_p.contest_id
      LEFT JOIN 
          organizer
      ON 
          w.organizer_id = organizer.organizer_id
      WHERE
        w.approval_status = 0
      GROUP BY 
          w.contest_id;
    `;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ contests: result });
    });
  });

  router.post(
    "/contests/approve",
    verifyToken,
    (req, res) => {
      const userId = req.userId;
      const { contestId } = req.body;
      connection.query(
        `UPDATE contests SET approval_status = '1', approver_id = ? 
        WHERE contest_id = ?;`,
        [userId, contestId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );

  router.post(
    "/contests/reject",
    verifyToken,
    (req, res) => {
      const { contestId } = req.body;
      connection.query(
        `DELETE FROM contests 
        WHERE contest_id = ?;`,
        [contestId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );
};
