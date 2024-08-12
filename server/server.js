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

app.post("/loginPage", (req, res) => {
  const token = req.cookies.userRegistered;
  if (token) {
    return res.json({ status: "Already logged in" });
  }
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM admins WHERE email = ?",
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
              const uid = results[0].id;

              const token = jwt.sign({ id: uid }, "1234", { expiresIn: "1d" });
              const cookieOptions = {
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                httpOnly: true,
              };

              res.cookie("userRegistered", token, cookieOptions);
              return res.json({ status: "Success" });
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
  res.json({ status: "Success", name: "Nahin" });
});

app.get("/logout", (req, res) => {
  res.clearCookie("userRegistered") ;
  res.json({ status: "Success" });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
