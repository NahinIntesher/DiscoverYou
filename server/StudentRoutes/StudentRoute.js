const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");

// Import the routes from Contest.js
require("./ContestRoutes")(router);
require("./ShowcaseRoutes")(router, multer);
require("./CommunityRoutes")(router);
require("./CourseRoutes")(router);
require("./WebinarRoutes")(router);
require("./HiringRoutes")(router);
require("./MarketplaceRoutes")(router, multer);
require("./NotificationRoutes")(router, multer);
require("./ProfileRoutes")(router, multer, bcrypt);

module.exports = router;