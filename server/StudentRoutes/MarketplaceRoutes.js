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

  router.post("/marketplace/product-requests", verifyToken, (req, res) => {
    const id = req.userID;
    const query = `SELECT
     p.*, 
    (SELECT product_image FROM product_images WHERE product_id = p.product_id LIMIT 1) as product_image
     FROM 
        products as p
     JOIN
        product_images as p_i
      ON
        p.product_id = p_i.product_id
      WHERE
        p.approval_status = ?
      GROUP BY p.product_id`;
    connection.query(query, [0], (err, results) => {
      if (err) throw err;
      res.json({ products: results });
    });
  });

  router.get("/marketplace/products", verifyToken, (req, res) => {
    const id = req.userID;
    const query = `SELECT
     p.*, 
    CONCAT("http://localhost:3000/student/marketplace/products/image/", (SELECT media_id FROM product_images WHERE product_id = p.product_id LIMIT 1)) AS image_url
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

  router.post("/marketplace/add-product", upload.array("images"), verifyToken, (req, res) => {
      const id = req.userId;
      const { productName, productPrice, productCategory, productDetails } = req.body;
      const files = req.files;

      connection.query(
        `INSERT INTO products (product_name, product_price, product_category, product_details, seller_id)
          VALUES (?, ?, ?, ?, ?)`,
        [productName, productPrice, productCategory, productDetails, id],
        (err, results) => {
          if (err) throw err;
          let productId = results.insertId;

          if (files.length != 0) {
            for (const file of files) {
              const { buffer } = file;
              connection.query(
                `INSERT INTO product_images (product_id, product_image)
                  VALUES (?, ?)`,
                [productId, buffer],
                (err, result) => {
                  if (err) {
                    console.error("Database insertion error:", err);
                    throw err;
                  }
                }
              );
            }
          }
          res.json({ status: "Success" });
        }
      );
    }
  );

  router.get("/marketplace", verifyToken, (req, res) => {
    res.json({ messege: "Market Place" });
  });
};
