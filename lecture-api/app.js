const express = require("express");
const cookieParser = require("cookie-parser"); // 쿠키를 위한
const morgan = require("morgan"); // 로깅
const path = require("path"); // 내장모듈
const session = require("express-session"); // 세션
const nunjucks = require("nunjucks"); // 렌더링
const dotenv = require("dotenv"); // 설정파일
const passport = require("passport");
const { sequelize } = require("./models");

dotenv.config(); // process.env
const authRouter = require("./routes/auth");
const indexRouter = require("./routes");
const v1Router = require("./routes/v1");
const v2Router = require("./routes/v2");
const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8002);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false }) // 개발시에만 true
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev")); // 개발모드로 로깅
app.use(express.static(path.join(__dirname, "public"))); // 정적폴더를 public으로 설정
app.use(express.json()); // json 요청
app.use(express.urlencoded({ extended: false })); // form 요청
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키를 처리
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송
// 브라우저 connect.sid = 54123t459256780

app.use("/auth", authRouter);
app.use("/", indexRouter);
app.use("/v1", v1Router);
app.use("/v2", v2Router);

app.use((req, res, next) => {
  // 404 NOT FOUND
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
