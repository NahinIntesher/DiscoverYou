const express = require("express");
const connection = require("./Database/connection");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const verifyToken = require("./Middlewares/middleware");
const multer = require("multer");
const { error } = require("console");
const { promisify } = require("util");
const StudentRoute = require("./StudentRoutes/StudentRoute");
const AdminRoute = require("./AdminRoutes/AdminRoute");
const OrganizerRoute = require("./OrganizerRoutes/OrganizerRoute");

// Middleware
app.use(cookies());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methds: ["GET", "POST"],
    credentials: true,
  })
);

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error("Database connection failed: " + error.stack);
    return;
  }
  console.log("Connected to database.");
});

app.use("/student", StudentRoute);
app.use("/admin", AdminRoute);
app.use("/organizer", OrganizerRoute);

app.post("/registrationPage", (req, res) => {
  const token = req.cookies.userRegistered;
  if (token) {
    return res.json({ status: "Success" });
  }

  const {
    name,
    dateOfBirth,
    gender,
    address,
    phone,
    category,
    adminKey,
    interests = [],
    email,
    password,
  } = req.body;

  if (category == "student") {
    console.log("student Registration Start");
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        // Insert the user into the user table
        // Define a function to generate the next student_id
        const generateStudentId = (currentMaxId) => {
          // Remove the 'St' prefix and parse the numeric part
          const numericPart = parseInt(currentMaxId.replace("St", ""), 10);

          // Increment the numeric part by 1 and pad with leading zeros to maintain the format
          const newNumericPart = numericPart + 1;
          return `St${String(newNumericPart).padStart(7, "0")}`;
        };

        // Step 1: Retrieve the current maximum student_id from the student table
        connection.query(
          "SELECT MAX(student_id) as maxId FROM student",
          (err, result) => {
            if (err) throw err;

            // Step 2: Generate a new student_id based on the current maxId
            const newStudentId = generateStudentId(
              result[0].maxId || "St0000000"
            ); // Default if no records

            // Step 3: Insert the new student record with the generated student_id
            connection.query(
              "INSERT INTO student (student_id, student_name, student_date_of_birth, student_gender, student_address, student_mobile_no, student_email, student_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                newStudentId,
                name,
                dateOfBirth,
                gender,
                address,
                phone,
                email,
                hashedPassword,
              ],
              (err, results) => {
                if (err) throw err;

                // Step 4: Insert the student's interests using the new student_id
                const interestQueries = interests.map((interest) => {
                  return new Promise((resolve, reject) => {
                    connection.query(
                      "INSERT INTO student_interests (interest_name, student_id) VALUES (?, ?)",
                      [interest, newStudentId],
                      (err) => {
                        if (err) {
                          return reject(err);
                        }
                        resolve();
                      }
                    );
                  });
                });

                // Step 5: Execute all interest insertion queries
                Promise.all(interestQueries)
                  .then(() => {
                    return res.json({ status: "Success" });
                  })
                  .catch((error) => {
                    return res.json({ Error: "Error inserting interests" });
                  });
              }
            );
          }
        );
      })
      .catch((error) => {
        return res.json({ Error: "Error hashing password" });
      });
  } else if (category == "organizer") {
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        // Insert the user into the user table
        connection.query(
          "INSERT INTO organizer (organizer_name, organizer_date_of_birth, organizer_gender, organizer_address, organizer_mobile_no, organizer_email, organizer_password) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [name, dateOfBirth, gender, address, phone, email, hashedPassword],
          (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ Error: "Error registering organizer" });
            }
            return res.json({ status: "Success" });
          }
        );
      })
      .catch((error) => {
        return res.json({ Error: "Error hashing password" });
      });
  } else if (category == "admin") {
    // Validate adminKey
    if (adminKey !== "1234") {
      return res.json({ Error: "Invalid admin key" });
    }
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        // Insert the user into the user table
        connection.query(
          "INSERT INTO admin (admin_name, admin_date_of_birth, admin_gender, admin_address, admin_mobile_no, admin_email, admin_password) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [name, dateOfBirth, gender, address, phone, email, hashedPassword],
          (err, results) => {
            if (err) {
              return res.status(500).json({ Error: "Error registering admin" });
            }
            return res.json({ status: "Success" });
          }
        );
      })
      .catch((error) => {
        return res.json({ Error: "Error hashing password" });
      });
  }
});

