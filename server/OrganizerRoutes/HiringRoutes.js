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
      const filetypes = /application\//; // PDF files only
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype) {
        return cb(null, true);
      } else {
        cb("Error: Images or PDF files only!");
      }
    },
  });

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
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ hirings: result });
    });
  });

  router.get("/hirings/my", verifyToken, (req, res) => {
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
        NOW() <= h.end_time AND h.approval_status = 1 AND h.organizer_id = ?
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

  router.get("/hirings/profile", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT 
        h.hiring_id, h.company_name, h.job_name, h.job_category, h.job_description, COUNT(h.hiring_id) AS total_hirings,
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
        FROM hirings h
        JOIN organizer o ON o.organizer_id = h.organizer_id
        WHERE h.organizer_id = ?`;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ hiringResults: result });
    });
  });

  router.post("/hirings/apply", verifyToken, (req, res) => {
    const userId = req.userId;
    const { hiringId } = req.body;

    connection.query(
      "SELECT * FROM hiring_applicants WHERE hiring_id = ? AND applicant_id = ?",
      [hiringId, userId],
      (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          connection.query(
            "DELETE FROM hiring_applicants WHERE hiring_id = ? AND applicant_id = ?;",
            [hiringId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Unregistered" });
            }
          );
        } else {
          connection.query(
            "INSERT INTO hiring_participants(hiring_id, applicant_id) VALUES (?, ?);",
            [hiringId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Registered" });
            }
          );
        }
      }
    );
  });

  router.post("/hiring/new", verifyToken, (req, res) => {
    const userId = req.userId;

    const {
      companyName,
      jobName,
      jobCategory,
      jobDescription,
      jobSalary,
      endTime,
    } = req.body;

    connection.query(
      `INSERT INTO hirings (company_name, job_name, job_category, job_description, job_salary, end_time, organizer_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        companyName,
        jobName,
        jobCategory,
        jobDescription,
        jobSalary,
        endTime,
        userId,
      ],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });

  router.get("/hirings/pending", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT h.*, COUNT(h_a.hiring_id) AS applicant_count,
      TIMESTAMPDIFF(SECOND,NOW(), h.end_time) AS calculated_time,
      organizer.organizer_name AS organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM hiring_applicants
          WHERE hiring_applicants.hiring_id = h.hiring_id
        )
        THEN true
        ELSE false
      END AS is_joined
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
        h.organizer_id = '${userId}' AND h.approval_status = 0
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
      IF(hiring_applicants.applicant_cv IS NOT NULL, CONCAT("http://localhost:3000/organizer/hirings/cv/cdn/", hiring_applicants.hiring_id, '/', student.student_id), NULL) AS applicant_cv,
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
            status: "Success",
            hiring: hiringResults[0],
            applicants: applicantsResults,
          });
        }
      );
    });
  });

  router.get("/hirings/cv/cdn/:id/:applicantId", (req, res) => {
    const hiringId = req.params.id;
    const applicantId = req.params.applicantId;

    console.log("hiringId", hiringId);
    console.log("applicantId", applicantId);
    connection.query(
      `
    SELECT * FROM hiring_applicants
    WHERE hiring_id = ? AND applicant_id = ?;
  `,
      [hiringId, applicantId],
      (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          return res.status(404).send("CV not found.");
        }

        const media = results[0];
        const mediaData = media.applicant_cv;

        res.setHeader("Content-Type", "application/pdf");
        res.send(mediaData);
      }
    );
  });

  router.post("/hirings/delete", verifyToken, (req, res) => {
    const userId = req.userId;
    const { hiringId } = req.body;
    console.log("hiringId", hiringId);

    connection.query(
      "DELETE FROM hirings WHERE hiring_id = ? AND organizer_id = ?;",
      [hiringId, userId],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });

  router.post("/hirings/edit/:hiringId", verifyToken, (req, res) => {
    const userId = req.userId;
    const {
      companyName,
      jobName,
      jobCategory,
      jobDescription,
      jobSalary,
      endTime,
    } = req.body; // Change from req.query to req.body
    const { hiringId } = req.params; // Extract hiringId from params

    connection.query(
      `UPDATE hirings SET company_name = ?, job_name = ?, job_category = ?, job_description = ?, job_salary = ?, end_time = ?
       WHERE hiring_id = ? AND organizer_id = ?`,
      [
        companyName,
        jobName,
        jobCategory,
        jobDescription,
        jobSalary,
        endTime,
        hiringId,
        userId,
      ],
      (err, results) => {
        if (err) {
          console.error("Error updating hiring details:", err);
          return res.json({ error: "Failed to update hiring details" });
        }
        return res.json({ status: "Success" });
      }
    );
  });

  router.post("/hirings/accept-applicant", verifyToken, (req, res) => {
    const { applicantId, hiringId } = req.body;

    connection.query(
      "UPDATE hiring_applicants SET req_for_join_status = 1 WHERE hiring_id = ? AND applicant_id = ?;",
      [hiringId, applicantId],
      function (err, results) {
        if (err) throw err;
        return res.json({ status: "Success" });
        // `INSERT INTO
        // notification (name, description, toLink, receiver_id)
        // VALUE(
        //   "Your Hiring Application Has been Approved!",
        //   "${organizerName} Accepted your job application for ${job_name} job at ${company_name}"
        //   "/hirings/${hiring_id}",
        //   ${applicantId}
        // )
        // `
      }
    );
  });
};
