const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");
const { promisify } = require("util");

module.exports = (router, multer, bcrypt) => {
  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 10 MB
    fileFilter: (req, file, cb) => {
      const filetypes = /image\//; // Accept all image
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype) {
        return cb(null, true);
      } else {
        cb("Error: Images or PDF files only!");
      }
    },
  });

  router.get("/profile/picture/:userId", verifyToken, (req, res) => {
    const { userId } = req.params;

    connection.query(
      `
      SELECT organizer_picture
      FROM organizer
      WHERE organizer_id = ?
    `,
      [userId],
      (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          return res.status(404).send("Media not found.");
        }

        const imageData = results[0].organizer_picture;
        res.setHeader("Content-Type", "image/");
        res.send(imageData);
      }
    );
  });

  router.post(
    "/profile/update-profile",
    upload.array("images"),
    verifyToken,
    (req, res) => {
      const userId = req.userId;
      const files = req.files;

      if (files.length != 0) {
        const { buffer } = files[0];
        connection.query(
          `UPDATE organizer SET organizer_picture = ?
        WHERE organizer_id = ?`,
          [buffer, userId],
          (err, result) => {
            if (err) {
              console.error("Database insertion error:", err);
              throw err;
            }
            res.json({
              status: "Success",
            });
          }
        );
      } else {
        res.json({
          status: "Unsuccessful",
          message: "No file selected",
        });
      }
    }
  );

  router.post("/profile/update", verifyToken, (req, res) => {
    const id = req.userId;
    const { name, email, mobile_no, address, date_of_birth } = req.body;
    const query = `
      UPDATE organizer
      SET 
        organizer_name = ?, 
        organizer_email = ?, 
        organizer_mobile_no = ?, 
        organizer_address = ?, 
        organizer_date_of_birth = ?
      WHERE 
        organizer_id = ?;
    `;

    connection.query(
      query,
      [name, email, mobile_no, address, date_of_birth, id],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.json({ status: "unsuccessful", error: err.message });
        }

        if (results.affectedRows > 0) {
          res.json({
            status: "successful",
            message: "Profile updated successfully.",
          });
        } else {
          res.json({
            status: "unsuccessful",
            message: "Profile update failed. No changes were made.",
          });
        }
      }
    );
  });

  router.post("/profile/settings/change-password", verifyToken, (req, res) => {
    console.log(req.body);
    const id = req.userId;
    const { oldPassword, password, confirmPassword } = req.body;
    const passwordQuery = `select organizer_password from organizer where organizer_id = ?`;
    connection.query(passwordQuery, [id], (err, results) => {
      if (err) {
        return res.json({ status: "unsuccessful", error: err.message });
      }
      bcrypt.compare(
        oldPassword.toString(),
        results[0].organizer_password,
        (err, response) => {
          if (err) return res.json({ Error: "Error comparing password" });
          if (response) {
            if (password === confirmPassword) {
              bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                  console.error(err);
                  return res.json({
                    status: "unsuccessful",
                    error: err.message,
                  });
                }
                const query = `UPDATE organizer SET organizer_password = ? WHERE organizer_id = ?`;
                connection.query(
                  query,
                  [hashedPassword, id],
                  (err, results) => {
                    if (err) {
                      console.error(err);
                      return res.json({
                        status: "unsuccessful",
                        error: err.message,
                      });
                    }
                    res.json({
                      status: "Success",
                      message: "Password updated successfully.",
                    });
                  }
                );
              });
            } else {
              res.json({
                status: "unsuccessful",
                message: "Passwords do not match",
              });
            }
          } else {
            return res.json({ Error: "Old password is incorrect" });
          }
        }
      );
    });
  });

  router.post("/profile/settings/delete", verifyToken, (req, res) => {
    console.log(req.body);
    const id = req.userId;
    const deleteQuery = "DELETE FROM organizer WHERE organizer_id = ?";
    // const deleteQuery = 'SELECT * FROM student WHERE student_id = ?';

    connection.query(deleteQuery, [id], (err, response) => {
      if (err) {
        throw err;
        //          return res.status(500).json({ error: "Error deleting the account" });
      }
      res.clearCookie("userRegistered");
      return res.json({
        status: "Success",
        message: "Account deleted successfully.",
      });
    });
  });

  router.get("/profile", verifyToken, async (req, res) => {
    const id = req.userId;

    // SQL queries
    const contestQuery = `
        SELECT 
        c.contest_name, c.contest_category, c.contest_details, COUNT(c.contest_id) AS total_contests,
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
        FROM contests c
        JOIN organizer o ON o.organizer_id = c.organizer_id
        WHERE c.organizer_id = ?`;

    const webinarQuery = `
        SELECT 
        w.webinar_name, w.webinar_category, w.webinar_description, COUNT(w.webinar_id) AS total_webinars,
        o.organizer_name AS host_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS host_picture
        FROM webinars w
        JOIN organizer o ON o.organizer_id = w.host_id
        WHERE w.host_id = ?`;

    const hiringQuery = `
        SELECT 
        h.company_name, h.job_name, h.job_category, h.job_description, COUNT(h.hiring_id) AS total_hirings,
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
        FROM hirings h
        JOIN organizer o ON o.organizer_id = h.organizer_id
        WHERE h.organizer_id = ?`;

    try {
      // Use promisified version of connection.query for cleaner async/await handling
      const queryAsync = promisify(connection.query).bind(connection);

      // Execute the queries concurrently
      const [contestResults, webinarResults, hiringResults] = await Promise.all(
        [
          queryAsync(contestQuery, [id]),
          queryAsync(webinarQuery, [id]),
          queryAsync(hiringQuery, [id]),
        ]
      );

      // Respond with all the results
      res.json({
        status: "Success",
        contestResults: contestResults[0],
        webinarResults: webinarResults[0],
        hiringResults: hiringResults[0],
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: "Error fetching data", error: err.message });
    }
  });

  router.get("/common-profile/", verifyToken, async (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    // SQL queries
    const contestQuery = `
        SELECT 
        c.contest_name, c.contest_category, c.contest_details, COUNT(c.contest_id) AS total_contests,
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
        FROM contests c
        JOIN organizer o ON o.organizer_id = c.organizer_id
        WHERE c.organizer_id = ?`;

    const webinarQuery = `
        SELECT 
        w.webinar_name, w.webinar_category, w.webinar_description, COUNT(w.webinar_id) AS total_webinars,
        o.organizer_name AS host_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS host_picture
        FROM webinars w
        JOIN organizer o ON o.organizer_id = w.host_id
        WHERE w.host_id = ?`;

    const hiringQuery = `
        SELECT 
        h.company_name, h.job_name, h.job_category, h.job_description, COUNT(h.hiring_id) AS total_hirings,
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
        FROM hirings h
        JOIN organizer o ON o.organizer_id = h.organizer_id
        WHERE h.organizer_id = ?`;

    try {
      // Use promisified version of connection.query for cleaner async/await handling
      const queryAsync = promisify(connection.query).bind(connection);

      // Execute the queries concurrently
      const [contestResults, webinarResults, hiringResults] = await Promise.all(
        [
          queryAsync(contestQuery, [userId]),
          queryAsync(webinarQuery, [userId]),
          queryAsync(hiringQuery, [userId]),
        ]
      );

      // Respond with all the results
      res.json({
        status: "Success",
        contestResults: contestResults[0],
        webinarResults: webinarResults[0],
        hiringResults: hiringResults[0],
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: "Error fetching data", error: err.message });
    }
  });
};
