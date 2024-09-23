const express = require("express");
const router = express.Router();
const multer = require("multer");

// Import the routes from Contest.js
// require("./ContestRoutes")(router);
require("./ShowcaseRoutes")(router, multer);
require("./WebinarRoutes")(router);
require("./HiringRoutes")(router);
require("./MarketplaceRoutes")(router, multer);
require("./NotificationRoutes")(router);
require("./ProfileRoutes")(router);

module.exports = router;
