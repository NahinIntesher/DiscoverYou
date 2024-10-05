const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);
const { promisify } = require("util");


module.exports = (router) => {
  router.get("/dashboard/overview", verifyToken, (req, res) => {
    const studentQuery = `
      SELECT
      COUNT (s.student_id) AS total_students
      FROM student s
    `;
    const organizerQuery = `
      SELECT
      COUNT (o.organizer_id) AS total_organizers
      FROM organizer o
    `;
    const adminQuery = `
      SELECT
      COUNT (a.admin_id) AS total_admins
      FROM admin a
    `;
    connection.query(studentQuery, (err, studentResults) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }
      connection.query(organizerQuery, (err, organizerResults) => {
        if (err) {
          console.log(err);
          return res.json({ message: "Failed" });
        }
        connection.query(adminQuery, (err, adminResults) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Failed" });
          }
          return res.json({
            studentResults: studentResults[0],
            organizerResults: organizerResults[0],
            adminResults: adminResults[0],
          });
        });
      });
    });
  });

  router.get("/dashboard", verifyToken, async (req, res) => {
    const id = req.userId;

    // SQL queries
    const contestQuery = `
        SELECT 
            c.contest_id AS contestId,
            c.contest_name AS contestName,
            COUNT(c_p.contest_id) AS participant_count,
            (COUNT(c_p.contest_id) * 100.0 / (SELECT COUNT(*) FROM student)) AS participation_percentage
        FROM 
            contests c
        LEFT JOIN 
            contest_participants c_p ON c.contest_id = c_p.contest_id
        GROUP BY 
            c.contest_id
        ORDER BY 
            c.start_time DESC
        LIMIT 10;`;

    const showcasePostQuery = `
        SELECT 
            COUNT(DISTINCT sp.post_id) AS total_showcase_posts,
            COUNT(DISTINCT s.student_id) AS total_students,
            (COUNT(DISTINCT sp.post_id) * 100.0 / NULLIF(COUNT(DISTINCT s.student_id), 0)) AS percentage_showcase_posts
        FROM 
            student s
        LEFT JOIN 
            showcase_posts sp ON s.student_id = sp.user_id;`;

    const courseQuery = `
        SELECT 
            c.course_id AS courseId,
            c.course_name AS courseName,
            COUNT(c_p.course_id) AS participant_count,
            (COUNT(c_p.course_id) * 100.0 / (SELECT COUNT(*) FROM student)) AS participation_percentage
        FROM 
            courses c
        LEFT JOIN 
            course_participants c_p ON c.course_id = c_p.course_id
        GROUP BY 
            c.course_id
        ORDER BY 
            c.course_id DESC
        LIMIT 10;`;

    const webinarQuery = `
        SELECT 
            w.webinar_id AS webinarId,
            w.webinar_name AS webinarName,
            COUNT(wp.webinar_id) AS participant_count,
            (COUNT(wp.webinar_id) * 100.0 / (SELECT COUNT(*) FROM student)) AS participation_percentage
        FROM 
            webinars w
        LEFT JOIN 
            webinar_participants wp ON w.webinar_id = wp.webinar_id
        GROUP BY 
            w.webinar_id
        ORDER BY 
            w.start_time DESC
        LIMIT 10;`;

    const productQuery = `
        SELECT 
            p.product_id AS productId,
            p.product_name AS productName,
            p.product_in_stock AS product_quantity,
            COUNT(m_o.product_id) AS total_sold,
            (COUNT(m_o.product_id) * 100.0 / NULLIF(p.product_in_stock, 0)) AS sold_percentage
        FROM 
            products p
        LEFT JOIN 
            marketplace_orders m_o ON p.product_id = m_o.product_id
        GROUP BY 
            p.product_id
        ORDER BY 
            p.product_id DESC
        LIMIT 10;`;

    const hiringQuery = `
        SELECT 
            h.hiring_id AS hiringId,
            h.job_name AS jobName,
            COUNT(hp.hiring_id) AS participant_count,
            (COUNT(hp.hiring_id) * 100.0 / (SELECT COUNT(*) FROM student)) AS participation_percentage
        FROM 
            hirings h
        LEFT JOIN 
            hiring_applicants hp ON h.hiring_id = hp.hiring_id
        GROUP BY 
            h.hiring_id
        ORDER BY 
            h.start_time DESC
        LIMIT 10;`;

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
        hiringResults,
      ] = await Promise.all([
        queryAsync(contestQuery),
        queryAsync(showcasePostQuery),
        queryAsync(courseQuery),
        queryAsync(webinarQuery),
        queryAsync(productQuery),
        queryAsync(hiringQuery),
      ]);

      // Respond with all the results
      res.json({
        status: "Success",
        contestResults,
        showcaseResults,
        courseResults,
        webinarResults,
        productResults,
        hiringResults,
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
            points DESC`;

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
