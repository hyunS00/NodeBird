jest.mock("../models/user");
const User = require("../models/user");
const { join } = require("./auth");

describe("join", () => {
  const nick = "bearn";
  const email = "test@gmail.com";
  const password = "test123";
  test("신규 회원이면 회원가입 후 ok를 반환함", async () => {
    User.findOne.mockReturnValue(null);
    User.create.mockReturnValue(null);
    const result = await join(nick, email, password);
    expect(result).toEqual("ok");
  });
  test("이미 있는 회원이 가입하려고하면 exist user를 반환함", async () => {
    const user = { nick, email, password };
    User.findOne.mockReturnValue(Promise.resolve({ user }));
    User.create.mockReturnValue(null);

    const result = await join(nick, email, password);
    expect(result).toEqual("exist user");
  });
});
