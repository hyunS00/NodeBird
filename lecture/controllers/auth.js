const passport = require("passport");
const User = require("../models/user");
const { join } = require("../services/auth");

exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body;
  try {
    const result = await join(nick, email, password);
    if (result == "exist user") {
      return res.redirect("/join?error=exist");
    } else if (result == "ok") {
      return res.redirect("/");
    } else throw Error("식별되지 않은 결과값");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//POST /auth/login
exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }

    return req.login(user, (loginError) => {
      // 로그인 성공
      if (loginError) {
        // 로그인중에 실해할 수도 있으니 혹시나
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
};
