const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.join = async (nick, email, password) => {
  const exUser = await User.findOne({ where: { email } });
  console.log("회원가입: ", email);

  if (exUser) {
    return "exist user";
  }
  const hash = await bcrypt.hash(password, 12);
  await User.create({
    email,
    nick,
    password: hash,
  });
  return "ok";
};
