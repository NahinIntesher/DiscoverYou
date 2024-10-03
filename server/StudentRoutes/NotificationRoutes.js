const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {

  router.post('/notifications', verifyToken, (req, res) => {
    const userId = req.userId;

    const { recipientId, notificationTitle, notificationMessage, notificationLink, notificationPicture } = req.body;

    connection.query(
        `INSERT INTO 
        notifications(
            recipient_student_id, 
            notification_title, 
            notification_message, 
            notification_link,
            notification_picture
        ) 
        VALUES (?, ?, ?, ?, ?);
        `,
        [recipientId, notificationTitle, notificationMessage, notificationLink, notificationPicture],
        (err, results) => {
            if (err) {
                console.error("Error fetching notifications:", err);
                return res.status(500).json({ Error: "Error sending notifications" });
            }
            return res.json({
                status: "Success"
            });
        }
    );
  })

  router.get('/notifications', verifyToken, (req, res)=>{
    const userId = req.userId;

    connection.query(
      "SELECT *, TIMESTAMPDIFF(SECOND, sent_time, NOW()) AS notification_time_ago FROM notifications WHERE recipient_student_id = ? ORDER BY notification_id DESC",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Error fetching notifications:", err);
          return res.status(500).json({ Error: "Error fetching notifications" });
        }
        return res.json({
          status: "Success",
          notifications: results,
        });
      }
    );
  });
};
