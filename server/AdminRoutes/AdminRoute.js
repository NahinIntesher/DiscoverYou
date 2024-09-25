const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");

// Import the routes from Contest.js
// require("./ContestRoutes")(router);
require("./ShowcaseRoutes")(router, multer);
require("./CommunityRoutes")(router);
require("./WebinarRoutes")(router);
require("./MarketplaceRoutes")(router, multer);
require("./HiringRoutes")(router);
require("./NotificationRoutes")(router);
require("./ProfileRoutes")(router, multer, bcrypt);

module.exports = router;
