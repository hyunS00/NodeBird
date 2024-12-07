const User = require("../models/user");
const Post = require("../models/post");
exports.follow = async (userId, followingId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (user) {
    await user.addFollowing(parseInt(followingId, 10));
    return "ok";
  } else {
    return "no user";
  }
};

exports.unFollow = async (userId, unFollowId) => {
  const user = await User.findOne({ where: { userId } });
  if (user) {
    await user.removeFollowing(parseInt(unFollowId, 10));
    return "ok";
  } else {
    return "no user";
  }
};

exports.userPosts = async (userId) => {
  const posts = await Post.findAll({
    where: { UserId: parseInt(userId, 10) },
    include: [{ model: User, attributes: ["id", "nick"] }],
    oder: [["createdAt", "DESC"]],
  });
  return { message: "ok", twits: posts };
};
