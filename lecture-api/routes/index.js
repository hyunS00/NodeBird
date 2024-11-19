const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares");
const { renderLogin, createDomain } = require("../controllers");

router.get("/", renderLogin);
router.post("/domain", isLoggedIn, createDomain);

module.exports = router;
