const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/webinars/ongoing", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.webinar_id) AS participant_count,
      TIMESTAMPDIFF(SECOND,NOW(), w.end_time) AS calculated_time,
      organizer.organizer_name AS host_name,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM webinar_participants
          WHERE webinar_participants.webinar_id = w.webinar_id AND webinar_participants.participant_id = ?
        )
        THEN true
        ELSE false
      END AS is_joined
      FROM 
          webinars w
      LEFT JOIN 
          webinar_participants w_p
      ON 
          w.webinar_id = w_p.webinar_id
      LEFT JOIN 
          organizer
      ON 
          w.host_id = organizer.organizer_id
      WHERE
        (NOW() >= w.start_time) AND (NOW() <= w.end_time) AND w.approval_status = 1
      GROUP BY 
          w.webinar_id;
    `;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ webinars: result });
    });
  });

  router.get("/webinars/upcoming", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.webinar_id) AS participant_count,
      TIMESTAMPDIFF(SECOND,NOW(), w.end_time) AS calculated_time,
      organizer.organizer_name AS host_name,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM webinar_participants
          WHERE webinar_participants.webinar_id = w.webinar_id AND webinar_participants.participant_id = ?
        )
        THEN true
        ELSE false
      END AS is_joined
      FROM 
          webinars w
      LEFT JOIN 
          webinar_participants w_p
      ON 
          w.webinar_id = w_p.webinar_id
      LEFT JOIN 
          organizer
      ON 
          w.host_id = organizer.organizer_id
      WHERE
        NOW() <= w.start_time AND w.approval_status = 1
      GROUP BY 
          w.webinar_id;
    `;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ webinars: result });
    });
  });

  router.get("/webinars/previous", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.webinar_id) AS participant_count,
      TIMESTAMPDIFF(SECOND,NOW(), w.end_time) AS calculated_time,
      organizer.organizer_name AS host_name,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM webinar_participants
          WHERE webinar_participants.webinar_id = w.webinar_id AND webinar_participants.participant_id = ?
        )
        THEN true
        ELSE false
      END AS is_joined
      FROM 
          webinars w
      LEFT JOIN 
          webinar_participants w_p
      ON 
          w.webinar_id = w_p.webinar_id
      LEFT JOIN 
          organizer
      ON 
          w.host_id = organizer.organizer_id
      WHERE
        NOW() >= w.end_time AND w.approval_status = 1
      GROUP BY 
          w.webinar_id;
    `;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ webinars: result });
    });
  });

  router.post("/webinars/register", verifyToken, (req, res) => {
    const userId = req.userId;
    const { webinarId } = req.body;

    connection.query(
      "SELECT * FROM webinar_participants WHERE webinar_id = ? AND participant_id = ?",
      [webinarId, userId],
      (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          connection.query(
            "DELETE FROM webinar_participants WHERE webinar_id = ? AND participant_id = ?;",
            [webinarId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Unregistered" });
            }
          );
        } else {
          connection.query(
            "INSERT INTO webinar_participants(webinar_id, participant_id) VALUES (?, ?);",
            [webinarId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Registered" });
            }
          );
        }
      }
    );
  });

  router.get("/webinar/:webinarId", verifyToken, (req, res) => {
    const userId = req.userId;
    const { webinarId } = req.params;

    // Fetch webinar details
    const webinarQuery = `
      SELECT w.*, COUNT(w_p.webinar_id) AS participant_count,
        CASE 
            WHEN NOW() < w.start_time THEN TIMESTAMPDIFF(SECOND, NOW(), w.start_time)
            ELSE TIMESTAMPDIFF(SECOND,NOW(), w.end_time)    
        END AS calculated_time,
        organizer.organizer_name AS host_name,
        CASE
          WHEN EXISTS (
            SELECT *
            FROM webinar_participants
            WHERE webinar_participants.webinar_id = w.webinar_id AND webinar_participants.participant_id = ?
          )
          THEN true
          ELSE false
        END AS is_joined,
        CASE 
          WHEN NOW() >= w.end_time THEN "previous"
          WHEN NOW() <= w.start_time THEN "upcoming"
          ELSE "ongoing"  
        END AS webinar_type
        FROM 
            webinars w
        LEFT JOIN 
            webinar_participants w_p
        ON 
            w.webinar_id = w_p.webinar_id
        LEFT JOIN 
            organizer
        ON 
            w.host_id = organizer.organizer_id
        WHERE w.webinar_id = ?;
        
      `;

    // Fetch webinar participants
    const participantsQuery = `
    SELECT webinar_participants.*, student.student_name AS participant_name
    FROM webinar_participants
    JOIN student ON webinar_participants.participant_id = student.student_id
    WHERE webinar_participants.webinar_id = ?`;

    connection.query(webinarQuery, [userId, webinarId], (err, webinarResults) => {
      if (err) {
        console.error("Error fetching webinar:", err);
        return res.json({ error: "Error fetching webinar details" });
      }
      if (webinarResults.length === 0) {
        return res.json({ error: "Webinar not found" });
      }

      connection.query(
        participantsQuery,
        [webinarId],
        (err, participantsResults) => {
          if (err) {
            console.error("Error fetching webinar participants:", err);
            return res.json({ error: "Error fetching webinar participants" });
          }
          return res.json({
            webinar: webinarResults[0],
            participants: participantsResults,
          });
        }
      );
    });
  });

  router.post("/webinar/add-webinar", verifyToken, (req, res) => {
    const host_id = req.userId;
    const {
      webinar_name,
      webinar_description,
      webinar_category,
      start_time,
      end_time,
      recorded_link,
      meeting_link,
      approver_id,
    } = req.body;

    connection.query(
      `INSERT INTO webinars (host_id, webinar_name, webinar_description,	webinar_category,	start_time,	end_time, recorded_link, meeting_link, approver_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        host_id,
        webinar_name,
        webinar_description,
        webinar_category,
        start_time,
        end_time,
        recorded_link,
        meeting_link,
        approver_id,
      ],
      (err, results) => {
        if (err) throw err;

        res.json({ status: "Success" });
      }
    );
  });

  router.get("/webinars/my", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT 
        w.webinar_name, 
        w.webinar_description, 
        w.webinar_category, 
        COUNT(w_p.webinar_id) AS participant_count, 
        organizer.organizer_name AS host_name
    FROM 
        webinars w
    JOIN 
        webinar_participants w_p
    ON 
        w.webinar_id = w_p.webinar_id
    LEFT JOIN 
        organizer
    ON 
        w.host_id = organizer.organizer_id
    WHERE
        w_p.participant_id = '${userId}'
    GROUP BY 
        w_p.webinar_id;
    `;
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ myWebinars: result });
    });
  });
};
