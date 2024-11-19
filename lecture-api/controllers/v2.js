const jwt = require("jsonwebtoken");
const { Domain, User, Hashtag, Post } = require("../models");
const cors = require("cors");

exports.createToken = async (req, res) => {
  const { frontSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { frontSecret },
      include: {
        model: User,
        attribute: ["nick", "id"],
      },
    });

    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요",
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3m",
        issuer: "nodebird",
      }
    );
    return res.json({
      code: 200,
      message: "토큰 발급되었습니다.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
};

exports.tokenTest = async (req, res) => {
  res.json(res.locals.decoded);
};

exports.getMyPosts = (req, res) => {
  Post.findAll({ where: { userId: res.locals.decoded.id } })
    .then((posts) => {
      res.json({ code: 200, payload: posts });
    })
    .catch((error) => {
      return res.status(500).json({
        code: 500,
        message: "서버 에러",
      });
    });
};

exports.getPostsByHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({
      where: { title: req.params.title },
    });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: "검색 결과가 없습니다.",
      });
    }
    const posts = await hashtag.getPosts();
    if (posts.length === 0) {
      return res.json({
        code: 404,
        message: "검색 결과가 없습니다.",
      });
    }
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      code: 500,
      message: "서버 에러",
    });
  }
};

exports.corsWhenDomainMatches = async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: new URL(req.get("origin")).host },
  });
  if (domain) {
    cors({
      origin: req.get("origin"),
      credentials: true,
    })(req, res, next);
  } else {
    next();
  }
};

exports.getFollowingsByUser = async (req, res) => {
  try {
    if (req.params?.id) {
      const user = await User.findOne({
        where: { id: req.params.id },
      });
      const followings = await user.getFollowings({
        attributes: ["id", "email", "nick"],
      });
      return res.json({
        code: 200,
        payload: followings,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      code: 500,
      massege: "서버 에러",
    });
  }
};

exports.getFollowersByUser = async (req, res) => {
  try {
    if (req.params?.id) {
      const user = await User.findOne({
        where: { id: req.params.id },
      });
      const followers = await user.getFollowers({
        attributes: ["id", "email", "nick"],
      });
      console.log(followers);

      return res.json({
        code: 200,
        payload: followers,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      code: 500,
      massege: "서버 에러",
    });
  }
};
