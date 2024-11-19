const Post = require("../models/post");
const User = require("../models/user");
const Hashtag = require("../models/hashtag");

exports.renderProfile = (req, res, next) => {
  // 서비스 호출
  res.render("profile", { title: "내 정보 - NodeBird" });
};
exports.renderJoin = (req, res, next) => {
  res.render("join", { title: "회원 가입 - NodeBird" });
};
exports.renderMain = async (req, res, next) => {
  const where = {};

  // req.params.id가 존재하면 where에 userId 추가
  if (req.params?.id) {
    where.userId = req.params.id;
  }

  try {
    const posts = await Post.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log("user: ", req.user?.id);
    const twits = posts
      .map((post) => ({
        ...post.toJSON(),
        Likers: post.Likers.map((user) => user.id),
      }))
      .map((post) => ({
        ...post,
        isLiked: post.Likers.includes(req.user?.id),
      }));
    res.render("main", {
      title: "NodeBird",
      twits,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 컨트롤러는 서비스를 호출
// 라우터 -> 컨트롤러(요청, 응답 알고 있음) -> 서비스(요청, 응답 모름)

exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }

  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({
        include: [{ model: User, attributes: ["id", "nick"] }],
      });
    }

    return res.render("main", {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderUpdateProfile = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.user.id } });
  if (user) {
    res.render("update");
  }
};
