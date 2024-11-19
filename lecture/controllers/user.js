const { User, Post } = require("../models");
exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.unFollow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send("sucess");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.userPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: { UserId: parseInt(req.params.id, 10) },
      include: [{ model: User, attributes: ["id", "nick"] }],
      oder: [["createdAt", "DESC"]],
    });
    if (posts) {
      console.log(posts);

      res.json({ twits: posts });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