app.post("/login", (req, res) => {
  const token = req.cookies.userRegistered;
  if (token) {
    return res.json({ status: "Success" });
  }
  const { email, password, category } = req.body;
  if (category == "student") {
    connection.query(
      "SELECT * FROM student WHERE student_email = ?",
      [email],
      (err, results) => {
        if (err) {
          return res.json({ Error: "Login error in server" });
        }

        if (results.length > 0) {
          bcrypt.compare(
            password.toString(),
            results[0].student_password,
            (err, response) => {
              if (err) return res.json({ Error: "Error comparing password" });
              if (response) {
                const uid = results[0].student_id;

                const token = jwt.sign({ id: uid, type: "student" }, "1234", {
                  expiresIn: "1d",
                });
                const cookieOptions = {
                  expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                  httpOnly: true,
                };

                res.cookie("userRegistered", token, cookieOptions);
                return res.redirect("/");
              } else {
                return res.json({ Error: "Password incorrect" });
              }
            }
          );
        } else {
          res.json({ Error: "No email exists" });
        }
      }
    );
  } else if (category == "organizer") {
    connection.query(
      "SELECT * FROM organizer WHERE organizer_email = ?",
      [email],
      (err, results) => {
        if (err) {
          // throw err;
          return res.json({ Error: "Login error in server" });
        }

        if (results.length > 0) {
          bcrypt.compare(
            password.toString(),
            results[0].organizer_password,
            (err, response) => {
              if (err) return res.json({ Error: "Error comparing password" });
              if (response) {
                const uid = results[0].organizer_id;

                const token = jwt.sign({ id: uid, type: "organizer" }, "1234", {
                  expiresIn: "1d",
                });
                const cookieOptions = {
                  expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                  httpOnly: true,
                };

                res.cookie("userRegistered", token, cookieOptions);
                return res.redirect("/");
              } else {
                return res.json({ Error: "Password incorrect" });
              }
            }
          );
        } else {
          res.json({ Error: "No email exists" });
        }
      }
    );
  } else if (category == "admin") {
    connection.query(
      "SELECT * FROM admin WHERE admin_email = ?",
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }

        if (results.length > 0) {
          bcrypt.compare(
            password.toString(),
            results[0].admin_password,
            (err, response) => {
              if (err) return res.json({ Error: "Error comparing password" });
              if (response) {
                const uid = results[0].admin_id;

                const token = jwt.sign({ id: uid, type: "admin" }, "1234", {
                  expiresIn: "1d",
                });
                const cookieOptions = {
                  expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                  httpOnly: true,
                };

                res.cookie("userRegistered", token, cookieOptions);
                return res.redirect("/");
              } else {
                return res.json({ Error: "Password incorrect" });
              }
            }
          );
        } else {
          res.json({ Error: "No email exists" });
        }
      }
    );
  }
});

