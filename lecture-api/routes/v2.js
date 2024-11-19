const express = require("express");
const { verifyToken, apiLimiter } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
  corsWhenDomainMatches,
  getFollowersByUser,
  getFollowingsByUser,
} = require("../controllers/v2");
const router = express.Router();

// router.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");
//   next();
// });

router.use(corsWhenDomainMatches);

// 토큰 발급 라우터
// /v2/token
router.post("/token", apiLimiter, createToken);

// 토큰 테스트 라우터
router.get("/test", apiLimiter, verifyToken, tokenTest);

router.get("/posts/my", verifyToken, apiLimiter, getMyPosts);
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag);
// router.get("/user/:id/follower", verifyToken, apiLimiter, getFollowerByUser);
router.get(
  "/user/:id/followings",
  verifyToken,
  apiLimiter,
  getFollowingsByUser
);

router.get("/user/:id/followers", verifyToken, apiLimiter, getFollowersByUser);
module.exports = router;
