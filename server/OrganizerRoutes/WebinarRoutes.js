const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/webinars/pending-details", verifyToken, (req, res) => {
    const userId = req.userId;
    
    connection.query(`SELECT 
      w.host_id
      FROM 
        webinars AS w
      WHERE
        w.host_id = '${userId}' AND w.approval_status = 0`, 
    (err, results) => {
      if (err) throw err;
      
      return res.json({ pendingWebinarNo: results.length});
    });
  });

  router.get("/webinars/ongoing", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.webinar_id) AS participant_count,
      TIMESTAMPDIFF(SECOND,NOW(), w.end_time) AS calculated_time,
      organizer.organizer_name AS host_name,
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture
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
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM webinar_participants
          WHERE webinar_participants.webinar_id = w.webinar_id
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
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture
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
  router.get("/webinars/myCreated", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.webinar_id) AS participant_count,
      TIMESTAMPDIFF(SECOND,NOW(), w.end_time) AS calculated_time,
      organizer.organizer_name AS host_name,
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture
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
          w.webinar_id AND w.host_id = ?; 
    `;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ webinars: result });
    });
  });


  router.get("/webinars/my", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT 
        w.webinar_id, w.webinar_name, w.webinar_category, w.webinar_description, COUNT(w.webinar_id) AS total_webinars,
        o.organizer_name AS host_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS host_picture
        FROM webinars w
        JOIN organizer o ON o.organizer_id = w.host_id
        WHERE w.host_id = ?`;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ webinarResults: result });
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
            function(err, results) {
              if (err) throw err;
              return res.json({status: "Unregistered"});
            }
          );
        } else {
          connection.query(
            "INSERT INTO webinar_participants(webinar_id, participant_id) VALUES (?, ?);",
            [webinarId, userId],
            function(err, results) {
              if (err) throw err;
              return res.json({status: "Registered"});
            }
          );
        }
      }
    );
  });


  router.post(
    "/webinar/new",
    verifyToken,
    (req, res) => {
        const userId = req.userId;

        const { webinarName, webinarCategory, webinarDescription, startTime, endTime, meetingLink} = req.body;
  
        connection.query(
          `INSERT INTO webinars (webinar_name, webinar_category, webinar_description, start_time, end_time, meeting_link, host_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [webinarName, webinarCategory, webinarDescription, startTime, endTime, meetingLink, userId],
          (err, results) => {
            if (err) throw err;
            return res.json({ status: "Success" });
          }
        );
    }
  );


  router.get("/webinars/pending", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.webinar_id) AS participant_count,
      TIMESTAMPDIFF(SECOND,NOW(), w.end_time) AS calculated_time,
      organizer.organizer_name AS host_name,
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM webinar_participants
          WHERE webinar_participants.webinar_id = w.webinar_id
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
        w.host_id = '${userId}' AND w.approval_status = 0
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
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture,
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

    connection.query(webinarQuery, [webinarId], (err, webinarResults) => {
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
};