app.get("/", verifyToken, (req, res) => {
  const userId = req.userId;
  const userType = req.userType;

  let query;

  if (userType == "student") {
    query = `
      SELECT 
        s.student_id, 
        s.student_name, 
        s.student_email, 
        s.student_points, 
        s.student_address, 
        s.student_mobile_no, 
        s.student_date_of_birth, 
        s.student_gender, 
        IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS student_picture,
        GROUP_CONCAT(si.interest_name) AS interests
      FROM student s
      LEFT JOIN student_interests si 
      ON s.student_id = si.student_id
      WHERE s.student_id = ?
      GROUP BY s.student_id
    `;
  } else if (userType == "organizer") {
    query = `
    SELECT 
      o.organizer_id, 
      o.organizer_name, 
      o.organizer_email, 
      o.organizer_address, 
      o.organizer_mobile_no, 
      o.organizer_date_of_birth, 
      o.organizer_gender, 
      IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
    FROM organizer AS o 
    WHERE o.organizer_id = ?`;
  } else if (userType == "admin") {
    query = `
    SELECT 
      a.admin_id, 
      a.admin_name, 
      a.admin_email, 
      a.admin_address, 
      a.admin_mobile_no, 
      a.admin_date_of_birth, 
      a.admin_gender, 
      IF(a.admin_picture IS NOT NULL, CONCAT("http://localhost:3000/admin/profile/picture/", a.admin_id), NULL) AS admin_picture
    FROM admin AS a
    WHERE a.admin_id = ?`;
  }

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ Error: "Error fetching user data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ Error: "User not found" });
    }

    const user = results[0];
    const interests = user.interests ? user.interests.split(",") : [];

    return res.json({
      status: "Success",
      user: {
        ...user,
        interests,
        type: userType,
      },
    });
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("userRegistered");
  res.json({ status: "Success" });
});

app.get("/admins", verifyToken, (req, res) => {
  const query = `
      SELECT
        a.admin_id,
        a.admin_name,
        a.admin_email,
        a.admin_mobile_no,
        a.admin_address,
        a.admin_gender,
        a.admin_date_of_birth,
        IF(a.admin_picture IS NOT NULL, CONCAT("http://localhost:3000/admin/profile/picture/", a.admin_id), NULL) AS admin_picture
      FROM admin a
    `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching admins:", err);
      return res.status(500).json({ Error: "Error fetching admins" });
    }
    return res.json({
      status: "Success",
      admins: results,
    });
  });
});



