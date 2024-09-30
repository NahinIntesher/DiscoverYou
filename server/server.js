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
  console.log(req.body);
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
          throw err;
          // return res.json({ Error: "Login error in server" });
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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
