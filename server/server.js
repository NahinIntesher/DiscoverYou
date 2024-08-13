const express = require("express");
const connection = require("./connection");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware");

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
                "INSERT INTO user_interest (interest_name, user_id) VALUES (?, ?)",
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

app.post("/loginPage", (req, res) => {
  const token = req.cookies.userRegistered;
  if (token) {
    return res.json({ status: "Success" });
  }
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM user WHERE email = ?",
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
              const uid = results[0].user_id;

              const token = jwt.sign({ id: uid }, "1234", { expiresIn: "1d" });
              const cookieOptions = {
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                httpOnly: true,
              };

              res.cookie("userRegistered", token, cookieOptions);
              return res.json({ status: "Success", user: results[0] });
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
  const id = req.userId;
  console.log(id);
  connection.query(
    "SELECT * FROM user WHERE user_id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.json({ Error: "Error fetching user" });
      }
      return res.json({ status: "Success", user: results[0] });
    }
  );
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
