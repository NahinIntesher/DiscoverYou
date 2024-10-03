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
        WITH last_10_contests AS (
            SELECT contest_id 
            FROM contests 
            ORDER BY start_time DESC 
            LIMIT 10
        )
        SELECT 
            COUNT(cp.contest_id) AS user_participation_last_10_contests, 
            (SELECT COUNT(*) FROM contest_participants) AS total_contest_participants,
            (SELECT COUNT(*) 
            FROM last_10_contests) AS total_contests_last_10,
            SUM(CASE WHEN cp.result_position = 1 THEN 1 ELSE 0 END) AS rank_1_count
        FROM contest_participants cp
        JOIN contests c ON cp.contest_id = c.contest_id
        WHERE cp.participant_id = ?
        AND c.contest_id IN (SELECT contest_id FROM last_10_contests);`;

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
        WITH last_10_webinars AS (
            SELECT webinar_id 
            FROM webinars 
            ORDER BY start_time DESC 
            LIMIT 10
        )
        SELECT 
            (SELECT COUNT(*) FROM last_10_webinars) AS total_webinars_last_10,
            COUNT(wp.webinar_id) AS user_participation_last_10_webinars
        FROM 
            last_10_webinars lw
        LEFT JOIN 
            webinar_participants wp ON lw.webinar_id = wp.webinar_id
        WHERE 
            wp.participant_id = ?;`;

    try {
      // Use promisified version of connection.query for cleaner async/await handling
      const queryAsync = promisify(connection.query).bind(connection);

      // Execute the queries concurrently
      const [contestResults, showcaseResults, courseResults, webinarResults] =
        await Promise.all([
          queryAsync(contestQuery, [id]),
          queryAsync(showcasePostQuery, [id]),
          queryAsync(courseQuery, [id]),
          queryAsync(webinarQuery, [id]),
        ]);

      // Respond with all the results
      res.json({
        status: "Success",
        contestResults: contestResults[0],
        showcaseResults: showcaseResults[0],
        courseResults: courseResults[0],
        webinarResults: webinarResults[0],
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
