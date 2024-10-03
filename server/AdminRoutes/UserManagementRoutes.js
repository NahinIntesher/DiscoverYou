const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  router.get("/user-management/students", verifyToken, (req, res) => {
    const query = `
      SELECT 
        s.student_id,
        s.student_name, 
        s.student_email, 
        s.student_mobile_no, 
        s.student_address, 
        s.student_gender, 
        s.student_date_of_birth,
        IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS student_picture
      FROM student s
    `;
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ students: result });
    });
  });
  router.get("/user-management/organizers", verifyToken, (req, res) => {
    const query = `
      SELECT
        o.organizer_id,
        o.organizer_name,
        o.organizer_email,
        o.organizer_mobile_no,
        o.organizer_address,
        o.organizer_gender,
        o.organizer_date_of_birth,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
      FROM organizer o
    `;
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ organizers: result });
    });
  });
  router.get("/user-management/admins", verifyToken, (req, res) => {
    const query = `
      SELECT
        a.admin_id,
        a.admin_name,
        a.admin_email,
        a.admin_mobile_no,
        a.admin_address,
        a.admin_gender,
        a.admin_date_of_birth,
        IF(a.admin_picture IS NOT NULL, CONCAT("http://localhost:3000/admin/profile/picture/", a.admin_id), NULL) AS admin_picture
      FROM admin a
    `;
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ admins: result });
    });
  });
  router.delete("/user-management/delete/:id", verifyToken, (req, res) => {
    const deletedId = req.params.id;
    console.log("Deleting user with ID:", deletedId);
    let query;
    if (deletedId[0] === "S") {
      query = `DELETE FROM student WHERE student_id = ?`;
    } else if (deletedId[0] === "O") {
      query = `DELETE FROM organizer WHERE organizer_id = ?`;
    } else if (deletedId[0] === "A") {
      query = `DELETE FROM admin WHERE admin_id = ?`;
    } else {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    console.log("Query:", query);
    connection.query(query, [deletedId], (err, result) => {
      if (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ message: "Failed to delete user" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({
        status: "Success",
        message: "User deleted successfully",
      });
    });
  });

};
