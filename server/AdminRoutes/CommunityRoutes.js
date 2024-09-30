const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {

  router.get("/community", verifyToken, (req, res) => {
    let userId = req.userId;
    
    const query = `SELECT 
      c.*, 
      s.student_name AS community_admin_name,
      IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS community_admin_picture,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM community_members
          WHERE community_members.community_id = c.community_id 
          AND community_members.member_id = '${userId}' AND community_members.req_for_join_status = 1
        )
        THEN "yes"
        WHEN EXISTS (
          SELECT *
          FROM community_members
          WHERE community_members.community_id = c.community_id 
          AND community_members.member_id = '${userId}' AND community_members.req_for_join_status = 0
        )
        THEN "pending"
        ELSE "no"
      END AS is_joined,
      COUNT(DISTINCT c_m.member_id) AS total_member
      FROM 
        communities AS c
      LEFT JOIN 
        student AS s
      ON 
        c.admin_id = s.student_id
      LEFT JOIN 
        community_members AS c_m
      ON 
        c.community_id = c_m.community_id AND c_m.req_for_join_status = 1
      WHERE 
        c.approval_status = 1
      GROUP BY
        c.community_id
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      connection.query(`
        SELECT * FROM communities WHERE communities.approval_status = 0
        `, (err, nestedResults) => {
          if (err) throw err;
          return res.json({ communities: results, myPendingCommunities: nestedResults.length });
      });
    });
  });


  router.get("/community/single/:communityId", verifyToken, (req, res) => {
    const communityId = req.params.communityId;
    const userId = req.userId;
    
    const query = `SELECT 
      c.*, 
      s.student_name AS admin_name,
      COUNT(DISTINCT c_m.member_id) AS total_member
      FROM 
        communities AS c
      JOIN 
        student AS s
      ON 
        c.admin_id = s.student_id
      JOIN 
        community_members AS c_m
      ON 
        c.community_id = c_m.community_id
      WHERE 
        c.community_id = ${communityId}
      GROUP BY
        c.community_id
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      connection.query(`
        SELECT 
          c_m.*,
          CASE
            WHEN c_m.member_id = '${userId}'
            THEN true
            ELSE false
          END AS own_message,
          s.student_name AS messenger_name
        FROM 
          community_messages AS c_m
        JOIN 
          student AS s
        ON
          c_m.member_id = s.student_id
        WHERE 
          community_id = ${communityId} 
        ORDER BY 
          message_time DESC
        `, (err, nestedResults) => {
          if (err) throw err;
          return res.json({ community: results[0], messages: nestedResults });
      });
    });
  });
  
  router.get("/community/pending", verifyToken, (req, res) => {
    const query = `SELECT 
      c.*, 
      s.student_name AS community_admin_name,
      IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS community_admin_picture,
      s.student_id AS community_admin_id,
      COUNT(DISTINCT c_m.member_id) AS total_member
      FROM 
        communities AS c
      LEFT JOIN 
        student AS s
      ON 
        c.admin_id = s.student_id
      LEFT JOIN 
        community_members AS c_m
      ON 
        c.community_id = c_m.community_id AND c_m.req_for_join_status = 1
      WHERE 
        c.approval_status = 0
      GROUP BY
        c.community_id
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      return res.json({ communities: results });
    });
  });

  router.post(
    "/community/approve",
    verifyToken,
    (req, res) => {
      const userId = req.userId;
      const { adminId, communityId } = req.body;
      connection.query(
        `UPDATE communities SET approval_status = '1', approver_id = ? 
        WHERE community_id = ?;`,
        [userId, communityId],
        (err, results) => {
          if (err) throw err;
          connection.query(
            `INSERT INTO community_members (community_id, member_id, req_for_join_status)
            VALUES (?, ?, ?)`,
            [communityId, adminId, 1],
            (err, nestedResults) => {
              if (err) throw err;
          
              return res.json({ status: "Success" });
            }
          );
        }
      );
    }
  );

  router.post(
    "/community/reject",
    verifyToken,
    (req, res) => {
      const { communityId } = req.body;
      connection.query(
        `DELETE FROM communities 
        WHERE community_id = ?;`,
        [communityId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );
};
