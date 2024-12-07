const { follow, unFollow, userPosts } = require("../services/user");

exports.follow = async (req, res, next) => {
  try {
    const result = await follow(req.user.id, req.params.id);
    if (result == "ok") {
      res.send("success");
    } else if (result == "no user") {
      res.status(404).send("no user");
    } else throw Error("알 수 없는 응답");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.unFollow = async (req, res, next) => {
  try {
    const result = await unFollow(req.user.id, req.params.id);
    if (result == "ok") {
      res.send("success");
    } else if (result == "no user") {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.userPosts = async (req, res, next) => {
  try {
    const result = await userPosts(req.params.id);
    if (result.message == "ok") {
      res.json(result.twits);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
