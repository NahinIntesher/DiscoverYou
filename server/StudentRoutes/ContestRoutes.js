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
      const filetypes = /image\/|audio\/|video\/|\application\//; // Accept all image
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype) {
        return cb(null, true);
      } else {
        cb("Error: Images or PDF files only!");
      }
    },
  });


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
          WHEN EXISTS (
            SELECT * FROM contest_participants
            WHERE contest_participants.contest_id = contests.contest_id
            AND contest_participants.participant_id = ?
          )
          THEN true
          ELSE false
        END AS is_joined
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

    connection.query(query, [userId, userId], (err, results) => {
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
          WHEN EXISTS (
            SELECT * FROM contest_participants
            WHERE contest_participants.contest_id = contests.contest_id
            AND contest_participants.participant_id = ?
          )
          THEN true
          ELSE false
        END AS is_joined
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
          WHEN EXISTS (
            SELECT * FROM contest_participants
            WHERE contest_participants.contest_id = contests.contest_id
            AND contest_participants.participant_id = ?
          )
          THEN true
          ELSE false
        END AS is_joined
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

  const queryPromise = (query, params) => {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  };


  router.get("/contests/my", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT 
        c.contest_name, 
        c.contest_details, 
        c.contest_category, 
        COUNT(c_p.contest_id) AS participant_count, 
        organizer.organizer_name AS organizer_name,
        c_p.result_position AS rank
    FROM 
        contests c
    JOIN 
        contest_participants c_p
    ON 
        c.contest_id = c_p.contest_id
    LEFT JOIN 
        organizer
    ON 
        c.organizer_id = organizer.organizer_id
    WHERE
        c_p.participant_id = '${userId}'
    GROUP BY 
        c_p.contest_id;
    `;
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ myContests: result });
    });
  });
  

  router.get("/contests/:contestId", verifyToken, async (req, res) => {
    const { contestId } = req.params;
    const userId = req.userId;

    // Define queries
    const contestQuery = `
      SELECT contests.*,
      CASE 
        WHEN NOW() < contests.start_time THEN TIMESTAMPDIFF(SECOND, NOW(), contests.start_time)
        ELSE TIMESTAMPDIFF(SECOND, NOW(), contests.end_time)    
          END AS calculated_time,
      organizer.organizer_name AS organizer_name, 
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
      COUNT(contest_participants.contest_id) AS participant_count,
      CASE
        WHEN (NOW() >= contests.start_time) AND (NOW() <= contests.end_time)
        THEN "ongoing"
        WHEN NOW() < contests.start_time 
        THEN "upcoming"
        ELSE "previous"
      END AS contest_type,
      CASE
        WHEN EXISTS (
          SELECT * FROM contest_participants
          WHERE contest_participants.contest_id = contests.contest_id
          AND contest_participants.participant_id = ?
        )
        THEN 1
        ELSE 0
      END AS is_joined,
      CASE
        WHEN EXISTS (
          SELECT * FROM contest_submissions
          WHERE contest_submissions.contest_id = contests.contest_id
          AND contest_submissions.participant_id = ?
        )
        THEN 1
        ELSE 0
      END AS is_submitted
      FROM 
          contests 
      LEFT JOIN 
          organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
          contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
          contests.approval_status = 1 && contests.contest_id = ?
      GROUP BY 
          contests.contest_id;`;

    const problemsQuery = `
      SELECT problem_id, contest_id, problem_description, problem_name, sample_input, sample_output 
      FROM contest_problems
      WHERE contest_id = ?`;

    const participantsQuery = `
      SELECT 
        cp.participant_id, 
        cp.result_position, 
        st.student_name AS participant_name,
        IF(st.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", st.student_id), NULL) AS participant_picture,
        CASE
          WHEN EXISTS (
            SELECT * FROM contest_submissions
            WHERE contest_submissions.contest_id = ?
            AND contest_submissions.participant_id = cp.participant_id
          )
          THEN 1
          ELSE 0
        END AS is_submitted
      FROM 
        contest_participants cp
      JOIN 
        student st ON cp.participant_id = st.student_id
      WHERE 
        cp.contest_id = ?
      ORDER BY 
        cp.result_position`;

    try {
      // Fetch contest details
      const contestResults = await queryPromise(contestQuery, [
        userId,
        userId,
        contestId
      ]);
      // if (contestResults.length === 0) {
      //   return res.json({ Error: "Contest not found" });
      // }
      const contest = contestResults[0];

      // Fetch contest problems
      const problemsResults = await queryPromise(problemsQuery, [contestId]);

      // Fetch contest participants
      const participantsResults = await queryPromise(participantsQuery, [
        contestId, contestId
      ]);

      // Combine and return the results
      return res.json({
        contest,
        problems: problemsResults,
        participants: participantsResults
      });
    } catch (error) {
      console.error("Error fetching contest data:", error);
      return res.json({ Error: "Error fetching contest data" });
    }
  });

  router.post("/contest/register", verifyToken, (req, res) => {
    const userId = req.userId;
    const { contestId } = req.body;

    connection.query(
      "SELECT * FROM contest_participants WHERE contest_id = ? AND participant_id = ?",
      [contestId, userId],
      (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          connection.query(
            "DELETE FROM contest_participants WHERE contest_id = ? AND participant_id = ?;",
            [contestId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Unregistered" });
            }
          );
        } else {
          connection.query(
            "INSERT INTO contest_participants(contest_id, participant_id) VALUES (?, ?);",
            [contestId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Registered" });
            }
          );
        }
      }
    );
  });

  
  router.get("/courses/material/:id", (req, res) => {
    const materialId = req.params.id;

    connection.query(
      `
    SELECT c_m.material_name, c_m.material_type, c.course_name as course_name,
    CONCAT('http://localhost:3000/student/courses/material/cdn/', c_m.material_id) AS material_link
    FROM course_materials AS c_m 
    JOIN courses AS c
    ON c_m.course_id = c.course_id
    WHERE material_id = ?
  `,
      [materialId],
      (err, results) => {
        if (err) throw err;

        return res.json({
          material: results[0]
        });
      }
    );
  });

  router.post("/contests/submission", upload.array("submissionMedia"), verifyToken, (req, res) => {
    const userId = req.userId;

    const { contestId, contestCategory, submissionText } = req.body;

    const files = req.files;

    if(contestCategory == "Art & Craft" || contestCategory == "Graphics Designing" || contestCategory == "Singing" || contestCategory == "Photography") {
      if (files.length != 0) {
        const { buffer, mimetype} = files[0];
        connection.query(
          `INSERT INTO contest_submissions(contest_id, participant_id, submission_blob, submission_type)
          VALUES(?, ?, ?, ?)`,
          [contestId, userId, buffer, mimetype],
          (err, result) => {
            if (err) {
              console.error("Database insertion error:", err);
              throw err;
            }
            res.json({
              status: "Success"
            });
          }
        );
      }
      else {
        res.json({
          status: "Unsuccessful",
          message: "No file selected",
        });
      } 
    }
    else {
      connection.query(
        `INSERT INTO contest_submissions(contest_id, participant_id, submission_text, submission_type)
        VALUES(?, ?, ?, 'text')`,
        [contestId, userId, submissionText],
        (err, result) => {
          if (err) {
            console.error("Database insertion error:", err);
            throw err;
          }
          res.json({
            status: "Success"
          });
        }
      );
    }
  });

  router.get("/contests/submission/cdn/:contestId/:participantId", (req, res) => {
    const {contestId, participantId} = req.params;

    connection.query(
      `
    SELECT *
    FROM contest_submissions 
    WHERE contest_id = ? AND participant_id = ?
  `,
      [contestId, participantId],
      (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          return res.status(404).send("Material not found.");
        }

        const media = results[0];
        const mediaType = media.submission_type;
        const mediaData = media.submission_blob;

        res.setHeader("Content-Type", mediaType);

        res.send(mediaData);
      }
    );
  });

  router.get("/contests/submission/:contestId/:participantId", (req, res) => {
    const {contestId, participantId} = req.params;

    connection.query(
      `
    SELECT c_c.submission_type, c_c.submission_text, c.contest_name, s.student_name AS participant_name,
    CONCAT('http://localhost:3000/student/contests/submission/cdn/', c_c.contest_id, '/', c_c.participant_id) AS submission_link
    FROM contest_submissions AS c_c 
    JOIN contests AS c
    ON c_c.contest_id = c.contest_id
    JOIN student AS s
    ON c_c.participant_id = s.student_id
    WHERE c_c.contest_id = ? AND c_c.participant_id = ?
  `,
      [contestId, participantId],
      (err, results) => {
        if (err) throw err;

        return res.json({
          material: results[0]
        });
      }
    );
  });

};