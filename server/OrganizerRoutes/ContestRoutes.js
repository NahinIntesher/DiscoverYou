const express = require("express");
const router = express.Router();
const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router) => {
  const queryPromise = (query, params) => {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  };


  router.get("/contests/pending-details", verifyToken, (req, res) => {
    const userId = req.userId;
    connection.query(`SELECT 
      c.contest_id, c.contest_name
      FROM 
        contests AS c
      WHERE
        c.organizer_id = '${userId}' AND c.result_given = 0 AND c.approval_status = 1`,
      (err, resultPendingResults) => {
        if (err) throw err;
        connection.query(`SELECT 
      c.contest_id
      FROM 
        contests AS c
      WHERE
        c.organizer_id = '${userId}' AND c.approval_status = 0`,
          (err, contestPendingResults) => {
            if (err) throw err;
            return res.json({
              contestPendingNo: contestPendingResults.length,
              resultPending: resultPendingResults
            });
          });
      });
  });

  router.get("/contests/ongoing", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT 
        contests.*,
        TIMESTAMPDIFF(SECOND, NOW(), contests.end_time) AS calculated_time,
        organizer.organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
        COUNT(contest_participants.contest_id) AS participant_count,
        CASE
          WHEN contests.organizer_id = ?
          THEN true
          ELSE false
        END AS is_own
      FROM 
        contests 
      JOIN 
        organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
        contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
        (NOW() >= contests.start_time) AND (NOW() <= contests.end_time) AND contests.approval_status = 1
      GROUP BY 
        contests.contest_id
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });

  router.get("/contests/upcoming", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT 
        contests.*,
        TIMESTAMPDIFF(SECOND, NOW(), contests.start_time) AS calculated_time, 
        organizer.organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
        COUNT(contest_participants.contest_id) AS participant_count,
        CASE
          WHEN contests.organizer_id = ?
          THEN true
          ELSE false
        END AS is_own
      FROM 
        contests 
      JOIN 
        organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
        contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
        NOW() < contests.start_time AND contests.approval_status = 1
      GROUP BY 
        contests.contest_id
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });

  router.get("/contests/previous", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT 
        contests.*,
        organizer.organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
        COUNT(contest_participants.contest_id) AS participant_count,
        CASE
          WHEN contests.organizer_id = ?
          THEN true
          ELSE false
        END AS is_own
      FROM 
        contests 
      JOIN 
        organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
        contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
        NOW() > contests.end_time AND contests.approval_status = 1
      GROUP BY 
        contests.contest_id
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });

  router.get("/contests/my", verifyToken, (req, res) => {
    const userId = req.userId;
    const query = `
      SELECT 
        contests.*,
        organizer.organizer_name,
        IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
        COUNT(contest_participants.contest_id) AS participant_count,
        CASE
          WHEN (NOW() >= contests.start_time) AND (NOW() <= contests.end_time)
          THEN TIMESTAMPDIFF(SECOND, NOW(), contests.end_time)
          ELSE TIMESTAMPDIFF(SECOND, NOW(), contests.start_time)
        END AS calculated_time,
        CASE
          WHEN (NOW() >= contests.start_time) AND (NOW() <= contests.end_time)
          THEN "ongoing"
          WHEN NOW() < contests.start_time 
          THEN "upcoming"
          ELSE "previous"
        END AS contest_type
      FROM 
        contests 
      JOIN 
        organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
        contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
        contests.approval_status = 1 AND contests.organizer_id = ?
      GROUP BY 
        contests.contest_id
      `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching contests:", err);
        return res.json({ Error: "Error fetching contests" });
      }
      return res.json({ contests: results });
    });
  });


  router.get("/contests/profile", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT 
        c.contest_id, c.contest_name, c.contest_category, c.contest_details, COUNT(c.contest_id) AS total_contests,
        o.organizer_name AS organizer_name,
        IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL) AS organizer_picture
        FROM contests c
        JOIN organizer o ON o.organizer_id = c.organizer_id
        WHERE c.organizer_id = ?`;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ contestResults: result });
    });
  });

  router.get("/contests/pending", verifyToken, (req, res) => {
    let userId = req.userId;

    const query = `
      SELECT w.*, COUNT(w_p.contest_id) AS participant_count,
      TIMESTAMPDIFF(SECOND,NOW(), w.end_time) AS calculated_time,
      organizer.organizer_name AS host_name,
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS host_picture,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM contest_participants
          WHERE contest_participants.contest_id = w.contest_id
        )
        THEN true
        ELSE false
      END AS is_joined
      FROM 
          contests w
      LEFT JOIN 
          contest_participants w_p
      ON 
          w.contest_id = w_p.contest_id
      LEFT JOIN 
          organizer
      ON 
          w.organizer_id = organizer.organizer_id
      WHERE
        w.organizer_id = '${userId}' AND w.approval_status = 0
      GROUP BY 
          w.contest_id;
    `;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Failed" });
      }

      return res.json({ contests: result });
    });
  });

  router.get("/contests/:contestId", verifyToken, async (req, res) => {
    const { contestId } = req.params;
    const userId = req.userId;

    // Define queries
    const contestQuery = `
      SELECT contests.*,
      CASE 
        WHEN NOW() < contests.start_time THEN TIMESTAMPDIFF(SECOND, NOW(), contests.start_time)
        ELSE TIMESTAMPDIFF(SECOND, NOW(), contests.end_time)    
          END AS calculated_time,
      organizer.organizer_name AS organizer_name, 
      IF(organizer.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", organizer.organizer_id), NULL) AS organizer_picture,
      COUNT(contest_participants.contest_id) AS participant_count,
      CASE
        WHEN (NOW() >= contests.start_time) AND (NOW() <= contests.end_time)
        THEN "ongoing"
        WHEN NOW() < contests.start_time 
        THEN "upcoming"
        ELSE "previous"
      END AS contest_type,
      CASE
        WHEN contests.organizer_id = ?
        THEN true
        ELSE false
      END AS is_own
      FROM 
          contests 
      LEFT JOIN 
          organizer ON contests.organizer_id = organizer.organizer_id 
      LEFT JOIN 
          contest_participants ON contests.contest_id = contest_participants.contest_id 
      WHERE 
          contests.approval_status = 1 && contests.contest_id = ?
      GROUP BY 
          contests.contest_id;`;

    const problemsQuery = `
      SELECT problem_id, contest_id, problem_description, problem_name, sample_input, sample_output 
      FROM contest_problems
      WHERE contest_id = ?`;

    const participantsQuery = `
      SELECT 
        cp.participant_id, 
        cp.result_position, 
        st.student_name AS participant_name,
        IF(st.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", st.student_id), NULL) AS participant_picture,
        CASE
          WHEN EXISTS (
            SELECT * FROM contest_submissions
            WHERE contest_submissions.contest_id = ?
            AND contest_submissions.participant_id = cp.participant_id
          )
          THEN 1
          ELSE 0
        END AS is_submitted
      FROM 
        contest_participants cp
      JOIN 
        student st ON cp.participant_id = st.student_id
      WHERE 
        cp.contest_id = ?
      ORDER BY 
        cp.result_position`;

    try {
      // Fetch contest details
      const contestResults = await queryPromise(contestQuery, [
        userId,
        contestId
      ]);
      // if (contestResults.length === 0) {
      //   return res.json({ Error: "Contest not found" });
      // }
      const contest = contestResults[0];

      // Fetch contest problems
      const problemsResults = await queryPromise(problemsQuery, [contestId]);

      // Fetch contest participants
      const participantsResults = await queryPromise(participantsQuery, [
        contestId, contestId
      ]);

      // Combine and return the results
      return res.json({
        contest,
        problems: problemsResults,
        participants: participantsResults
      });
    } catch (error) {
      console.error("Error fetching contest data:", error);
      return res.json({ Error: "Error fetching contest data" });
    }
  });


  router.post(
    "/contests/give-result",
    verifyToken,
    (req, res) => {
      const { participants, contestId } = req.body;

      console.log(participants);

      console.log(contestId);

      participants.forEach(participant => {
        connection.query(
          `UPDATE contest_participants SET result_position = ? 
        WHERE participant_id = ? AND contest_id = ?;`,
          [participant.result_position, participant.participant_id, contestId],
          (err, results) => {
            if (err) throw err;
          }
        );
      });

      connection.query(
        `UPDATE contests SET result_given = 1 
        WHERE contest_id = ?;`,
        [contestId],
        (err, results) => {
          if (err) throw err;
          return res.json({ status: "Success" });
        }
      );
    }
  );


  router.post(
    "/contest/new",
    verifyToken,
    (req, res) => {
        const userId = req.userId;

        const { contestName, contestCategory, contestDescription, startTime, endTime, problems } = req.body;
  
        connection.query(
          `INSERT INTO contests (contest_name, contest_category, contest_details, start_time, end_time, organizer_id)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [contestName, contestCategory, contestDescription, startTime, endTime, userId],
          (err, results) => {
            if (err) throw err;
            if(contestCategory == "Competitive Programming" || contestCategory == "Web/App Designing") {
              let contestId = results.insertId;

              problems.forEach(problem => {
                connection.query(
                  `INSERT INTO contest_problems (contest_id, problem_name, problem_description, sample_input, sample_output)
                  VALUES(?,?,?,?,?);`,
                  [contestId, problem.problemName, problem.problemDescription, problem.sampleInput, problem.sampleOutput],
                  (err, results) => {
                    if (err) throw err;
                  }
                );
              });

              return res.json({ status: "Success" });
            }
            else {
              return res.json({ status: "Success" });
            }
          }
        );
    }
  );
};
