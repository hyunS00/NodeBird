const express = require("express");
const {
  test,
  getMyPosts,
  searchByHashtag,
  renderMain,
  getUserFollowings,
  getUserFollowers,
} = require("../controllers");
const router = express.Router();

// router.get("/test", test);

router.get("/myposts", getMyPosts);
router.get("/search/:hashtag", searchByHashtag);
router.get("/followings/:id", getUserFollowings);
router.get("/followers/:id", getUserFollowers);
router.get("/", renderMain);

module.exports = router;
