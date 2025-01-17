const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router, multer) => {
  router.get("/course", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `SELECT 
      c.*, 
      s.student_name AS course_mentor_name,
      IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS mentor_picture,
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

  router.get("/courses/my", verifyToken, (req, res) => {
    let userId = req.userId;

    const query1 = `SELECT 
      c.*, 
      s.student_name AS course_mentor_name,
      IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS mentor_picture,
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM course_participants
          WHERE course_participants.course_id = c.course_id 
          AND course_participants.participant_id = '${userId}'
          AND course_participants.req_for_join_status = 1
        ) THEN "yes"
        WHEN EXISTS (
          SELECT 1
          FROM course_participants
          WHERE course_participants.course_id = c.course_id 
          AND course_participants.participant_id = '${userId}'
          AND course_participants.req_for_join_status = 0
        ) THEN "pending"
        ELSE "no"
      END AS is_joined,
      COUNT(DISTINCT c_p.participant_id) AS total_member,
      c.approval_status
    FROM 
      courses AS c
    JOIN 
      student AS s ON c.mentor_id = s.student_id
    LEFT JOIN 
      course_participants AS c_p ON c.course_id = c_p.course_id AND c_p.req_for_join_status = 1
    WHERE 
      c.mentor_id = '${userId}'
    GROUP BY
      c.course_id;    
      `;

    const query2 = `SELECT 
      c.*, 
      s.student_name AS course_mentor_name,
      IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS mentor_picture,
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM course_participants
          WHERE course_participants.course_id = c.course_id 
          AND course_participants.participant_id = '${userId}'
          AND course_participants.req_for_join_status = 1
        ) THEN "yes"
        WHEN EXISTS (
          SELECT 1
          FROM course_participants
          WHERE course_participants.course_id = c.course_id 
          AND course_participants.participant_id = '${userId}'
          AND course_participants.req_for_join_status = 0
        ) THEN "pending"
        ELSE "no"
      END AS is_joined,
      COUNT(DISTINCT c_m.material_id) AS total_material,    
      COUNT(DISTINCT c_p.participant_id) AS total_member,
      (
        SELECT COUNT(c_c_m.material_id) AS completed_material
        FROM completed_course_materials AS c_c_m
        JOIN course_materials AS c_m ON c_c_m.material_id = c_m.material_id
        WHERE c_c_m.participant_id = '${userId}' AND c_m.course_id = c.course_id
      ) AS completed_material,    
      c.approval_status,
      IF(COUNT(DISTINCT c_m.material_id) > 0, 
        ((
        SELECT COUNT(c_c_m.material_id) AS completed_material
        FROM completed_course_materials AS c_c_m
        JOIN course_materials AS c_m ON c_c_m.material_id = c_m.material_id
        WHERE c_c_m.participant_id = '${userId}' AND c_m.course_id = c.course_id
      ) / COUNT(DISTINCT c_m.material_id)) * 100, 0) AS completed_percentage
    FROM 
      courses AS c
    JOIN 
      student AS s ON c.mentor_id = s.student_id
    LEFT JOIN 
      course_materials AS c_m ON c.course_id = c_m.course_id
    LEFT JOIN 
      course_participants AS c_p ON c.course_id = c_p.course_id AND c_p.req_for_join_status = 1
    GROUP BY
      c.course_id    
    HAVING
      is_joined = "yes";
    `;

    connection.query(query1, (err, myCourseResults) => {
      if (err) throw err;
      connection.query(query2, (err, enrolledCourseResult) => {
        if (err) throw err;
        return res.json({
          myCourses: myCourseResults,
          enrolledCourses: enrolledCourseResult,
        });
      });
    });
  });

  router.get("/course/:courseId", verifyToken, (req, res) => {
    const userId = req.userId;
    const courseId = req.params.courseId; // Correctly extract courseId

    // Fetch course details query
    const courseQuery = `
    SELECT c.*, COUNT(c_p.course_id) AS participant_count,
      student.student_name AS mentor_name,
      IF(student.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", student.student_id), NULL) AS mentor_picture,
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
    WHERE c.course_id = ?;
  `;

    // Fetch course participants query
    const participantsQuery = `
    SELECT course_participants.*, student.student_name, 
    IF(student.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", student.student_id), NULL) AS participant_picture
    FROM course_participants
    JOIN student ON course_participants.participant_id = student.student_id
    WHERE course_participants.course_id = ?`;

    const materialsQuery = `
    SELECT c_m.material_id, c_m.material_name, c_m.material_type,
    CASE
      WHEN EXISTS (
        SELECT *
        FROM completed_course_materials AS c_c_m
        WHERE c_c_m.material_id = c_m.material_id 
        AND c_c_m.participant_id = '${userId}'
      )
      THEN true
      ELSE false
    END AS is_completed
    FROM course_materials AS c_m
    WHERE course_id = ?`;

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
          connection.query(
            materialsQuery,
            [courseId],
            (err, materialsResults) => {
              if (err) {
                console.error("Error fetching course participants:", err);
                return res.json({
                  error: "Error fetching course participants",
                });
              }

              // Return both course details and participants
              return res.json({
                course: courseResults[0],
                participants: participantsResults,
                materials: materialsResults,
              });
            }
          );
        }
      );
    });
  });

  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 10 MB
    fileFilter: (req, file, cb) => {
      const filetypes = /image\/|audio\/|video\/|\application\//; // Accept all image, audio, and video types
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype) {
        return cb(null, true);
      } else {
        cb("Error: Images or PDF files only!");
      }
    },
  });

  router.get("/coursess/:courseId", verifyToken, (req, res) => {
    let userId = req.userId;
    const { courseId } = req.params;

    const query = `
      SELECT 
        c.course_id, c.course_name, c.course_category, c.course_description
        FROM courses c
        WHERE c.course_id = ?`;
    connection.query(query, [courseId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }
      console.log(result[0]);

      return res.json({ courses: result[0], status: "Success" });
    });
  });

  router.post("/courses/update/:courseId", verifyToken, (req, res) => {
    const userId = req.userId;
    const { courseId } = req.params;
    const { courseName, courseCategory, courseDescription } = req.body;
    connection.query(
      `UPDATE courses SET course_name = ?, course_category = ?, course_description = ? WHERE course_id = ?`,
      [courseName, courseCategory, courseDescription, courseId],
      (err, results) => {
        if (err) console.error(err);
        else return res.json({ status: "Success" });
      }
    );
  });
  
  router.post(
    "/courses/new",
    upload.array("courseMaterials"),
    verifyToken,
    (req, res) => {
      const userId = req.userId;
      const {
        courseName,
        courseCategory,
        courseDescription,
        courseMaterialNames,
      } = req.body;
      const files = req.files;
      let courseMaterialNamesArray = courseMaterialNames.split(",");

      console.log(courseMaterialNames);

      connection.query(
        `INSERT INTO courses (course_name, course_category, course_description, mentor_id, approval_status)
          VALUES (?, ?, ?, ?, ?)`,
        [courseName, courseCategory, courseDescription, userId, 0],
        (err, results) => {
          if (err) throw err;

          let courseId = results.insertId;

          if (files.length != 0) {
            files.map(function (file, index) {
              const { mimetype, buffer } = file;
              connection.query(
                `INSERT INTO  course_materials (course_id, material_name, material_blob, material_type)
          VALUES (?, ?, ?, ?)`,
                [courseId, courseMaterialNamesArray[index], buffer, mimetype],
                (err, result) => {
                  if (err) {
                    console.error("Database insertion error:", err);
                    throw err;
                  }
                }
              );
            });
          }
          return res.json({ status: "Success" });
        }
      );
    }
  );

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

  router.get("/courses/pendingParticipants", verifyToken, (req, res) => {
    const userId = req.userId;

    const query = `SELECT 
      c_p.*,
      s.student_name as participant_name,
      IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS participant_picture,
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

  router.get("/courses/pending-details", verifyToken, (req, res) => {
    const userId = req.userId;
    console.log(userId);

    // First query to get pending participants
    const query1 = `
      SELECT 
        c_p.participant_id,
        c.course_id
      FROM 
        course_participants AS c_p
      JOIN 
        courses AS c
      ON
        c_p.course_id = c.course_id
      WHERE
        c.mentor_id = ? AND c_p.req_for_join_status = 0
    `;

    // Second query to get approved courses
    const query2 = `
      SELECT 
        c.course_id
      FROM 
        courses AS c
      WHERE
        c.mentor_id = ? AND c.approval_status = 0
    `;

    // Execute the first query
    connection.query(query1, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching pending participants:", err);
        return res
          .status(500)
          .send("Server error while fetching pending participants.");
      }

      // Execute the second query
      connection.query(query2, [userId], (err, nestedResults) => {
        if (err) {
          console.error("Error fetching approved courses:", err);
          return res
            .status(500)
            .send("Server error while fetching approved courses.");
        }

        // Respond with the result
        return res.json({
          pendingParticipantsNo: results.length,
          pendingCoursesNo: nestedResults.length,
        });
      });
    });
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

  router.get("/courses/pending", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `SELECT 
    c.*, 
    s.student_name AS course_mentor_name,
      IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS mentor_picture
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
          material: results[0],
        });
      }
    );
  });

  router.get("/courses/material/cdn/:id", (req, res) => {
    const materialId = req.params.id;

    connection.query(
      `
    SELECT *
    FROM course_materials 
    WHERE material_id = ?
  `,
      [materialId],
      (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          return res.status(404).send("Material not found.");
        }

        const media = results[0];
        const mediaType = media.material_type;
        const mediaData = media.material_blob;

        res.setHeader("Content-Type", mediaType);

        res.send(mediaData);
      }
    );
  });

  router.post("/courses/material/complete", verifyToken, (req, res) => {
    let userId = req.userId;
    const { materialId, courseId } = req.body;

    const query1 = `SELECT * 
    FROM completed_course_materials
    WHERE 
      material_id = ${materialId} AND participant_id = '${userId}'
    `;

    const query2 = `INSERT INTO 
    completed_course_materials (material_id, participant_id)
    VALUES (${materialId}, '${userId}');`;

    const query3 = `
    UPDATE student
      SET student_points = student_points + 5
      WHERE student.student_id =  '${userId}' AND EXISTS (
          SELECT 
            IF(COUNT(DISTINCT c_m.material_id) > 0, 
              ((
              SELECT COUNT(c_c_m.material_id) AS completed_material
              FROM completed_course_materials AS c_c_m
              JOIN course_materials AS c_m ON c_c_m.material_id = c_m.material_id
              WHERE c_c_m.participant_id = '${userId}' AND c_m.course_id = ${courseId}
            ) / COUNT(DISTINCT c_m.material_id)) * 100, 0) AS completed_percentage
          FROM course_materials as c_m  
          WHERE c_m.course_id = ${courseId}
          HAVING completed_percentage = 100.0
      );
    `;

    connection.query(query1, (err, results) => {
      if (err) throw err;
      if (results.length <= 0) {
        connection.query(query2, (err, results) => {
          if (err) {
            return res.json({ status: "Error" });
          }
          console.log("Material Not completed");
          connection.query(query3, (err, results) => {
            if (err) {
              return res.json({ status: "Error" });
            }
            return res.json({ status: "Success" });
          });
        });
      } else {
        return res.json({ status: "Success" });
      }
    });
  });

  router.post("/course/delete", verifyToken, (req, res) => {
    const { courseId } = req.body;
    connection.query(
      `DELETE FROM courses WHERE course_id = ?`,
      [courseId],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });
};
