const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router, multer) => {
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
    const id = req.userId;
    const { oldPassword, password } = req.body;
    const passwordQuery = `Select organizer_password from organizer where id = ?`;
    connection.query(passwordQuery, [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.json({ status: "unsuccessful", error: err.message });
      }
      bcrypt.compare(
        oldPassword.toString(),
        results[0].password,
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
                      status: "successful",
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
            return res.json({ Error: "Password incorrect" });
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

    // Step 1: Delete existing interests for the organizer
    const deleteQuery = "DELETE FROM organizer_interests WHERE organizer_id = ?";
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
};
