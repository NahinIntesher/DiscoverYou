const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/hirings/pending-details", verifyToken, (req, res) => {
    const userId = req.userId;

    connection.query(
      `SELECT 
      h.organizer_id
      FROM 
        hirings AS h
      WHERE
        h.organizer_id = '${userId}' AND h.approval_status = 0`,
      (err, results) => {
        if (err) throw err;

        return res.json({ pendingHiringsNo: results.length });
      }
    );
  });

  router.get("/hirings", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT h.*, COUNT(h_a.hiring_id) AS applicant_count,
      TIMESTAMPDIFF(SECOND,NOW(), h.end_time) AS calculated_time,
      organizer.organizer_name AS organizer_name,
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture
      FROM 
          hirings h
      LEFT JOIN 
          hiring_applicants h_a
      ON 
          h.hiring_id = h_a.hiring_id
      LEFT JOIN 
          organizer
      ON 
          h.organizer_id = organizer.organizer_id
      WHERE
        NOW() <= h.end_time AND h.approval_status = 1
      GROUP BY 
          h.hiring_id;
    `;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ hirings: result });
    });
  });


  router.get("/hirings/pending", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT h.*, COUNT(h_a.hiring_id) AS applicant_count,
      TIMESTAMPDIFF(SECOND,NOW(), h.end_time) AS calculated_time,
      organizer.organizer_name AS organizer_name,
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture
      FROM 
          hirings h
      LEFT JOIN 
          hiring_applicants h_a
      ON 
          h.hiring_id = h_a.hiring_id
      LEFT JOIN 
          organizer
      ON 
          h.organizer_id = organizer.organizer_id
      WHERE
        h.approval_status = 0
      GROUP BY 
          h.hiring_id;
    `;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ hirings: result });
    });
  });

  router.post("/hiring/approve", verifyToken, (req, res) => {
    const userId = req.userId;
    const { organizerId, hiringId } = req.body;
    connection.query(
      `UPDATE Hirings SET approval_status = '1', approver_id = ?
        WHERE hiring_id = ?;`,
      [userId, hiringId],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });

  router.post("/hiring/reject", verifyToken, (req, res) => {
    const { hiringId } = req.body;
    connection.query(
      `DELETE FROM hirings WHERE hiring_id = ?;`,
      [hiringId],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });
};
