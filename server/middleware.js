const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.userRegistered;

  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, "1234");
    req.userId = decoded.id; // Ensure userId is correctly set
    next();
  } catch (err) {
    return res.json({ Error: "Invalid token" });
  }
};

module.exports = verifyToken;
