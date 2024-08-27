const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/webiners", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `SELECT * FROM webinars = ?`;
    
  });
};
