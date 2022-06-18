const express = require("express");
const router = express.Router();

const siteController = require("../app/controllers/SiteController");

router.get("/search", siteController.search);
// router.post("/signup", siteController.signUp);
router.get("/login", siteController.login);
router.get("/signup", siteController.signUp);
router.get("/", siteController.index);

module.exports = router;
