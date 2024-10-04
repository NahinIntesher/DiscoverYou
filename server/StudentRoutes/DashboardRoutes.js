const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");
const { promisify } = require("util");

module.exports = (router, multer, bcrypt) => {
  router.get("/dashboard", verifyToken, async (req, res) => {
    const id = req.userId;

    // SQL queries
    const contestQuery = `
      SELECT 
      (SELECT COUNT(*) FROM contests) AS total_contests,
      (SELECT COUNT(DISTINCT contest_id) 
      FROM contest_participants 
      WHERE participant_id = 'St0000001') AS participation_by_user;`;

    const showcasePostQuery = `
        SELECT 
          COUNT(sp.post_id) AS user_posts, 
          (SELECT COUNT(*) FROM showcase_posts) AS total_showcase_posts
      FROM showcase_posts sp
      LEFT JOIN showcase_post_reactions spr ON sp.post_id = spr.post_id
      WHERE sp.user_id = ?`;

    const courseQuery = `
        SELECT 
            (SELECT COUNT(*) FROM courses) AS total_courses,
            COUNT(cp.course_id) AS enrolled_courses,
            SUM(CASE WHEN cp.req_for_join_status = 1 THEN 1 ELSE 0 END) AS completed_courses
        FROM 
            course_participants cp
        WHERE 
            cp.participant_id = ?;`;

    const webinarQuery = `
      SELECT 
      (SELECT COUNT(*) FROM webinars) AS total_webinars,
      (SELECT COUNT(DISTINCT webinar_id) 
      FROM webinar_participants 
      WHERE participant_id = ?) AS participation_by_user;`;

    const productQuery = `
      SELECT 
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(DISTINCT product_id) 
        FROM products 
        WHERE seller_id = 'St0000001') AS posted_by_user;`;

    try {
      // Use promisified version of connection.query for cleaner async/await handling
      const queryAsync = promisify(connection.query).bind(connection);

      // Execute the queries concurrently
      const [
        contestResults,
        showcaseResults,
        courseResults,
        webinarResults,
        productResults,
      ] = await Promise.all([
        queryAsync(contestQuery, [id]),
        queryAsync(showcasePostQuery, [id]),
        queryAsync(courseQuery, [id]),
        queryAsync(webinarQuery, [id]),
        queryAsync(productQuery, [id]),
      ]);

      // Respond with all the results
      res.json({
        status: "Success",
        contestResults: contestResults[0],
        showcaseResults: showcaseResults[0],
        courseResults: courseResults[0],
        webinarResults: webinarResults[0],
        productResults: productResults[0],
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: "Error fetching data", error: err.message });
    }
  });

  router.get("/dashboard/leaderboard", verifyToken, async (req, res) => {
    const id = req.userId;

    const leaderboardQuery = `
        SELECT 
            s.student_id AS id, 
            CONCAT(s.student_name) AS name,
            SUM(CASE WHEN s.student_points IS NULL THEN 0 ELSE s.student_points END) AS points
        FROM 
            student s
        GROUP BY 
            s.student_id
        ORDER BY 
            points DESC
        LIMIT 10;`;

    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const students = await queryAsync(leaderboardQuery);

      res.json({ status: "Success", students });
    } catch (err) {
      res
        .status(500)
        .json({ status: "Error fetching leaderboard", error: err.message });
    }
  });

  
};
