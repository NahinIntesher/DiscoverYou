const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

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
};
