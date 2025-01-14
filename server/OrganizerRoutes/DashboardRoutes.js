const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);
const { promisify } = require("util");

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

  router.get("/dashboard", verifyToken, async (req, res) => {
    const id = req.userId;

    const contestQuery = `
    SELECT  
      (SELECT COUNT(*) FROM contests) AS total_contests,
      (SELECT COUNT(*) 
      FROM contests 
      WHERE organizer_id = ?) AS contests_organized;`;

    const webinarQuery = `
    SELECT 
      (SELECT COUNT(*) FROM webinars) AS total_webinars,
      (SELECT COUNT(*) 
      FROM webinars 
      WHERE host_id = ?) AS webinars_hosted;`;

    const hiringQuery = `
    SELECT 
      (SELECT COUNT(*) FROM hirings) AS total_hirings,
      (SELECT COUNT(*) 
      FROM hirings 
      WHERE organizer_id = ?) AS hirings_organized;`;

    const productQuery = `
    SELECT 
        SUM(p.product_in_stock) AS total_products,
        COUNT(m_o.product_id) AS products_purchased
    FROM 
        products p
    LEFT JOIN 
        marketplace_orders m_o ON p.product_id = m_o.product_id
        AND m_o.buyer_organizer_id = ?;`;
    try {
      // Use promisified version of connection.query for cleaner async/await handling
      const queryAsync = promisify(connection.query).bind(connection);

      // Execute the queries concurrently
      const [contestResults, webinarResults, hiringResults, productResults] =
        await Promise.all([
          queryAsync(contestQuery, [id]),
          queryAsync(webinarQuery, [id]),
          queryAsync(hiringQuery, [id]),
          queryAsync(productQuery, [id]),
        ]);
      // Respond with all the results
      res.json({
        status: "Success",
        contestResults: contestResults[0],
        webinarResults: webinarResults[0],
        hiringResults: hiringResults[0],
        productResults: productResults[0],
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: "Error fetching data", error: err.message });
    }
  });
  router.get("/dashboard/recent-activity", verifyToken, (req, res) => {
    const userId = req.userId;

    const recentActivityQuery = `
      SELECT 
          'Contest' AS Event_Type,
          c.contest_id AS Event_ID,
          c.contest_name AS Title,
          c.start_time AS Date,
          COUNT(c_p.participant_id) AS participant_count
      FROM 
          contests c
      JOIN 
          organizer o ON o.organizer_id = c.organizer_id
      LEFT JOIN 
          contest_participants c_p ON c.contest_id = c_p.contest_id
      WHERE 
          c.end_time < NOW() 
          AND o.organizer_id = ?
      GROUP BY 
          c.contest_id

      UNION ALL

      SELECT 
          'Webinar' AS Event_Type,
          w.webinar_id AS Event_ID,
          w.webinar_description AS Title,
          w.start_time AS Date,
          COUNT(w_p.participant_id) AS participant_count
      FROM 
          webinars w
      JOIN 
          organizer o ON o.organizer_id = w.host_id
      LEFT JOIN 
          webinar_participants w_p ON w.webinar_id = w_p.webinar_id
      WHERE 
          w.end_time < NOW() 
          AND o.organizer_id = ?
      GROUP BY 
          w.webinar_id

      UNION ALL

      SELECT 
          'Hiring' AS Event_Type,
          h.hiring_id AS Event_ID,
          h.company_name AS Title,
          h.start_time AS Date,
          COUNT(h_p.applicant_id) AS participant_count
      FROM 
          hirings h
      JOIN 
          organizer o ON o.organizer_id = h.organizer_id
      LEFT JOIN 
          hiring_applicants h_p ON h.hiring_id = h_p.hiring_id
      WHERE 
          h.end_time < NOW() 
          AND o.organizer_id = ?
      GROUP BY 
          h.hiring_id

      ORDER BY 
          Date DESC
      LIMIT 15;
    `;

    connection.query(
      recentActivityQuery,
      [userId, userId, userId],
      (err, results) => {
        if (err) {
          console.error("Error fetching recent activity:", err);
          return res
            .status(500)
            .json({ message: "Failed to fetch recent activity" });
        }
        res.json({ status: "Success", recentActivity: results });
      }
    );
  });
};
