const connection = require("../Database/connection");
const verifyToken = require("../Middlewares/middleware");

module.exports = (router, multer) => {
  const storage = multer.memoryStorage();

  const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 10 MB
    fileFilter: (req, file, cb) => {
      const filetypes = /image\/|audio\/|video\//; // Accept all image, audio, and video types
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype) {
        return cb(null, true);
      } else {
        cb("Error: Images or PDF files only!");
      }
    },
  });

  router.post(
    "/showcase/post",
    upload.array("media"),
    verifyToken,
    (req, res) => {
      const id = req.userId;
      const { content, category } = req.body;
      const files = req.files;

      connection.query(
        `INSERT INTO showcase_posts (post_content, user_id, post_category)
      VALUES (?, ?, ?)`,
        [content, id, category],
        (err, results) => {
          if (err) throw err;
          let postId = results.insertId;

          if (files.length != 0) {
            for (const file of files) {
              const { mimetype, buffer } = file;
              connection.query(
                `INSERT INTO showcase_post_media (post_id, media_blob, media_type)
              VALUES (?, ?, ?)`,
                [postId, buffer, mimetype],
                (err, result) => {
                  if (err) {
                    console.error("Database insertion error:", err);
                    throw err;
                  }
                }
              );
            }
          }

          return res.json({ status: "Success" });
        }
      );
    }
  );

  //showcase_post_media.post_media,

  router.get("/showcase/post", verifyToken, (req, res) => {
    const { sort, category } = req.query;

    const userId = req.userId;

    const query = `SELECT 
    s_p.*, 
    s.student_name AS user_name,
    IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS user_picture,
    TIMESTAMPDIFF(SECOND, s_p.post_date_time, NOW()) AS post_time_ago,
    s_p_m.media_type,
    CASE
      WHEN EXISTS (
        SELECT *
        FROM showcase_post_reactions
        WHERE showcase_post_reactions.post_id = s_p.post_id 
        AND showcase_post_reactions.reactor_organizer_id = '${userId}'
      ) THEN 1
      ELSE 0
    END AS is_reacted,
    COUNT(DISTINCT s_p_r.reaction_id) AS reaction_count,
    COUNT(DISTINCT s_p_c.comment_id) AS comment_count,
    (
      SELECT 
        GROUP_CONCAT(
          CONCAT(
            '{"media_url": "http://localhost:3000/student/showcase/media/cdn/', s_p_m.media_id, 
            '", "media_type": "', s_p_m.media_type, '"}'
          ) SEPARATOR ', '
        )
      FROM 
        showcase_post_media AS s_p_m
      WHERE 
        s_p_m.post_id = s_p.post_id
    ) AS media_array
    FROM 
      showcase_posts AS s_p
    JOIN 
      student AS s 
    ON s_p.user_id = s.student_id
    LEFT JOIN 
      showcase_post_media AS s_p_m
    ON s_p_m.post_id = s_p.post_id
    LEFT JOIN 
      showcase_post_reactions AS s_p_r 
    ON s_p_r.post_id = s_p.post_id
    LEFT JOIN 
      showcase_post_comments AS s_p_c 
    ON s_p_c.post_id = s_p.post_id
    WHERE 
      s_p.post_category IN(${category})
    GROUP BY
      s_p.post_id
    ORDER BY
      ${sort} DESC;
    `;

    connection.query(query, (err, results) => {
      if (err) throw err;
      return res.json({ posts: results });
    });
  });

  router.get("/showcase/singlePost/:postId", verifyToken, (req, res) => {
    const userId = req.userId;
    const postId = req.params.postId;

    const query = `SELECT 
    s_p.*, 
    s.student_name AS user_name,
    IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL) AS user_picture,
    TIMESTAMPDIFF(SECOND, s_p.post_date_time, NOW()) AS post_time_ago,
    s_p_m.media_type,
    CASE
      WHEN EXISTS (
        SELECT *
        FROM showcase_post_reactions
        WHERE showcase_post_reactions.post_id = s_p.post_id 
        AND showcase_post_reactions.reactor_organizer_id = '${userId}'
      ) THEN 1
      ELSE 0
    END AS is_reacted,
    COUNT(DISTINCT s_p_r.reactor_organizer_id) AS reaction_count,
    COUNT(DISTINCT s_p_c.comment_id) AS comment_count,
    (
      SELECT 
        GROUP_CONCAT(
          CONCAT(
            '{"media_url": "http://localhost:3000/student/showcase/media/cdn/', s_p_m.media_id, 
            '", "media_type": "', s_p_m.media_type, '"}'
          ) SEPARATOR ', '
        )
      FROM 
        showcase_post_media AS s_p_m
      WHERE 
        s_p_m.post_id = s_p.post_id
    ) AS media_array
    FROM 
      showcase_posts AS s_p
    JOIN 
      student AS s 
    ON s_p.user_id = s.student_id
    LEFT JOIN 
      showcase_post_media AS s_p_m
    ON s_p_m.post_id = s_p.post_id
    LEFT JOIN 
      showcase_post_reactions AS s_p_r 
    ON s_p_r.post_id = s_p.post_id
    LEFT JOIN 
      showcase_post_comments AS s_p_c 
    ON s_p_c.post_id = s_p.post_id
    WHERE
      s_p.post_id = ${postId}
    GROUP BY
      s_p.post_id
    ORDER BY
      s_p.post_date_time DESC;
    `;

    connection.query(query, (err, results) => {
      if (err) throw err;

      connection.query(
        `
        SELECT 
          s_p_c.*,
          TIMESTAMPDIFF(SECOND, s_p_c.comment_date_time, NOW()) AS comment_time_ago,
          CASE 
            WHEN s_p_c.commentator_student_id IS NOT NULL THEN s.student_name
            WHEN s_p_c.commentator_organizer_id IS NOT NULL THEN o.organizer_name
            WHEN s_p_c.commentator_admin_id IS NOT NULL THEN a.admin_name
            ELSE NULL
          END AS commentator_name,
          CASE 
            WHEN s_p_c.commentator_student_id IS NOT NULL THEN s.student_id
            WHEN s_p_c.commentator_organizer_id IS NOT NULL THEN o.organizer_id
            WHEN s_p_c.commentator_admin_id IS NOT NULL THEN a.admin_id
            ELSE NULL
          END AS commentator_id,
          CASE 
            WHEN s_p_c.commentator_student_id IS NOT NULL THEN IF(s.student_picture IS NOT NULL, CONCAT("http://localhost:3000/student/profile/picture/", s.student_id), NULL)
            WHEN s_p_c.commentator_organizer_id IS NOT NULL THEN IF(o.organizer_picture IS NOT NULL, CONCAT("http://localhost:3000/organizer/profile/picture/", o.organizer_id), NULL)
            WHEN s_p_c.commentator_admin_id IS NOT NULL THEN IF(a.admin_picture IS NOT NULL, CONCAT("http://localhost:3000/admin/profile/picture/", a.admin_id), NULL)
            ELSE NULL
          END AS commentator_picture
        FROM 
          showcase_post_comments AS s_p_c 
        LEFT JOIN
          student AS s
        ON
          s_p_c.commentator_student_id = s.student_id
        LEFT JOIN
          organizer AS o
        ON
          s_p_c.commentator_organizer_id = o.organizer_id
        LEFT JOIN
          admin AS a
        ON
          s_p_c.commentator_admin_id = a.admin_id
        WHERE
          s_p_c.post_id = ?
        ORDER BY
          s_p_c.comment_date_time DESC;
      `,
        [postId],
        (err, nestedResult) => {
          if (err) throw err;

          return res.json({ post: results[0], comments: nestedResult });
        }
      );
    });
  });

  router.get("/showcase/media/cdn/:id", (req, res) => {
    const mediaId = req.params.id;

    connection.query(
      `
    SELECT media_type, media_blob
    FROM showcase_post_media 
    WHERE media_id = ?
  `,
      [mediaId],
      (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          return res.status(404).send("Media not found.");
        }

        const media = results[0];
        const mediaType = media.media_type;
        const mediaData = media.media_blob;

        res.setHeader("Content-Type", mediaType);

        res.send(mediaData);
      }
    );
  });

  router.post("/showcase/react", verifyToken, function (req, res) {
    const token = req.cookies.userRegistered;
    if (token) {
      const userId = req.userId;
      let { postId } = req.body;

      console.log(postId);
      console.log(userId);

      connection.query(
        `SELECT * 
      FROM showcase_post_reactions 
      WHERE post_id = ? AND reactor_organizer_id = ?`,
        [postId, userId],
        function (error, result) {
          if (error) throw error;
          if (result.length <= 0) {
            connection.query(
              `INSERT INTO showcase_post_reactions(post_id, reactor_organizer_id) 
          VALUES(?, ?)`,
              [postId, userId],
              function (error, result) {
                if (error) throw error;
                return res.json({ status: "Success", message: "Liked" });
              }
            );
          } else {
            connection.query(
              `DELETE FROM showcase_post_reactions 
            WHERE post_id = ? AND reactor_organizer_id = ?`,
              [postId, userId],
              function (error, result) {
                if (error) throw error;
                return res.json({ status: "Success", message: "Unliked" });
              }
            );
          }
        }
      );
    }
  });

  router.post("/showcase/comment", verifyToken, (req, res) => {
    const userId = req.userId;
    const { postId, commentContent } = req.body;

    connection.query(
      `INSERT INTO showcase_post_comments (comment_content, post_id, commentator_organizer_id)
          VALUES (?, ?, ?)`,
      [commentContent, postId, userId],
      (err, results) => {
        if (err) throw err;

        return res.json({ status: "Success" });
      }
    );
  });

  router.post("/showcase/post-delete", verifyToken, (req, res) => {
    const { postId, reporterId } = req.body;

    let query;
    if (reporterId[0] === "S") {
      query = `DELETE FROM showcase_posts WHERE post_id = ? AND reported_student_id = ?`;
    } else if (reporterId[0] === "O") {
      query = `DELETE FROM showcase_posts WHERE post_id = ? AND reported_organizer_id = ?`;
    }

    connection.query(query, [postId, reporterId], (err, results) => {
      if (err) throw err;
      return res.json({ status: "Success" });
    });
  });
};
