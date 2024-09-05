const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/marketplace/product-requests", verifyToken, (req, res) => {
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
      res.json({ messege: "Pending Products", products: results });
    });
  });

  router.post("/marketplace/products", verifyToken, (req, res) => {
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
    connection.query(query, [1], (err, results) => {
      if (err) throw err;
      res.json({ products: results });
    });
  });

  router.get("/marketplace", verifyToken, (req, res) => {
    res.json({ messege: "Market Place" });
  });
};
