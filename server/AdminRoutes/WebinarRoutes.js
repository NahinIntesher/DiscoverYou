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
      organizer.organizer_name AS host_name
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
      organizer.organizer_name AS host_name
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
      organizer.organizer_name AS host_name
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


  router.get("/webinars/pending", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.webinar_id) AS participant_count,
      organizer.organizer_name AS host_name
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
        w.approval_status = 0
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

  router.post(
    "/webinars/approve",
    verifyToken,
    (req, res) => {
      const userId = req.userId;
      const { webinarId } = req.body;
      connection.query(
        `UPDATE webinars SET approval_status = '1', approver_id = ? 
        WHERE webinar_id = ?;`,
        [userId, webinarId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );

  router.post(
    "/webinars/reject",
    verifyToken,
    (req, res) => {
      const { webinarId } = req.body;
      connection.query(
        `DELETE FROM webinars 
        WHERE webinar_id = ?;`,
        [webinarId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );


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
