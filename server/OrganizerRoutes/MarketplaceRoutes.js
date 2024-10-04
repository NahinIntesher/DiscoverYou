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
    CONCAT("http://localhost:3000/organizer/marketplace/products/image/", (SELECT media_id FROM product_images WHERE product_id = p.product_id LIMIT 1)) AS image_url
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

  router.get("/marketplace", verifyToken, (req, res) => {
    res.json({ messege: "Organizer Market Place" });
  });


  router.get("/marketplace/cart", verifyToken, (req, res) => {
    const userId = req.userId;
    connection.query(
      `SELECT p.*, 
      CONCAT("http://localhost:3000/student/marketplace/products/image/", (SELECT media_id FROM product_images WHERE product_id = p.product_id LIMIT 1)) AS image_url
      FROM marketplace_cart AS m_c
      JOIN products AS p
      ON m_c.product_id = p. product_id
      WHERE m_c.buyer_organizer_id = ?`,
      [userId],
      (err, results) => {
        if (err) throw err;
        
        return res.json({ products: results });
      }
    );
  });

  router.post("/marketplace/add-to-cart", verifyToken, (req, res) => {
    const userId = req.userId;
    
    const { productId } = req.body;

    console.log(productId);

    connection.query(
      "SELECT * FROM marketplace_cart WHERE product_id = ? AND buyer_organizer_id = ?",
      [productId, userId],
      (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          return res.json({ status: "AlreadyAdded" });
        } else {
          connection.query(
            "INSERT INTO marketplace_cart(product_id, buyer_organizer_id) VALUES (?, ?);",
            [productId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Success" });
            }
          );
        }
      }
    );
  });

  router.post("/marketplace/remove-from-cart", verifyToken, (req, res) => {
    const userId = req.userId;
    
    const { productId } = req.body;

    connection.query(
      "DELETE FROM marketplace_cart WHERE product_id = ? AND buyer_organizer_id = ?",
      [productId, userId],
      (err, results) => {
        if (err) throw err; 
        return res.json({ status: "Success" });
      }
    );
  });


  router.post("/marketplace/checkout", verifyToken, (req, res) => {
    const userId = req.userId;
    const { fromCart, deliveryAddress, customerMobileNo, customerEmail, paymentMethod, products} = req.body;

    console.log(req.body);

    products.forEach(product => {
      connection.query(
        "INSERT INTO marketplace_orders(product_id, product_quantity, buyer_organizer_id, delivery_address, delivery_mobile_no, delivery_email, payment_method) VALUES(?, ?, ?, ?, ?, ?, ?);",
        [product.productId, product.productQuantity, userId, deliveryAddress, customerMobileNo, customerEmail, paymentMethod],
        (err, results) => {
          if(err) {
            console.log(err);
          }
        }
      );
    });

    if(fromCart) {
      connection.query(
        "DELETE FROM marketplace_cart WHERE buyer_organizer_id = ?",
        [userId],
        (err, results) => {
          if (err) throw err; 
          return res.json({ status: "Success" });
        }
      );
    }
    else {
      return res.json({ status: "Success" });
    }
  });



  router.get("/marketplace/pending-details", verifyToken, (req, res) => {
    const userId = req.userId;
    
    connection.query(
      `SELECT m_o.*
      FROM marketplace_orders AS m_o
      WHERE m_o.buyer_organizer_id = ? AND is_delivered = 0
      `,
      [userId],
      (err, pendingDeliveryResult) => {
        if (err) throw err;
        return res.json({ 
          pendingDeliveryNo: pendingDeliveryResult.length
        }); 
      }
    );
  });

  router.get("/marketplace/my-order", verifyToken, (req, res) => {
    const userId = req.userId;

    connection.query(
      `SELECT m_o.*, p.product_name, p.product_price,
      CONCAT("http://localhost:3000/student/marketplace/products/image/", (SELECT media_id FROM product_images WHERE product_id = p.product_id LIMIT 1)) AS image_url
      FROM marketplace_orders AS m_o
      JOIN products AS p
      ON m_o.product_id = p.product_id
      WHERE m_o.buyer_organizer_id = ?
      ORDER BY m_o.order_id DESC
      `,
      [userId],
      (err, results) => {
        if (err) throw err;
        
        return res.json({ orders: results });
      }
    );
  });

};
