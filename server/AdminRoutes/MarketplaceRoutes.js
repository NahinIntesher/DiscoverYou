const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router, multer) => {
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

  router.get("/marketplace/products", verifyToken, (req, res) => {
    const id = req.userID;
    const query = `SELECT
     p.*, 
    CONCAT("http://localhost:3000/admin/marketplace/products/image/", (SELECT media_id FROM product_images WHERE product_id = p.product_id LIMIT 1)) AS image_url
     FROM 
        products as p
     JOIN
        product_images as p_i
      ON
        p.product_id = p_i.product_id
      WHERE
        p.approval_status = ?
      GROUP BY p.product_id`;
    connection.query(query, [1], (err, results) => {
      if (err) throw err;
      res.json({ products: results });
    });
  });

  router.get("/marketplace/product-requests", verifyToken, (req, res) => {
    const id = req.userID;
    const query = `SELECT 
    p.*, 
    s.student_name as seller_name,
    CONCAT("http://localhost:3000/admin/marketplace/products/image/", 
        (SELECT media_id FROM product_images WHERE product_id = p.product_id LIMIT 1)) AS image_url
    FROM 
        products AS p
    JOIN 
        product_images AS p_i
        ON p.product_id = p_i.product_id
    JOIN 
        student AS s
        ON p.seller_id = s.student_id
    WHERE 
        p.approval_status = ?
    GROUP BY 
        p.product_id;
    `;
    connection.query(query, [0], (err, results) => {
      if (err) throw err;
      res.json({ products: results });
    });
  });

  router.get("/marketplace/products/image/:id", (req, res) => {
    const mediaId = req.params.id;

    connection.query(
        `
      SELECT product_image 
      FROM product_images 
      WHERE media_id = ?
    `,
        [mediaId],
        (err, results) => {
          if (err) throw err;
          if (results.length === 0) {
            return res.status(404).send("Media not found.");
          }

          const imageData = results[0].product_image;
          res.setHeader("Content-Type", "image/");
          res.send(imageData);
        }
      );
    });

  router.post("/marketplace/product/approve", verifyToken, (req, res) => {
    const { productId } = req.body;
    console.log(productId);
    connection.query(
      `UPDATE products SET approval_status = ? 
        WHERE product_id = ?;`,
      [1, productId],
      (err, results) => {
        if (err) throw err;
        return res.json({ status: "Success" });
      }
    );
  });

  router.post("/marketplace/product/reject", verifyToken, (req, res) => {
    const { productId } = req.body;
    connection.query(
      `DELETE FROM product_images WHERE product_id = ?;`,
      [productId],
      (err, results) => {
        if (err) {
          console.error("Error deleting product images:", err);
          return res.json({
            status: "Error",
            message: "Failed to delete product images",
          });
        }
        connection.query(
          `DELETE FROM products WHERE product_id = ?;`,
          [productId],
          (err, results) => {
            if (err) {
              console.error("Error deleting product:", err);
              return res.json({
                status: "Error",
                message: "Failed to delete product",
              });
            }
            return res.json({ status: "Success" });
          }
        );
      }
    );
  });

  router.get("/marketplace", verifyToken, (req, res) => {
    res.json({ messege: "Organizer Market Place" });
  });
};
