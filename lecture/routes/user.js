const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares");
const { follow, unFollow, userPosts } = require("../controllers/user");

router.post("/:id/follow", isLoggedIn, follow);
router.post("/:id/unfollow", isLoggedIn, unFollow);
router.get("/:id/posts", userPosts);

module.exports = router;
