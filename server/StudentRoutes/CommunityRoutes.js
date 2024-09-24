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
      s.student_name AS community_admin_name,
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
            WHEN c_m.messenger_id = '${userId}'
            THEN true
            ELSE false
          END AS own_message,
          s.student_name AS messenger_name
        FROM 
          community_messages AS c_m
        JOIN 
          student AS s
        ON
          c_m.messenger_id = s.student_id
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
  
  router.post(
    "/community/new",
    verifyToken,
    (req, res) => {
        const userId = req.userId;
        const { communityName, communityCategory, communityDescription } = req.body;
  
        connection.query(
          `INSERT INTO communities (community_name, community_category, community_description, admin_id, approval_status)
          VALUES (?, ?, ?, ?, ?)`,
          [communityName, communityCategory, communityDescription, userId, 1],
          (err, results) => {
            if (err) throw err;
            let communityId = results.insertId;
            connection.query(
              `INSERT INTO community_members (community_id, member_id, req_for_join_status)
              VALUES (?, ?, ?)`,
              [communityId, userId, 1],
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
    "/community/message",
    verifyToken,
    (req, res) => {
        const userId = req.userId;
        const { message, communityId } = req.body;
  
        connection.query(
          `INSERT INTO community_messages (community_id, messenger_id, message_content)
          VALUES (?, ?, ?)`,
          [communityId, userId, message],
          (err, results) => {
            if (err) throw err;
            return res.json({ status: "Success" });
          }
        );
    }
  );


  router.post("/community/join", verifyToken, (req, res) => {
    const userId = req.userId;
    const { communityId } = req.body;

    connection.query(
      "SELECT * FROM community_members WHERE community_id = ? AND member_id = ?",
      [communityId, userId],
      (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          connection.query(
            "DELETE FROM community_members WHERE community_id = ? AND member_id = ?;",
            [communityId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Unregistered" });
            }
          );
        } else {
          connection.query(
            "INSERT INTO community_members(community_id, member_id) VALUES (?, ?);",
            [communityId, userId],
            function (err, results) {
              if (err) throw err;
              return res.json({ status: "Registered" });
            }
          );
        }
      }
    );
  });


  router.get("/community/pendingMembers", verifyToken, (req, res) => {
    const userId = req.userId;
    
    const query = `SELECT 
      c_m.*,
      s.student_name as member_name,
      c.community_name,
      c.admin_id
      FROM 
        community_members AS c_m
      JOIN 
        communities AS c
      ON
        c_m.community_id = c.community_id
      JOIN 
        student AS s
      ON
        c_m.member_id = s.student_id
      WHERE
        c.admin_id = '${userId}' AND c_m.req_for_join_status = 0
      `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      return res.json({ pendingMembers: results });
    });
  });

  router.post(
    "/community/member/approve",
    verifyToken,
    (req, res) => {
      const { memberId, communityId } = req.body;
      connection.query(
        `UPDATE community_members SET req_for_join_status = '1' 
        WHERE member_id = ? AND community_id = ?;`,
        [memberId, communityId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );

  router.post(
    "/community/member/reject",
    verifyToken,
    (req, res) => {
      const { memberId, communityId } = req.body;
      connection.query(
        `DELETE FROM community_members 
        WHERE member_id = ? AND community_id = ?;`,
        [memberId, communityId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );

};