app.get("/profiles/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  let userType;

  if (userId.startsWith("St")) {
    userType = "student";
  } else if (userId.startsWith("Or")) {
    userType = "organizer";
  } else if (userId.startsWith("Ad")) {
    userType = "admin";
  }

  let query;

  if (userType === "student") {
    query = `
      SELECT 
        s.student_id AS id, 
        s.student_name AS name,
        s.student_email AS email,
        s.student_gender AS gender,
        s.student_points AS points,
        s.student_address AS address,
        s.student_mobile_no AS mobile_no,
        s.student_date_of_birth AS date_of_birth,
        IF(s.student_picture IS NOT NULL,
          CONCAT("http://localhost:3000/student/profile/picture/", s.student_id),
          NULL) AS user_picture,
        GROUP_CONCAT(si.interest_name) AS interests
      FROM student s
      LEFT JOIN student_interests si ON s.student_id = si.student_id
      WHERE s.student_id = ?
      GROUP BY s.student_id
    `;
  } else if (userType === "organizer") {
    query = `
      SELECT 
        o.organizer_id AS id,
        o.organizer_name AS name,
        o.organizer_email AS email,
        o.organizer_address AS address,
        o.organizer_mobile_no AS mobile_no,
        o.organizer_gender AS gender,
        o.organizer_date_of_birth AS date_of_birth,
        IF(o.organizer_picture IS NOT NULL,
          CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id),
          NULL) AS user_picture
      FROM organizer AS o
      WHERE o.organizer_id = ?
    `;
  } else if (userType === "admin") {
    query = `
      SELECT 
        a.admin_id AS id, 
        a.admin_name AS name,
        a.admin_email AS email,
        a.admin_address AS address,
        a.admin_gender AS gender,
        a.admin_mobile_no AS mobile_no,
        a.admin_date_of_birth AS date_of_birth,
        IF(a.admin_picture IS NOT NULL,
          CONCAT("http://localhost:3000/admin/profile/picture/", a.admin_id),
          NULL) AS user_picture
      FROM admin AS a
      WHERE a.admin_id = ?
    `;
  }

  connection.query(query, [userId], (err, results) => {
    if (err) {
      // throw err;
      console.error("Error fetching user data:", err);
      return res.status(500).json({ Error: "Error fetching user data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ Error: "User not found" });
    }

    const user = results[0];
    const interests = user.interests ? user.interests.split(",") : [];

    return res.json({
      status: "Success",
      user: {
        ...user,
        interests,
        type: userType,
      },
    });
  });
});

app.get("/dynamic-profile/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;
  let userType;

  if (userId.startsWith("St")) {
    userType = "student";
  } else if (userId.startsWith("Or")) {
    userType = "organizer";
  }

  if (userType === "student") {
    // Student SQL Queries
    const contestQuery = `
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
          c_p.participant_id = ?
      GROUP BY 
          c_p.contest_id;`;

    const showcasePostQuery = `
      SELECT 
          s_p.*, 
          s.student_name AS user_name,
          TIMESTAMPDIFF(SECOND, s_p.post_date_time, NOW()) AS post_time_ago,
          IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS user_picture,
          s_p_m.media_type,
          (
            SELECT 
              GROUP_CONCAT(
                CONCAT(
                  '{"media_url": "http://localhost:3000/student/showcase/media/cdn/', s_p_m.media_id, 
                  '", "media_type": "', s_p_m.media_type, '"}'
                ) SEPARATOR ', '
              )
            FROM 
              showcase_post_media AS s_p_m
            WHERE 
              s_p_m.post_id = s_p.post_id
          ) AS media_array
      FROM 
          showcase_posts AS s_p
      JOIN 
          student AS s 
      ON s_p.user_id = s.student_id
      LEFT JOIN 
          showcase_post_media AS s_p_m
      ON s_p_m.post_id = s_p.post_id
      LEFT JOIN 
          showcase_post_reactions AS s_p_r 
      ON s_p_r.post_id = s_p.post_id
      LEFT JOIN 
          showcase_post_comments AS s_p_c 
      ON s_p_c.post_id = s_p.post_id
      WHERE
          s_p.user_id = ?
      GROUP BY
          s_p.post_id
      ORDER BY
          s_p.post_date_time DESC;`;

    const courseQuery = `
      SELECT 
          c.*, 
          s.student_name AS course_mentor_name,
          IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS mentor_picture, 
          c.approval_status
      FROM 
          courses AS c
      JOIN 
          student AS s ON c.mentor_id = s.student_id
      LEFT JOIN 
          course_materials AS c_m ON c.course_id = c_m.course_id
      LEFT JOIN 
          course_participants AS c_p ON c.course_id = c_p.course_id AND c_p.req_for_join_status = 1
      WHERE
          c_p.participant_id = ?
      GROUP BY
          c.course_id;`;

    const webinarQuery = `
      SELECT 
          w.webinar_name, 
          w.webinar_description, 
          w.webinar_category, 
          COUNT(w_p.webinar_id) AS participant_count, 
          organizer.organizer_name AS host_name,
          IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture
      FROM 
          webinars w
      JOIN 
          webinar_participants w_p
      ON 
          w.webinar_id = w_p.webinar_id
      LEFT JOIN 
          organizer
      ON 
          w.host_id = organizer.organizer_id
      WHERE
          w_p.participant_id = ?
      GROUP BY 
          w_p.webinar_id;`;

    try {
      const queryAsync = promisify(connection.query).bind(connection);

      const [contestResults, showcaseResults, courseResults, webinarResults] =
        await Promise.all([
          queryAsync(contestQuery, [userId]),
          queryAsync(showcasePostQuery, [userId]),
          queryAsync(courseQuery, [userId]),
          queryAsync(webinarQuery, [userId]),
        ]);

      res.json({
        status: "Success",
        contestResults: contestResults,
        showcaseResults: showcaseResults,
        courseResults: courseResults,
        webinarResults: webinarResults,
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: "Error fetching data", error: err.message });
    }
  } else if (userType === "organizer") {
    // Organizer SQL Queries
    const contestQuery = `
      SELECT
        c.contest_name, 
        c.contest_category, 
        c.contest_details, 
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
    FROM contests c
    LEFT JOIN organizer o ON o.organizer_id = c.organizer_id
    WHERE c.organizer_id = ?
    GROUP BY c.contest_name, c.contest_category, c.contest_details, o.organizer_name, o.organizer_picture;`;

    const webinarQuery = `
      SELECT
        w.webinar_name, 
        w.webinar_category, 
        w.webinar_description, 
        o.organizer_name AS host_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS host_picture
    FROM webinars w
    JOIN organizer o ON o.organizer_id = w.host_id
    WHERE w.host_id = ?`;

    const hiringQuery = `
      SELECT
        h.hiring_id,
        h.company_name, 
        h.job_name, 
        h.job_category, 
        h.job_description, 
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
    FROM hirings h
    JOIN organizer o ON o.organizer_id = h.organizer_id
    WHERE h.organizer_id = ?`;

    try {
      const queryAsync = promisify(connection.query).bind(connection);

      const [contestResults, webinarResults, hiringResults] = await Promise.all(
        [
          queryAsync(contestQuery, [userId]),
          queryAsync(webinarQuery, [userId]),
          queryAsync(hiringQuery, [userId]),
        ]
      );

      res.json({
        status: "Success",
        contestResults: contestResults,
        webinarResults: webinarResults,
        hiringResults: hiringResults,
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: "Error fetching data", error: err.message });
    }
  } else {
    res.status(400).json({ status: "Invalid user type" });
  }
});

