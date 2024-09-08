const express = require("express");
const router = express.Router();
const multer = require("multer");

// Import the routes from Contest.js
// require("./ContestRoutes")(router);
// require("./ShowcaseRoutes")(router, multer);
// require("./CommunityRoutes")(router);
// require("./WebinarRoutes")(router);
require("./MarketplaceRoutes")(router, multer);

module.exports = router;
