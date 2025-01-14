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
      WHERE participant_id = ?) AS participation_by_user;`;

    const showcasePostQuery = `
      SELECT 
          COUNT(DISTINCT sp.post_id) AS total_posts, 
          COUNT(DISTINCT spr.reaction_id) AS total_reactions,
          (SELECT COUNT(*) FROM showcase_posts) AS total_showcase_posts

      FROM showcase_posts sp
      LEFT JOIN showcase_post_reactions spr ON sp.post_id = spr.post_id
      WHERE sp.user_id = ?
      GROUP BY sp.user_id;`;

    const courseQuery = `
        SELECT 
          (SELECT COUNT(course_id) FROM courses) AS total_courses,
          COUNT(c_p.course_id) AS enrolled_courses,
          SUM(
              CASE 
                  WHEN 
                      (SELECT COUNT(c_c_m.material_id) 
                      FROM completed_course_materials AS c_c_m 
                      JOIN course_materials AS c_m ON c_c_m.material_id = c_m.material_id 
                      WHERE c_c_m.participant_id = ? AND c_m.course_id = c.course_id
                      ) = 
                      (SELECT COUNT(DISTINCT c_m.material_id) 
                      FROM course_materials AS c_m 
                      WHERE c_m.course_id = c.course_id
                      )
                  THEN 1
                  ELSE 0
              END
          ) AS completed_courses
      FROM courses AS c
      JOIN course_participants AS c_p
      ON c.course_id = c_p.course_id
      WHERE c_p.participant_id = ? 
      AND c_p.req_for_join_status = 1;`;

    const webinarQuery = `
      SELECT 
      (SELECT COUNT(*) FROM webinars) AS total_webinars,
      (SELECT COUNT(DISTINCT webinar_id) 
      FROM webinar_participants 
      WHERE participant_id = ?) AS participation_by_user;`;

    const productQuery = `
      SELECT 
          (SELECT SUM(product_in_stock) FROM products) AS total_products,
          SUM(products.product_in_stock) AS seller_products_in_stock 
      FROM products
      WHERE products.seller_id = ?`;

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
        queryAsync(courseQuery, [id, id]),
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
        LIMIT 15;`;

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
