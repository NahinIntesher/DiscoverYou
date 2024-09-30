const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

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
    const {userId} = req.params;

    connection.query(`
      SELECT admin_picture
      FROM admin
      WHERE admin_id = ?
    `,
      [userId],
      (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          return res.status(404).send("Media not found.");
        }

        const imageData = results[0].admin_picture;
        res.setHeader("Content-Type", "image/");
        res.send(imageData);
      }
    );
  });

  router.post("/profile/update-profile", upload.array("images"), verifyToken, (req, res) => {
    const userId = req.userId;
    const files = req.files;

    if (files.length != 0) {
      const { buffer } = files[0];
      connection.query(
        `UPDATE admin SET admin_picture = ?
        WHERE admin_id = ?`,
        [buffer, userId],
        (err, result) => {
          if (err) {
            console.error("Database insertion error:", err);
            throw err;
          }
          res.json({
            status: "Success"
          });
        }
      );
    }
    else {
      res.json({
        status: "Unsuccessful",
        message: "No file selected",
      });
    }
  });

  router.post("/profile/update", verifyToken, (req, res) => {
    const id = req.userId;
    const { name, email, mobile_no, address, date_of_birth } = req.body;
    const query = `
      UPDATE admin
      SET 
        admin_name = ?, 
        admin_email = ?, 
        admin_mobile_no = ?, 
        admin_address = ?, 
        admin_date_of_birth = ?
      WHERE 
        admin_id = ?;
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
    const { oldPassword, password, confirmPassword } = req.body;
    const passwordQuery = `select admin_password from admin where admin_id = ?`;
    connection.query(passwordQuery, [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.json({ status: "unsuccessful", error: err.message });
      }
      bcrypt.compare(
        oldPassword.toString(),
        results[0].admin_password,
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
                const query = `UPDATE admin SET admin_password = ? WHERE admin_id = ?`;
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
            return res.json({ Error: "Old Password is incorrect" });
          }
        }
      );
    });
  });

  router.post("/profile/settings/delete", verifyToken, (req, res) => {
    console.log(req.body);
    const id = req.userId;
    const deleteQuery = "DELETE FROM admin WHERE admin_id = ?";
    // const deleteQuery = 'SELECT * FROM admin WHERE admin_id = ?';

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
