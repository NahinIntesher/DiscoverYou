const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

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
};
