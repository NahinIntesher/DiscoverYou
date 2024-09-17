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
const multer = require('multer');
const { error } = require("console");
const StudentRoute = require('./StudentRoutes/StudentRoute');
const AdminRoute = require('./AdminRoutes/AdminRoute');

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

app.use('/student', StudentRoute);
app.use('/admin', AdminRoute);

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

  // Validate adminKey
  if (adminKey !== "" && adminKey !== "1234") {
    return res.json({ Error: "Invalid admin key" });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      // Insert the user into the user table
      connection.query(
        "INSERT INTO user (name, dateOfBirth, gender, address, phone, category, adminKey, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          dateOfBirth,
          gender,
          address,
          phone,
          category,
          adminKey,
          email,
          hashedPassword,
        ],
        (err, results) => {
          if (err) {
            return res.status(500).json({ Error: "Error registering user" });
          }
          // Retrieve the user_id of the newly inserted user
          const userId = results.insertId;

          // Create an array of queries for inserting interests
          const interestQueries = interests.map((interest) => {
            return new Promise((resolve, reject) => {
              connection.query(
                "INSERT INTO student_interests (interest_name, student_id) VALUES (?, ?)",
                [interest, userId],
                (err) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve();
                }
              );
            });
          });

          // Execute all interest insertion queries
          Promise.all(interestQueries)
            .then(() => {
              return res.json({ status: "Success" });
            })
            .catch((error) => {
              return res.json({ Error: "Error inserting interests" });
            });
        }
      );
    })
    .catch((error) => {
      return res.json({ Error: "Error hashing password" });
    });
});

app.post("/login", (req, res) => {
  const token = req.cookies.userRegistered;
  if (token) {
    return res.json({ status: "Success" });
  }
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM students WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        return res.json({ Error: "Login error in server" });
      }

      if (results.length > 0) {
        bcrypt.compare(
          password.toString(),
          results[0].password,
          (err, response) => {
            if (err) return res.json({ Error: "Error comparing password" });
            if (response) {
              const uid = results[0].student_id;

              const token = jwt.sign({ id: uid, type: "student" }, "1234", { expiresIn: "1d" });
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
});

app.get("/", verifyToken, (req, res) => {
  const userId = req.userId;
  const userType = req.userType;

  let query;

  if(userType == "student") {
    query = `
      SELECT s.*, GROUP_CONCAT(si.interest_name) AS interests
      FROM students s
      LEFT JOIN student_interests si 
      ON s.student_id = si.student_id
      WHERE s.student_id = ?
      GROUP BY s.student_id
    `;
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
        type: userType
      },
    });
  });
});



app.get("/logout", (req, res) => {
  res.clearCookie("userRegistered");
  res.json({ status: "Success" });
});






// Showcase



// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