app.get("/messages/contacts", verifyToken, (req, res) => {
  let userId = req.userId;

  const query = `
          SELECT DISTINCT
          CASE 
            WHEN m.student_reciver_id IS NOT NULL THEN s.student_name
            WHEN m.organizer_reciver_id IS NOT NULL THEN o.organizer_name
            ELSE NULL
          END AS other_user_name,
          CASE 
            WHEN m.student_reciver_id IS NOT NULL THEN s.student_id
            WHEN m.organizer_reciver_id IS NOT NULL THEN o.organizer_id
            ELSE NULL
          END AS other_user_id,
          CASE 
            WHEN m.student_reciver_id IS NOT NULL THEN IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL)
            WHEN m.organizer_reciver_id IS NOT NULL THEN IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL)
            ELSE NULL
          END AS other_user_picture,
          (SELECT mm.message_content FROM messages AS mm 
           WHERE 
           (mm.student_sender_id = '${userId}' OR mm.student_reciver_id = '${userId}' OR mm.organizer_sender_id = '${userId}' OR mm.organizer_reciver_id = '${userId}')
           AND
           (mm.student_sender_id = m.student_reciver_id OR mm.student_reciver_id = m.student_reciver_id OR mm.organizer_sender_id = m.organizer_reciver_id OR mm.organizer_reciver_id =  m.organizer_reciver_id)
           ORDER BY mm.message_time DESC LIMIT 1) AS last_message,
          (SELECT mm.message_time FROM messages AS mm 
           WHERE 
           (mm.student_sender_id = '${userId}' OR mm.student_reciver_id = '${userId}' OR mm.organizer_sender_id = '${userId}' OR mm.organizer_reciver_id = '${userId}')
           AND
           (mm.student_sender_id = m.student_reciver_id OR mm.student_reciver_id = m.student_reciver_id OR mm.organizer_sender_id = m.organizer_reciver_id OR mm.organizer_reciver_id =  m.organizer_reciver_id)
           ORDER BY mm.message_time DESC LIMIT 1) AS last_message_time,
          (SELECT
          CASE 
            WHEN mm.student_sender_id = '${userId}' THEN 1
            WHEN mm.organizer_sender_id = '${userId}' THEN 1
            WHEN mm.message_is_read = 1 THEN 1
            ELSE 0
          END AS last_message_status
          FROM messages AS mm 
           WHERE 
           (mm.student_sender_id = '${userId}' OR mm.student_reciver_id = '${userId}' OR mm.organizer_sender_id = '${userId}' OR mm.organizer_reciver_id = '${userId}')
           AND
           (mm.student_sender_id = m.student_reciver_id OR mm.student_reciver_id = m.student_reciver_id OR mm.organizer_sender_id = m.organizer_reciver_id OR mm.organizer_reciver_id =  m.organizer_reciver_id)
           ORDER BY mm.message_time DESC LIMIT 1) AS last_message_status
        FROM messages AS m
        LEFT JOIN
          student AS s
        ON
          m.student_reciver_id = s.student_id
        LEFT JOIN
          organizer AS o
        ON
          m.organizer_reciver_id = o.organizer_id
        WHERE 
          m.student_sender_id = '${userId}' OR m.organizer_sender_id = '${userId}'
        ORDER BY last_message_time DESC;`

  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json({ status: "Success", contacts: results });
  });
});

