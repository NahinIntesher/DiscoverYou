const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");
const { promisify } = require("util");


module.exports = (router, multer, bcrypt) => {
  // const storage = multer.memoryStorage();

  // const upload = multer({
  //   storage: storage,
  //   limits: { fileSize: 50000000 }, // 10 MB
  //   fileFilter: (req, file, cb) => {
  //     const filetypes = /image\//; // Accept all image
  //     const mimetype = filetypes.test(file.mimetype);

  //     if (mimetype) {
  //       return cb(null, true);
  //     } else {
  //       cb("Error: Images or PDF files only!");
  //     }
  //   },
  // });

  // router.get("/marketplace/products", verifyToken, (req, res) => {
  //   const id = req.userID;
  //   const query = `SELECT
  //    p.*,
  //   CONCAT("http://localhost:3000/organizer/marketplace/products/image/", (SELECT media_id FROM product_images WHERE product_id = p.product_id LIMIT 1)) AS image_url
  //    FROM
  //       products as p
  //    JOIN
  //       product_images as p_i
  //     ON
  //       p.product_id = p_i.product_id
  //     WHERE
  //       p.approval_status = ?
  //     GROUP BY p.product_id`;
  //   connection.query(query, [1], (err, results) => {
  //     if (err) throw err;
  //     res.json({ products: results });
  //   });
  // });

  // router.get("/marketplace/products/image/:id", (req, res) => {
  //   const mediaId = req.params.id;

  //   connection.query(
  //     `
  //     SELECT product_image
  //     FROM product_images
  //     WHERE media_id = ?
  //   `,
  //     [mediaId],
  //     (err, results) => {
  //       if (err) throw err;
  //       if (results.length === 0) {
  //         return res.status(404).send("Media not found.");
  //       }

  //       const imageData = results[0].product_image;
  //       res.setHeader("Content-Type", "image/");
  //       res.send(imageData);
  //     }
  //   );
  // });

  router.post("/profile/update", verifyToken, (req, res) => {
    const id = req.userId;
    const { name, email, mobile_no, address, date_of_birth } = req.body;
    const query = `
      UPDATE student
      SET 
        student_name = ?, 
        student_email = ?, 
        student_mobile_no = ?, 
        student_address = ?, 
        student_date_of_birth = ?
      WHERE 
        student_id = ?;
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
    const passwordQuery = `select student_password from student where student_id = ?`;
    connection.query(passwordQuery, [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.json({ status: "unsuccessful", error: err.message });
      }
      console.log(results[0]);
      bcrypt.compare(
        oldPassword.toString(),
        results[0].student_password,
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
                const query = `UPDATE student SET student_password = ? WHERE student_id = ?`;
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

  router.post("/profile/settings/change-interests", verifyToken, (req, res) => {
    const id = req.userId;
    const { interests } = req.body;

    // Check if interests is an array
    if (!Array.isArray(interests)) {
      return res.status(400).json({ error: "Interests should be an array" });
    }

    // Step 1: Delete existing interests for the student
    const deleteQuery = "DELETE FROM student_interests WHERE student_id = ?";
    connection.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error deleting existing interests" });
      }

      // Step 2: Insert new interests
      const interestQueries = interests.map((interest) => {
        return new Promise((resolve, reject) => {
          connection.query(
            "INSERT INTO student_interests (interest_name, student_id) VALUES (?, ?)",
            [interest, id],
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
          return res.json({
            status: "Success",
            message: "Interests updated successfully.",
          });
        })
        .catch((error) => {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Error inserting new interests" });
        });
    });
  });


  router.post("/profile/settings/delete", verifyToken, (req, res) => {
    console.log(req.body);
    const id = req.userId;
    const deleteQuery = 'DELETE FROM student WHERE student_id = ?';
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
      }
    );
  });

  router.get("/profile", verifyToken, async (req, res) => {
    const id = req.userId;

    // SQL queries
    const contestQuery = `
        SELECT 
            COUNT(cp.contest_id) AS total_contests,
            SUM(CASE WHEN cp.result_position = 1 THEN 1 ELSE 0 END) AS rank_1_count,
            SUM(CASE WHEN cp.result_position = 2 THEN 1 ELSE 0 END) AS rank_2_count
        FROM contest_participants cp
        JOIN student s ON s.student_id = cp.participant_id
        WHERE s.student_id = ?`;

    const showcasePostQuery = `
        SELECT 
            COUNT(sp.post_id) AS total_posts, 
            COUNT(spr.reaction_id) AS total_reactions
        FROM showcase_posts sp
        LEFT JOIN showcase_post_reactions spr ON sp.post_id = spr.post_id
        WHERE sp.user_id = ?`;

    const courseQuery = `
        SELECT COUNT(participant_id) AS course_count 
        FROM course_participants 
        WHERE participant_id = ?`;

    const webinarQuery = `
        SELECT COUNT(participant_id) AS webinar_count 
        FROM webinar_participants 
        WHERE participant_id = ?`;

    try {
      // Use promisified version of connection.query for cleaner async/await handling
      const queryAsync = promisify(connection.query).bind(connection);

      // Execute the queries concurrently
      const [contestResults, showcaseResults, courseResults, webinarResults] =
        await Promise.all([
          queryAsync(contestQuery, [id]),
          queryAsync(showcasePostQuery, [id]),
          queryAsync(courseQuery, [id]),
          queryAsync(webinarQuery, [id]),
        ]);

      // Respond with all the results
      res.json({
        status: "Success",
        contestResults: contestResults[0],
        showcaseResults: showcaseResults[0],
        courseResults: courseResults[0],
        webinarResults: webinarResults[0],
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: "Error fetching data", error: err.message });
    }
  });
};