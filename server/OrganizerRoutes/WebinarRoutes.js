const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/webinars", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
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
};