app.get("/messages/single/:otherUserId", verifyToken, (req, res) => {
  let userId = req.userId;
  let otherUserId = req.params.otherUserId;

  const query = `SELECT 
    m.*,
    TIMESTAMPDIFF(SECOND, m.message_time, NOW()) AS message_time_ago,
    CASE
      WHEN m.student_sender_id = '${userId}' OR  m.organizer_sender_id = '${userId}'
      THEN true
      ELSE false
    END AS own_message
  FROM 
    messages AS m
  WHERE 
    m.student_sender_id = '${userId}' AND m.student_reciver_id = '${otherUserId}'
    OR
    m.student_sender_id = '${userId}' AND m.organizer_reciver_id = '${otherUserId}'
    OR
    m.student_reciver_id = '${userId}' AND m.student_sender_id = '${otherUserId}'
    OR
    m.student_reciver_id = '${userId}' AND m.organizer_sender_id = '${otherUserId}'
    OR
    m.organizer_sender_id = '${userId}' AND m.student_reciver_id = '${otherUserId}'
    OR
    m.organizer_sender_id = '${userId}' AND m.organizer_reciver_id = '${otherUserId}'
    OR
    m.organizer_reciver_id = '${userId}' AND m.student_sender_id = '${otherUserId}'
    OR
    m.organizer_reciver_id = '${userId}' AND m.organizer_sender_id = '${otherUserId}'
  ORDER BY m.message_time DESC;`;

  const innerQuery = `UPDATE messages
  SET message_is_read = 1
WHERE 
  student_reciver_id = '${userId}' AND student_sender_id = '${otherUserId}'
  OR
  student_reciver_id = '${userId}' AND organizer_sender_id = '${otherUserId}'
  OR
  organizer_reciver_id = '${userId}' AND student_sender_id = '${otherUserId}'
  OR
  organizer_reciver_id = '${userId}' AND organizer_sender_id = '${otherUserId}'`;

  connection.query(query, (err, results) => {
    if (err) throw err;
    connection.query(innerQuery, (err, innerResults) => {
      if (err) throw err;
      res.json({ status: "Success", messages: results });
    });
  });
});

app.post("/messages/send", verifyToken, (req, res) => {
  let userId = req.userId;
  let { message, otherUserId } = req.body;

  let query;

  if (userId.startsWith("St")) {
    if (otherUserId.startsWith("St")) {
      query = `INSERT INTO messages (message_content, student_sender_id, student_reciver_id) VALUES (?, ?, ?);`;
    } else if (otherUserId.startsWith("Or")) {
      query = `INSERT INTO messages (message_content, student_sender_id, organizer_reciver_id) VALUES (?, ?, ?);`;
    }
  }
  else if (userId.startsWith("Or")) {
    if (otherUserId.startsWith("St")) {
      query = `INSERT INTO messages (message_content, organizer_sender_id, student_reciver_id) VALUES (?, ?, ?);`;
    } else if (otherUserId.startsWith("Or")) {
      query = `INSERT INTO messages (message_content, organizer_sender_id, organizer_reciver_id) VALUES (?, ?, ?);`;
    }
  }

  connection.query(query, [message, userId, otherUserId], (err, results) => {
    if (err) throw err;
    res.json({ status: "Success" });
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
