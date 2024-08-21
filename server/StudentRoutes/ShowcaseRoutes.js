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
      const token = req.cookies.userRegistered;
      if (token) {
        const id = req.userId;
        const { content, category } = req.body;
        const files = req.files;

        connection.query(
          `INSERT INTO showcase_posts (post_content, poster_id, post_category)
      VALUES (?, ?, ?)`,
          [content, id, category],
          (err, results) => {
            if (err) throw err;
            let postId = results.insertId;

            if (files.length != 0) {
              for (const file of files) {
                const { mimetype, buffer } = file;
                connection.query(
                  `INSERT INTO showcase_post_media (post_id, post_media, media_type)
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
      } else {
        res.json({ Error: "No user logged" });
      }
    }
  );

  //showcase_post_media.post_media,

  router.get("/showcase/post", verifyToken, (req, res) => {
    const token = req.cookies.userRegistered;
    if (token) {
      const userId = req.userId;

      const query = `SELECT 
      showcase_posts.*, 
      user.name AS poster_name,
      TIMESTAMPDIFF(SECOND, showcase_posts.post_date_time, NOW()) AS post_time_ago,
      showcase_post_media.media_type,
      CASE
        WHEN EXISTS (
          SELECT *
          FROM showcase_post_reactions
          WHERE showcase_post_reactions.post_id = showcase_posts.post_id 
          AND showcase_post_reactions.reactor_id = ${userId}
        ) THEN 1
        ELSE 0
      END AS is_reacted,
      COUNT(DISTINCT p_r.reactor_id) AS reaction_count,
      COUNT(DISTINCT p_c.comment_id) AS comment_count,
      GROUP_CONCAT(
          CONCAT(
              '{"media_url": "http://localhost:3000/student/showcase/media/cdn/', showcase_post_media.media_id, 
              '", "media_type": "', showcase_post_media.media_type, '"}'
          ) 
          SEPARATOR ', '
      ) AS media_array
      FROM 
        showcase_posts 
      JOIN 
        user ON showcase_posts.poster_id = user.user_id
      LEFT JOIN 
        showcase_post_media ON showcase_post_media.post_id = showcase_posts.post_id
      LEFT JOIN 
        showcase_post_reactions p_r ON p_r.post_id = showcase_posts.post_id
      LEFT JOIN 
        showcase_post_comments p_c ON p_c.post_id = showcase_posts.post_id
      GROUP BY
        showcase_posts.post_id
      ORDER BY
        showcase_posts.post_date_time DESC;
    `;

      connection.query(query, (err, results) => {
        if (err) throw err;
        return res.json({ posts: results });
      });
    }
  });

  router.get("/showcase/media/cdn/:id", (req, res) => {
    const mediaId = req.params.id;

    connection.query(
      `
    SELECT media_type, post_media 
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
        const mediaData = media.post_media;

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
        `
      SELECT * 
      FROM showcase_post_reactions 
      WHERE post_id = ? AND reactor_id = ?`,
        [postId, userId],
        function (error, result) {
          if (error) throw error;
          if (result.length <= 0) {
            connection.query(
              `INSERT INTO showcase_post_reactions(post_id, reactor_id) 
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
            WHERE post_id = ? AND reactor_id = ?`,
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
};
