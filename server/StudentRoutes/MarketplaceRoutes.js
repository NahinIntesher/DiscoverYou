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
    router.post(
        "/marketplace/add-product",
        upload.array("media"),
        verifyToken,
        (req, res) => {
            const id = req.userId;
            const { productName, productPrice, productCategory, productDetails  } = req.body;
            const files = req.files;
    
            connection.query(
              `INSERT INTO products (product_name, product_price, product_category, product_details, seller_id)
          VALUES (?, ?, ?, ?, ?)`,
              [productName, productPrice, productCategory, productDetails, id],
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
                        if (err) {
                          console.error("Database insertion error:", err);
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
      );


  router.get('/marketplace', verifyToken, (req, res) => {
    res.json({messege: 'Market Place'});
  });
};
