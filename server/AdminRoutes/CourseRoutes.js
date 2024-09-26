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

  router.get("/course/single/:courseId", verifyToken, (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.userId;

    const query = `SELECT 
      c.*, 
      s.student_name AS mentor_name,
      COUNT(DISTINCT c_p.participant_id) AS total_member
      FROM 
        courses AS c
      JOIN 
        student AS s
      ON 
        c.mentor_id = s.student_id
      JOIN 
        course_participants AS c_p
      ON 
        c.course_id = c_p.participant_id
      WHERE 
        c.course_id = ${courseId}
      GROUP BY
        c.course_id
      `;
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

  router.get("/course/pending", verifyToken, (req, res) => {
    const query = `SELECT 
      c.*, 
      s.student_name AS course_mentor_name,
      s.student_id AS course_mentor_id,
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
        c.approval_status = 0
      GROUP BY
        c.course_id
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      return res.json({ courses: results });
    });
  });

  router.post(
    "/course/approve",
    verifyToken,
    (req, res) => {
      const userId = req.userId;
      const { mentorId, courseId } = req.body;
      connection.query(
        `UPDATE courses SET approval_status = '1', approver_id = ? 
        WHERE course_id = ?;`,
        [userId, courseId],
        (err, results) => {
          if (err) throw err;
          connection.query(
            `INSERT INTO course_participants (course_id, participant_id, req_for_join_status)
            VALUES (?, ?, ?)`,
            [courseId, mentorId, 1],
            (err, nestedResults) => {
              if (err) throw err;
          
              return res.json({ status: "Success" });
            }
          );
        }
      );
    }
  );

  router.post(
    "/course/reject",
    verifyToken,
    (req, res) => {
      const { courseId } = req.body;
      connection.query(
        `DELETE FROM courses 
        WHERE course_id = ?;`,
        [courseId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );
};
