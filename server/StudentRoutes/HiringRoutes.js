const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  

  router.get("/hirings", verifyToken, (req, res) => {
    res.json({ messege: "This is hiring section" });
  });
};
