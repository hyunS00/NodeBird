const express = require("express");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();
const { updateProfile } = require("../controllers/profile");

router.post("/update", isLoggedIn, updateProfile);

module.exports = router;
