const Post = require("../models/post");
const Hashtag = require("../models/hashtag");

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  // req.body.content, req.body.url
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });

    // \#[^\s#]*/g
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (post) {
      await post.addLikers(req.user.id);
      res.send("success");
    } else {
      res.status(404).send("no post");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (post) {
      await post.removeLikers(req.user.id);
      res.send("success");
    } else {
      res.status(404).send("no post");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const result = await Post.destroy({ where: { id: req.params.id } });
    if (result) {
      res.send("success");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
