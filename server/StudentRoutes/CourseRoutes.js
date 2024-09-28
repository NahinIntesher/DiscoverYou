const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/course", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `SELECT 
      c.*, 
      s.student_name AS course_mentor_name,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM course_participants
          WHERE course_participants.course_id = c.course_id 
          AND course_participants.participant_id = '${userId}' AND course_participants.req_for_join_status = 1
        )
        THEN "yes"
        WHEN EXISTS (
          SELECT *
          FROM course_participants
          WHERE course_participants.course_id = c.course_id 
          AND course_participants.participant_id = '${userId}' AND course_participants.req_for_join_status = 0
        )
        THEN "pending"
        ELSE "no"
      END AS is_joined,
      COUNT(DISTINCT c_p.participant_id) AS total_member
      FROM 
        courses AS c
      LEFT JOIN 
        student AS s
      ON 
        c.mentor_id = s.student_id
      LEFT JOIN 
        course_participants AS c_p
      ON 
        c.course_id = c_p.course_id AND c_p.req_for_join_status = 1
      WHERE 
        c.approval_status = 1
      GROUP BY
        c.course_id
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      connection.query(
        `
        SELECT * FROM courses WHERE courses.approval_status = 0
        `,
        (err, nestedResults) => {
          if (err) throw err;
          return res.json({
            courses: results,
            myPendingCourses: nestedResults.length,
          });
        }
      );
    });
  });

  router.get("/course/my", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `SELECT 
      c.*, 
      s.student_name AS course_mentor_name,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM course_participants
          WHERE course_participants.course_id = c.course_id 
          AND course_participants.participant_id = '${userId}' AND course_participants.req_for_join_status = 1
        )
        THEN "yes"
        WHEN EXISTS (
          SELECT *
          FROM course_participants
          WHERE course_participants.course_id = c.course_id 
          AND course_participants.participant_id = '${userId}' AND course_participants.req_for_join_status = 0
        )
        THEN "pending"
        ELSE "no"
      END AS is_joined,
      COUNT(DISTINCT c_p.participant_id) AS total_member
      FROM 
        courses AS c
      LEFT JOIN 
        student AS s
      ON 
        c.mentor_id = s.student_id
      LEFT JOIN 
        course_participants AS c_p
      ON 
        c.course_id = c_p.course_id AND c_p.req_for_join_status = 1
      WHERE 
        c.approval_status = 1
      GROUP BY
        c.course_id
      HAVING 
        is_joined = "yes" OR is_joined = "pending";    
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      connection.query(
        `
        SELECT * FROM courses WHERE courses.approval_status = 0
        `,
        (err, nestedResults) => {
          if (err) throw err;
          return res.json({
            courses: results,
            myPendingCourses: nestedResults.length,
          });
        }
      );
    });
  });

  router.get("/course/:courseId", verifyToken, (req, res) => {
    const userId = req.userId;
    const courseId = req.params.courseId; // Correctly extract courseId

    // Fetch course details query
    const courseQuery = `
    SELECT c.*, COUNT(c_p.course_id) AS participant_count,
      student.student_name AS mentor_name,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM course_participants
          WHERE course_participants.course_id = c.course_id AND course_participants.participant_id = ?
        )
        THEN true
        ELSE false
      END AS is_joined
    FROM courses c
    LEFT JOIN course_participants c_p
      ON c.course_id = c_p.course_id
    LEFT JOIN student
      ON c.mentor_id = student.student_id
    WHERE c.course_id = ?;  -- Reference courseId correctly
  `;

    // Fetch course participants query
    const participantsQuery = `
    SELECT course_participants.*, student.student_name AS participant_name
    FROM course_participants
    JOIN student ON course_participants.participant_id = student.student_id
    WHERE course_participants.course_id = ?`;

    // Query for course details
    connection.query(courseQuery, [userId, courseId], (err, courseResults) => {
      if (err) {
        console.error("Error fetching course:", err);
        return res.json({ error: "Error fetching course details" });
      }

      if (courseResults.length === 0) {
        return res.json({ error: "Course not found" });
      }

      // Query for participants after course details have been fetched
      connection.query(
        participantsQuery,
        [courseId],
        (err, participantsResults) => {
          if (err) {
            console.error("Error fetching course participants:", err);
            return res.json({ error: "Error fetching course participants" });
          }

          // Return both course details and participants
          return res.json({
            course: courseResults[0],
            participants: participantsResults,
          });
        }
      );
    });
  });

  router.post("/courses/new", verifyToken, (req, res) => {
    const userId = req.userId;
    const { courseName, courseCategory, courseDescription, coursePrice } =
      req.body;

    connection.query(
      `INSERT INTO courses (course_name, course_category, course_description, course_price, mentor_id, approval_status)
          VALUES (?, ?, ?, ?, ?, ?)`,
      [courseName, courseCategory, courseDescription, coursePrice, userId, 0],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });

  router.post("/course/join", verifyToken, (req, res) => {
    const userId = req.userId;
    const { courseId } = req.body;

    connection.query(
      "SELECT * FROM course_participants WHERE course_id = ? AND participant_id = ?",
      [courseId, userId],
      (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          connection.query(
            "DELETE FROM course_participants WHERE course_id = ? AND participant_id = ?;",
            [courseId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Unregistered" });
            }
          );
        } else {
          connection.query(
            "INSERT INTO course_participants(course_id, participant_id) VALUES (?, ?);",
            [courseId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Registered" });
            }
          );
        }
      }
    );
  });

  router.get("/course/pendingParticipants", verifyToken, (req, res) => {
    const userId = req.userId;

    const query = `SELECT 
      c_p.*,
      s.student_name as participant_name,
      c.course_name,
      c.mentor_id
      FROM 
        course_participants AS c_p
      JOIN 
        courses AS c
      ON
        c_p.course_id = c.course_id
      JOIN 
        student AS s
      ON
        c_p.participant_id = s.student_id
      WHERE
        c.mentor_id = '${userId}' AND c_p.req_for_join_status = 0
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      return res.json({ pendingParticipants: results });
    });
  });

  router.get("/course/pending-details", verifyToken, (req, res) => {
    const userId = req.userId;

    connection.query(
      `SELECT 
      c_p.participant_id,
      c.course_id
      FROM 
        course_participants AS c_p
      JOIN 
        courses AS c
      ON
        c_p.course_id = c.course_id
      WHERE
        c.mentor_id = '${userId}' AND c_p.req_for_join_status = 0`,
      (err, results) => {
        if (err) throw err;
        connection.query(
          `SELECT 
        c.course_id
        FROM 
          courses AS c
        WHERE
          c.mentor_id = '${userId}' AND c.approval_status = 0`,
          (err, nestedResults) => {
            if (err) throw err;
            return res.json({
              pendingParticipantsNo: results.length,
              pendingCoursesNo: nestedResults.length,
            });
          }
        );
      }
    );
  });

  router.post("/course/member/approve", verifyToken, (req, res) => {
    const { participantId, courseId } = req.body;
    connection.query(
      `UPDATE course_participants SET req_for_join_status = '1' 
        WHERE participant_id = ? AND course_id = ?;`,
      [participantId, courseId],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });

  router.post("/course/member/reject", verifyToken, (req, res) => {
    const { participantId, courseId } = req.body;
    connection.query(
      `DELETE FROM course_participants 
        WHERE participant_id = ? AND course_id = ?;`,
      [participantId, courseId],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });

  router.get("/course/pending", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `SELECT 
    c.*, 
    s.student_name AS course_mentor_name
      FROM 
          courses c
      LEFT JOIN 
          student s
      ON 
          c.mentor_id = s.student_id
      WHERE 
          c.approval_status = 0 AND c.mentor_id = '${userId}'
      GROUP BY 
          c.course_id, 
          s.student_name;
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;

      return res.json({ courses: results });
    });
  });




  // const storage = multer.memoryStorage();

  // const upload = multer({
  //   storage: storage,
  //   limits: { fileSize: 50000000 }, // 10 MB
  //   fileFilter: (req, file, cb) => {
  //     const filetypes = /image\/|audio\/|video\|\application\//; // Accept all image, audio, and video types
  //     const mimetype = filetypes.test(file.mimetype);

  //     if (mimetype) {
  //       return cb(null, true);
  //     } else {
  //       cb("Error: Images or PDF files only!");
  //     }
  //   },
  // });
};
