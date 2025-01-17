const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router, multer) => {
  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 10 MB
    fileFilter: (req, file, cb) => {
      const filetypes = /application\//; // Accept all image
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype) {
        return cb(null, true);
      } else {
        cb("Error: Images or PDF files only!");
      }
    },
  });

  router.get("/hirings", verifyToken, (req, res) => {
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
        NOW() <= h.end_time AND h.approval_status = 1
      GROUP BY 
          h.hiring_id;
    `;
    connection.query(query, [userId], (err, hiringResult) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }
      connection.query(`
        SELECT * FROM hiring_applicants
        WHERE applicant_id = ? AND req_for_join_status = 0;  
      `, [userId], (err, applyPendingResult) => {
        if (err) {
          console.log(err);
          return res.json({ message: "Failed" });
        }
        return res.json({ hirings: hiringResult, applyPending: applyPendingResult.length });
      });
    });
  });

  router.post("/hirings/apply", 
    upload.array("cv"), verifyToken, (req, res) => {
    const userId = req.userId;
    const { hiringId } = req.body;
    const files = req.files;

    if (files.length != 0) {
      const { buffer } = files[0];
      connection.query(
        "INSERT INTO hiring_applicants(hiring_id, applicant_id, applicant_cv) VALUES (?, ?, ?);",
        [hiringId, userId, buffer],
        (err, result) => {
          if (err) {
            console.error("Database insertion error:", err);
            throw err;
          }
          res.json({
            status: "Success",
          });
        }
      );
    } else {
      res.json({
        status: "Unsuccessful",
        message: "No file selected",
      });
    }

    // connection.query(
    //   "SELECT * FROM hiring_applicants WHERE hiring_id = ? AND applicant_id = ?",
    //   [hiringId, userId],
    //   (err, results) => {
    //     if (err) throw err;

    //     if (results.length > 0) {
    //       connection.query(
    //         "DELETE FROM hiring_applicants WHERE hiring_id = ? AND applicant_id = ?;",
    //         [hiringId, userId],
    //         function (err, results) {
    //           if (err) throw err;
    //           return res.json({ status: "Unregistered" });
    //         }
    //       );
    //     } else {
    //       connection.query(
    //         "INSERT INTO hiring_applicants(hiring_id, applicant_id) VALUES (?, ?);",
    //         [hiringId, userId],
    //         function (err, results) {
    //           if (err) throw err;
    //           return res.json({ status: "Registered" });
    //         }
    //       );
    //     }
    //   }
    // );

  });


  router.post("/hirings/cancel-apply", verifyToken, (req, res) => {
    const userId = req.userId;
    const { hiringId } = req.body;

    connection.query(
      "DELETE FROM hiring_applicants WHERE hiring_id = ? AND applicant_id = ?;",
      [hiringId, userId],
      function (err, results) {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });

  router.get("/hirings/pending", verifyToken, (req, res) => {
    const userId = req.userId;

    connection.query(
      `SELECT h_a.*, h.*, o.organizer_name,
      IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
      FROM hiring_applicants AS h_a
      JOIN hirings AS h
      ON h_a.hiring_id = h.hiring_id
      JOIN organizer AS o
      ON h.organizer_id = o.organizer_id
      WHERE req_for_join_status = 0 AND applicant_id = ?`,
      [userId],
      (err, results) => {
        if (err) throw err;

        return res.json({ applications: results });
      }
    );
  });

  router.get("/hirings/:hiringId", verifyToken, (req, res) => {
    const userId = req.userId;
    const { hiringId } = req.params;

    // Fetch hiring details
    const hiringQuery = `
      SELECT h.*, COUNT(h_a.hiring_id) AS applicant_count,
        TIMESTAMPDIFF(SECOND,NOW(), h.end_time) AS calculated_time,
        organizer.organizer_name AS organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture,
        CASE 
          WHEN NOW() >= h.end_time THEN "previous"
          ELSE "ongoing"  
        END AS hiring_type,
        CASE
          WHEN EXISTS (
            SELECT *
            FROM hiring_applicants
            WHERE hiring_applicants.hiring_id = h.hiring_id 
            AND hiring_applicants.applicant_id = '${userId}'
          )
          THEN true
          ELSE false
        END AS is_applied,
        CASE
          WHEN EXISTS (
            SELECT h_a.*
            FROM hiring_applicants h_a
            WHERE h_a.hiring_id = h.hiring_id AND h_a.req_for_join_status = 1
          )
          THEN 1
          ELSE 0
        END AS is_hired
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
        WHERE h.hiring_id = ?;
      `;

    // Fetch hiring applicants
    const applicantsQuery = `
    SELECT hiring_applicants.*, student.student_name AS applicant_name,
    IF(student.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", student.student_id), NULL) AS applicant_picture
    FROM hiring_applicants
    JOIN student ON hiring_applicants.applicant_id = student.student_id
    WHERE hiring_applicants.hiring_id = ?`;

    connection.query(hiringQuery, [hiringId], (err, hiringResults) => {
      if (err) {
        console.error("Error fetching hiring:", err);
        return res.json({ error: "Error fetching hiring details" });
      }
      if (hiringResults.length === 0) {
        return res.json({ error: "hiring not found" });
      }

      connection.query(
        applicantsQuery,
        [hiringId],
        (err, applicantsResults) => {
          if (err) {
            console.error("Error fetching hiring applicants:", err);
            return res.json({ error: "Error fetching hiring applicants" });
          }
          return res.json({
            hiring: hiringResults[0],
            applicants: applicantsResults,
          });
        }
      );
    });
  });


};
