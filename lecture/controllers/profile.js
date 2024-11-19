const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.updateProfile = async (req, res, next) => {
  const { nick, password } = req.body;
  try {
    const userId = req.user.id; // 현재 로그인한 사용자 ID
    if (!nick) {
      return res.status(400).send("no nick");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.update({ nick, password: hash }, { where: { id: userId } });

    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
