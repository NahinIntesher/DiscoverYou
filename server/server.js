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
const multer = require('multer');
const { error } = require("console");


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
  const id = req.userId;

  // Query to get user data and interests using LEFT JOIN
  const query = `
    SELECT u.*, GROUP_CONCAT(ui.interest_name) AS interests
    FROM user u
    LEFT JOIN user_interest ui ON u.user_id = ui.user_id
    WHERE u.user_id = ?
    GROUP BY u.user_id
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ Error: "Error fetching user data" });
    }
    // Ensure results is not empty
    if (results.length === 0) {
      return res.status(404).json({ Error: "User not found" });
    }
    // Process results
    const user = results[0];
    const interests = user.interests ? user.interests.split(",") : [];

    return res.json({
      status: "Success",
      user: {
        ...user,
        interests,
      },
    });
  });
});

app.get("/contest/student", verifyToken, (req, res) => {
  const query = `SELECT 
    contest.*, 
    CASE 
        WHEN NOW() < contest.start_time THEN TIMESTAMPDIFF(SECOND, NOW(), contest.start_time)
        ELSE TIMESTAMPDIFF(SECOND,NOW(), contest.end_time)    
    END AS calculated_time,
    user.name AS organizer, 
    COUNT(contest_participants.contest_id) AS participant_count
    FROM 
      contest 
    JOIN 
      user ON contest.organizer_id = user.user_id 
    JOIN 
      contest_participants ON contest.contest_id = contest_participants.contest_id 
    WHERE 
      contest.approval_status = 1
    GROUP BY 
      contest.contest_id, 
      user.name`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching contests:", err);
      return res.json({ Error: "Error fetching contests" });
    }
    return res.json({ contests: results });
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("userRegistered");
  res.json({ status: "Success" });
});






// Showcase
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 10 MB
    fileFilter: (req, file, cb) => {
      const filetypes = /image\/|audio\/|video\//;  // Accept all image, audio, and video types
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype) {
        return cb(null, true);
      } else {
        cb('Error: Images or PDF files only!');
      }
    }
});

app.post("/showcase/post", upload.array("media"), verifyToken, (req, res) => {
  const token = req.cookies.userRegistered;
  if (token) {
    const id = req.userId;
    const { content, category } = req.body;
    const files = req.files;

    connection.query(
      `INSERT INTO showcase_posts (post_content, poster_id, post_category)
      VALUES (?, ?, ?)`,
      [content, id, category],
      (err, results) => {
        if (err) throw err;
        let postId = results.insertId;

        if (files.length != 0) {
          for (const file of files) {
            const { mimetype, buffer } = file;
            connection.query(
              `INSERT INTO showcase_post_media (post_id, post_media, media_type)
              VALUES (?, ?, ?)`,
              [postId, buffer, mimetype],
              (err, result) => {
                if (err){ 
                  console.error('Database insertion error:', err);
                  throw err;
                }
              }
            );
          }
        }

        return res.json({ status: "Success" });
      }
    );
  }
  else {
    res.json({ Error: "No user logged" }); 
  }
});

//showcase_post_media.post_media,

app.get("/showcase/post", verifyToken, (req, res) => {
  const token = req.cookies.userRegistered;
  if (token) {
    const userId = req.userId;

    const query = `SELECT 
      showcase_posts.*, 
      user.name AS poster_name,
      TIMESTAMPDIFF(SECOND, showcase_posts.post_date_time, NOW()) AS post_time_ago,
      showcase_post_media.media_type,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM showcase_post_reactions
          WHERE showcase_post_reactions.post_id = showcase_posts.post_id 
          AND showcase_post_reactions.reactor_id = ${userId}
        ) THEN 1
        ELSE 0
      END AS is_reacted,
      COUNT(DISTINCT p_r.reactor_id) AS reaction_count,
      COUNT(DISTINCT p_c.comment_id) AS comment_count,
      GROUP_CONCAT(
          CONCAT(
              '{"media_url": "http://localhost:3000/showcase/media/cdn/', showcase_post_media.media_id, 
              '", "media_type": "', showcase_post_media.media_type, '"}'
          ) 
          SEPARATOR ', '
      ) AS media_array
      FROM 
        showcase_posts 
      JOIN 
        user ON showcase_posts.poster_id = user.user_id
      LEFT JOIN 
        showcase_post_media ON showcase_post_media.post_id = showcase_posts.post_id
      LEFT JOIN 
        showcase_post_reactions p_r ON p_r.post_id = showcase_posts.post_id
      LEFT JOIN 
        showcase_post_comments p_c ON p_c.post_id = showcase_posts.post_id
      GROUP BY
        showcase_posts.post_id
      ORDER BY
        showcase_posts.post_date_time DESC;
    `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      return res.json({ posts: results });
    });
  }
});


app.get('/showcase/media/cdn/:id', (req, res) => {
  const mediaId = req.params.id;

  connection.query(`
    SELECT media_type, post_media 
    FROM showcase_post_media 
    WHERE media_id = ?
  `, 
  [mediaId], 
  (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).send('Media not found.');
    }

    const media = results[0];
    const mediaType = media.media_type;
    const mediaData = media.post_media;

    res.setHeader('Content-Type', mediaType);

    res.send(mediaData);
  });
});

app.post("/showcase/react", verifyToken, function(req,res){ 
  const token = req.cookies.userRegistered;
  if (token) {
    const userId = req.userId;
    let { postId } = req.body;

    console.log(postId);
    console.log(userId);

    connection.query(`
      SELECT * 
      FROM showcase_post_reactions 
      WHERE post_id = ? AND reactor_id = ?`,
    [postId, userId], 
    function(error, result){
      if(error) throw error;
      if(result.length <= 0) {
        connection.query(
          `INSERT INTO showcase_post_reactions(post_id, reactor_id) 
          VALUES(?, ?)`,
        [postId, userId], 
        function(error, result){
            if(error) throw error;
            return res.json({ status: "Success", message: "Liked" }); 
        }); 
      } else {
          connection.query(
            `DELETE FROM showcase_post_reactions 
            WHERE post_id = ? AND reactor_id = ?`, 
          [postId, userId],
          function(error, result){
              if(error) throw error;
              return res.json({ status: "Success", message: "Unliked" }); 
          }); 
      }
    });
  }
});


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
