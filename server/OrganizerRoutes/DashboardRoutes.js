const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

module.exports = (router) => {
  router.get("/dashboard/overview", verifyToken, async (req, res) => {
    const contestQuery = `
    SELECT COUNT(c.contest_id) AS total_contests
    FROM contest c`;
    const webinarQuery = `
    SELECT COUNT(w.webinar_id) AS total_webinars
    FROM webinar w`;
    const hiringQuery = `
    SELECT COUNT(h.hiring_id) AS total_hirings
    FROM hiring h`;

    try {
      const [contestResults, webinarResults, hiringResults] = await Promise.all(
        [query(contestQuery), query(webinarQuery), query(hiringQuery)]
      );

      res.json({
        contestResults: contestResults[0],
        webinarResults: webinarResults[0],
        hiringResults: hiringResults[0],
      });
    } catch (error) {
      console.error("Error in dashboard overview:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });
};
