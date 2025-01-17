const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");

// Import the routes from Contest.js
require("./DashboardRoutes")(router);
require("./ContestRoutes")(router, multer);
require("./ShowcaseRoutes")(router, multer);
require("./CommunityRoutes")(router);
require("./CourseRoutes")(router, multer);
require("./WebinarRoutes")(router);
require("./HiringRoutes")(router, multer);
require("./MarketplaceRoutes")(router, multer);
require("./NotificationRoutes")(router);
require("./ProfileRoutes")(router, multer, bcrypt);

module.exports = router;